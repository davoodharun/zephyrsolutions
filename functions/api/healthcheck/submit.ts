/**
 * POST /api/healthcheck/submit
 * Handles health check form submissions
 */

import type { Env } from '../types';
import { validateEnv } from '../../_lib/env';
import { validateHealthCheckSubmission, validateHoneypot, validateHealthCheckReport, normalizeHealthCheckReport } from '../../_lib/validation';
import { createNotionLead, updateNotionLead, markLeadForManualReview } from '../../_lib/notion';
import { generateReport, repairReport, generateEmailContent } from '../../_lib/llm';
import { generateReportToken } from '../../_lib/crypto';
import { sendEmail } from '../../_lib/email';

// Rate limiting helper (simple in-memory for MVP, can use KV for production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const key = ip;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

/**
 * System prompt for LLM
 */
const SYSTEM_PROMPT = `You are a conservative nonprofit IT advisor with deep experience helping smaller organizations and non-profits navigate technology challenges.

Persona:
- Conservative approach: Focus on stability, affordability, and staff simplicity
- Plain English: No jargon, or define technical terms when necessary
- Practical solutions: Recommend tools and approaches that work for smaller teams with limited budgets
- Non-technical audience: Your recommendations are for organizations where staff may not have IT backgrounds
- Don't recommend trendy tools without strong justification

Safety Guidelines:
- Never request passwords, API keys, donor PII, or sensitive details
- Never recommend storing sensitive data insecurely
- Focus on practical, implementable solutions

Output Requirements:
- JSON only: No markdown formatting, no code blocks, pure JSON
- Strict schema compliance: Output must match the provided JSON schema exactly
- No additional fields: Only include fields defined in the schema
- Valid JSON: Must be parseable JSON, no syntax errors`;

/**
 * Report generation prompt template
 */
function getReportPrompt(submission: any): string {
  return `Generate a personalized IT health check report based on the following organization assessment.

## Input Data

${JSON.stringify(submission, null, 2)}

## Task

Analyze this organization's IT situation and produce a HealthCheckReport JSON that exactly matches the provided schema.

## Report Requirements

1. Summary: 2-4 sentences providing an overall assessment of their IT readiness
2. Readiness Score: Rate from 1-5 where 1-2 = significant gaps, 3 = some concerns, 4-5 = generally good
3. Readiness Label: "Watch" (monitor), "Plan" (develop plan), or "Act" (take action soon)
4. Top Risks: 2-5 items that pose the greatest risk
5. Top Priorities: 2-4 items that should be addressed first
6. Do Not Worry Yet: 1-3 items that are acceptable for now
7. Next Steps: 3-6 concrete, actionable steps
8. Recommended Entry Offer: Based on readiness level
9. Admin Notes: Internal notes for the business team

## Guidelines

- Use plain English, no technical jargon
- Be specific and actionable
- Consider their budget comfort and timeline
- Focus on practical solutions for smaller organizations
- Be encouraging but honest about risks

Output ONLY valid JSON that matches the HealthCheckReport schema. No markdown, no code blocks, no explanations - just the JSON object.`;
}

/**
 * Email generation prompt template
 */
function getEmailPrompt(report: any, orgName: string, contactName: string, reportUrl: string): string {
  return `Generate a warm, personalized email body for a nonprofit organization that just completed the IT health check assessment.

## Report Data

Readiness: ${report.readiness_score}/5 (${report.readiness_label})
Summary: ${report.summary}
Top Priorities: ${report.top_priorities.map((p: any) => p.title).join(', ')}

## Contact Information

- Organization: ${orgName}
- Contact: ${contactName}
- Report Link: ${reportUrl}

## Task

Create an email body that:
1. Thanks them for completing the assessment
2. Provides a brief, friendly summary of their readiness score and label
3. Highlights 2-3 key priorities from their report
4. Includes a clear call-to-action based on readiness_label:
   - "Watch": Offer free resources, gentle follow-up
   - "Plan": Offer fixed-price assessment, encourage planning conversation
   - "Act": Offer short call, emphasize urgency without being pushy
5. Includes the report link
6. Is warm, non-salesy, and written in plain English

## Tone

- Friendly and approachable
- Professional but not corporate
- Helpful without being pushy
- Acknowledges their specific situation

## Output Format

Provide the email in this format:
Subject: [subject line]

[email body text - 3-4 paragraphs max]`;
}

/**
 * Repair prompt template
 */
function getRepairPrompt(invalidJson: string, errors: string): string {
  return `The following JSON output failed validation against the required schema. Please correct it to match the schema exactly.

## Invalid JSON

${invalidJson}

## Schema Errors

${errors}

## Task

Output the corrected JSON that:
1. Fixes all schema validation errors
2. Maintains the original intent and content as much as possible
3. Matches the schema structure exactly
4. Contains all required fields with valid values

Output ONLY the corrected JSON. No markdown, no code blocks, no explanations - just the corrected JSON object.`;
}

// Handle CORS preflight requests
export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
};

// Handle POST requests
export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const request = context.request;
  const env = context.env;
  
  try {
    // Validate environment
    validateEnv(env);

    // Get client IP for rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 
                     request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                     'unknown';

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'rate_limit_exceeded',
        message: 'Too many requests. Please try again later.'
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    let submission: any;
    try {
      submission = await request.json();
    } catch (error) {
      return new Response(JSON.stringify({
        ok: false,
        error: 'invalid_json',
        message: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate honeypot
    if (!validateHoneypot(submission.honeypot)) {
      // Silently reject (don't reveal it's a honeypot)
      return new Response(JSON.stringify({ ok: true, lead_id: 'rejected', report_url: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate submission
    const validation = validateHealthCheckSubmission(submission);
    if (!validation.valid) {
      const errors: Record<string, string> = {};
      validation.errors?.forEach(err => {
        errors[err.field] = err.message;
      });

      return new Response(JSON.stringify({
        ok: false,
        error: 'validation_failed',
        errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create Notion lead (status: pending_generation)
    let leadId: string;
    try {
      leadId = await createNotionLead(submission, env);
    } catch (error) {
      console.error('Notion lead creation failed:', error);
      return new Response(JSON.stringify({
        ok: false,
        error: 'internal_error',
        message: 'Failed to process submission. Please try again later.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate report via LLM
    const llmKeySet = !!(env.LLM_API_KEY && String(env.LLM_API_KEY).trim());
    const llmUrlConfigured = !!(env.LLM_API_URL && String(env.LLM_API_URL).trim());
    const llmBaseUrl = env.LLM_API_URL?.trim() || 'https://api.openai.com/v1';
    console.log('LLM call: key_set=', llmKeySet, 'key_length=', env.LLM_API_KEY?.length ?? 0, 'url=', llmBaseUrl);

    let reportJson: string;
    let report: any;
    try {
      const reportPrompt = getReportPrompt(submission);
      reportJson = await generateReport(submission, SYSTEM_PROMPT, reportPrompt, env);
      report = JSON.parse(reportJson);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('LLM report generation failed:', errMsg);
      await markLeadForManualReview(leadId, env);
      // Send fallback email
      await sendEmail(submission.email, {
        subject: 'Thank you for your IT Health Check submission',
        body: `Hi ${submission.contact_name},\n\nThank you for completing the IT Health Check assessment for ${submission.org_name}. We're processing your results and will send your personalized report shortly.\n\nIf you have any questions, please don't hesitate to reach out.\n\nBest regards,\nZephyr Solutions`
      }, env);
      // Include safe error detail in response for debugging (no keys/tokens)
      const safeDetail = errMsg
        .replace(/\b(sk-|Bearer\s+)[^\s]+/gi, '[REDACTED]')
        .slice(0, 200);
      return new Response(JSON.stringify({
        ok: false,
        error: 'report_generation_failed',
        message: 'Report generation is temporarily unavailable. We will process your submission manually.',
        error_detail: safeDetail,
        debug: {
          llm_key_set: llmKeySet,
          llm_url_configured: llmUrlConfigured,
          llm_base_url: llmBaseUrl
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Normalize and validate report JSON
    report = normalizeHealthCheckReport(report as Record<string, unknown>) as any;
    let reportValidation = validateHealthCheckReport(report);

    // Attempt repair if validation fails
    if (!reportValidation.valid) {
      try {
        const repairPrompt = getRepairPrompt(reportJson, JSON.stringify(reportValidation.errors));
        reportJson = await repairReport(reportJson, JSON.stringify(reportValidation.errors), repairPrompt, env);
        report = normalizeHealthCheckReport(JSON.parse(reportJson) as Record<string, unknown>) as any;
        reportValidation = validateHealthCheckReport(report);
      } catch (repairError) {
        console.error('Report repair failed:', repairError);
      }
    }

    // If still invalid after repair, mark for manual review
    if (!reportValidation.valid) {
      await markLeadForManualReview(leadId, env);
      await sendEmail(submission.email, {
        subject: 'Thank you for your IT Health Check submission',
        body: `Hi ${submission.contact_name},\n\nThank you for completing the IT Health Check assessment for ${submission.org_name}. We're reviewing your submission and will send your personalized report shortly.\n\nBest regards,\nZephyr Solutions`
      }, env);

      return new Response(JSON.stringify({
        ok: false,
        error: 'report_validation_failed',
        message: 'We received your submission and will process it manually.',
        validation_errors: reportValidation.errors
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update Notion lead with report data
    try {
      await updateNotionLead(leadId, report, env);
    } catch (error) {
      console.error('Notion lead update failed:', error);
      // Continue - report is generated, just CRM update failed
    }

    // Generate report token
    const token = await generateReportToken(leadId, env.REPORT_TOKEN_SECRET);
    const reportUrl = `${env.PUBLIC_BASE_URL}/api/healthcheck/report?id=${token}`;

    // Generate and send email
    try {
      const emailPrompt = getEmailPrompt(report, submission.org_name, submission.contact_name, reportUrl);
      const emailContent = await generateEmailContent(
        report,
        submission.org_name,
        submission.contact_name,
        reportUrl,
        emailPrompt,
        env
      );
      
      await sendEmail(submission.email, emailContent, env);
    } catch (error) {
      console.error('Email sending failed:', error);
      // Don't fail the request - report is generated and stored
    }

    // Return success
    return new Response(JSON.stringify({
      ok: true,
      lead_id: leadId,
      report_url: reportUrl
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Unexpected error in submit endpoint:', error);
    const isMissingEnv = /missing required environment variable/i.test(errMsg);
    return new Response(JSON.stringify({
      ok: false,
      error: 'internal_error',
      message: isMissingEnv ? errMsg : 'An unexpected error occurred. Please try again later.',
      ...(isMissingEnv && { debug: { hint: 'Set Secrets in Cloudflare Pages → Settings → Environment variables (Production and Preview)' } })
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
