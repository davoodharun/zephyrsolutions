/**
 * LLM API client (OpenAI-compatible)
 * Handles calling LLM APIs for report generation and email content
 */

import type { Env } from './env';

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Calls LLM API to generate report JSON
 */
export async function generateReport(
  submission: any,
  systemPrompt: string,
  reportPrompt: string,
  env: Env
): Promise<string> {
  const apiUrl = env.LLM_API_URL || 'https://api.openai.com/v1';
  const endpoint = `${apiUrl}/chat/completions`;

  // Replace placeholder in report prompt
  const userPrompt = reportPrompt.replace('{{SUBMISSION}}', JSON.stringify(submission, null, 2));

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.LLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Use cost-effective model, can be made configurable
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in LLM response');
    }

    // Extract JSON from response (handle cases where LLM wraps JSON in markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    return content;
  } catch (error) {
    console.error('LLM API error:', error);
    throw new Error(`Failed to generate report: ${error}`);
  }
}

/**
 * Calls LLM API to repair invalid JSON
 */
export async function repairReport(
  invalidJson: string,
  schemaErrors: string,
  repairPrompt: string,
  env: Env
): Promise<string> {
  const apiUrl = env.LLM_API_URL || 'https://api.openai.com/v1';
  const endpoint = `${apiUrl}/chat/completions`;

  // Replace placeholders in repair prompt
  const userPrompt = repairPrompt
    .replace('{{INVALID_JSON}}', invalidJson)
    .replace('{{SCHEMA_ERRORS}}', schemaErrors);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.LLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Lower temperature for repair (more deterministic)
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in LLM repair response');
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return jsonMatch[0];
    }

    return content;
  } catch (error) {
    console.error('LLM repair error:', error);
    throw new Error(`Failed to repair report: ${error}`);
  }
}

/**
 * Calls LLM API to generate email content
 */
export async function generateEmailContent(
  report: any,
  orgName: string,
  contactName: string,
  reportUrl: string,
  emailPrompt: string,
  env: Env
): Promise<{ subject: string; body: string }> {
  const apiUrl = env.LLM_API_URL || 'https://api.openai.com/v1';
  const endpoint = `${apiUrl}/chat/completions`;

  // Replace placeholders in email prompt
  const userPrompt = emailPrompt
    .replace('{{REPORT}}', JSON.stringify(report, null, 2))
    .replace('{{ORG_NAME}}', orgName)
    .replace('{{CONTACT_NAME}}', contactName)
    .replace('{{REPORT_URL}}', reportUrl);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.LLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8, // Slightly higher for more natural email tone
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`LLM API error: ${error}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in LLM email response');
    }

    // Parse email content (assumes format: Subject: ...\n\nBody...)
    const subjectMatch = content.match(/Subject:\s*(.+?)(?:\n|$)/i);
    const subject = subjectMatch ? subjectMatch[1].trim() : 'Your IT Health Check Report';
    
    // Extract body (everything after "Subject:" line, or entire content if no subject line)
    let body = content;
    const subjectLineMatch = content.match(/Subject:.*?\n\n?/i);
    if (subjectLineMatch) {
      body = content.substring(subjectLineMatch[0].length).trim();
    }
    
    // If body is empty, use fallback
    if (!body || body.length < 10) {
      body = content;
    }

    return { subject, body };
  } catch (error) {
    console.error('LLM email generation error:', error);
    // Fallback to simple email
    return {
      subject: 'Your IT Health Check Report',
      body: `Hi ${contactName},\n\nThank you for completing the IT Health Check assessment for ${orgName}.\n\nYour personalized report is ready. View it here: ${reportUrl}\n\nBest regards,\nZephyr Solutions`
    };
  }
}
