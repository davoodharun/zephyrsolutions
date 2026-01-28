# Quickstart: AI Health Check Integration

**Feature**: 001-ai-health-check  
**Date**: 2026-01-26

## Overview

This guide provides integration scenarios and examples for the AI-driven Nonprofit IT Health Check workflow. It covers form submission, report generation, email delivery, and CRM integration patterns.

## Integration Scenarios

### Scenario 1: Form Submission and Report Generation

**Context**: A visitor completes the health check form on the marketing website.

**Flow**:
1. Visitor fills out form on `/health-check` page
2. JavaScript submits form data to `POST /api/healthcheck/submit`
3. Backend validates submission, creates Notion lead, generates report
4. Backend sends email with report link
5. Visitor receives email and clicks report link
6. Report page renders personalized assessment

**Example Form Submission**:
```javascript
// Frontend form submission
async function submitHealthCheck(formData) {
  const response = await fetch('/api/healthcheck/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      org_name: formData.orgName,
      contact_name: formData.contactName,
      email: formData.email,
      org_size: formData.orgSize,
      current_tools: formData.currentTools,
      top_pain_points: formData.painPoints,
      backups_maturity: formData.backups,
      security_confidence: formData.security,
      budget_comfort: formData.budget,
      timeline: formData.timeline,
      notes: formData.notes || '',
      honeypot: '' // Hidden field, must be empty
    })
  });
  
  const result = await response.json();
  if (result.ok) {
    // Show success message
    showSuccessMessage('Check your email in a few minutes for your personalized report!');
  } else {
    // Show validation errors
    showErrors(result.errors);
  }
}
```

**Example Backend Processing**:
```typescript
// functions/api/healthcheck/submit.ts
export default async function(request: Request, env: Env) {
  // 1. Validate submission
  const submission = await request.json();
  const validation = validateSubmission(submission);
  if (!validation.valid) {
    return new Response(JSON.stringify({ ok: false, errors: validation.errors }), {
      status: 400
    });
  }
  
  // 2. Create Notion lead
  const leadId = await createNotionLead(submission, env);
  
  // 3. Generate report
  const report = await generateReport(submission, env);
  
  // 4. Validate and repair report if needed
  const validatedReport = await validateAndRepairReport(report, env);
  
  // 5. Update Notion lead with report
  await updateNotionLead(leadId, validatedReport, env);
  
  // 6. Generate token and send email
  const token = generateReportToken(leadId, env);
  await sendReportEmail(submission.email, validatedReport, token, env);
  
  // 7. Return success
  return new Response(JSON.stringify({
    ok: true,
    lead_id: leadId,
    report_url: `${env.PUBLIC_BASE_URL}/api/healthcheck/report?id=${token}`
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### Scenario 2: Report Access and Rendering

**Context**: A visitor clicks the report link from their email.

**Flow**:
1. Visitor navigates to `/api/healthcheck/report?id=<token>`
2. Backend verifies token signature and expiration
3. Backend queries Notion for lead record
4. Backend extracts report JSON from lead
5. Backend renders HTML report page
6. Visitor views personalized assessment

**Example Token Verification**:
```typescript
// functions/api/healthcheck/report.ts
export default async function(request: Request, env: Env) {
  const url = new URL(request.url);
  const token = url.searchParams.get('id');
  
  if (!token) {
    return renderErrorPage('Token missing');
  }
  
  // Verify token
  const verification = verifyReportToken(token, env);
  if (!verification.valid) {
    return renderErrorPage(verification.expired ? 'Token expired' : 'Invalid token');
  }
  
  // Fetch lead from Notion
  const lead = await getNotionLead(verification.leadId, env);
  if (!lead) {
    return renderErrorPage('Report not found');
  }
  
  // Parse report JSON
  const report = JSON.parse(lead.reportJson);
  
  // Render HTML report
  return new Response(renderReportHTML(report), {
    headers: { 'Content-Type': 'text/html' }
  });
}
```

### Scenario 3: Error Handling and Manual Review

**Context**: Report generation fails validation after repair attempt.

**Flow**:
1. LLM generates report JSON
2. Validation fails
3. Repair attempt is made
4. Repair also fails
5. Lead is marked as "needs_manual_review"
6. Fallback email is sent to visitor
7. Admin is notified (optional)

**Example Error Handling**:
```typescript
// Report generation with error handling
async function generateAndValidateReport(submission: HealthCheckSubmission, env: Env) {
  // Generate report
  let reportJson = await callLLM(submission, env);
  
  // Validate
  let validation = validateReport(reportJson);
  
  // If invalid, attempt repair
  if (!validation.valid) {
    reportJson = await repairReport(reportJson, validation.errors, env);
    validation = validateReport(reportJson);
  }
  
  // If still invalid, handle failure
  if (!validation.valid) {
    return {
      success: false,
      needsManualReview: true
    };
  }
  
  return {
    success: true,
    report: JSON.parse(reportJson)
  };
}
```

## Environment Setup

### Required Environment Variables

```bash
# Notion API
NOTION_API_KEY=secret_...
NOTION_DB_LEADS_ID=...

# LLM API (OpenAI-compatible)
LLM_API_KEY=sk-...
LLM_API_URL=https://api.openai.com/v1  # or other provider

# Email Service (Resend)
EMAIL_API_KEY=re_...
EMAIL_FROM=noreply@zephyrsolutions.info

# Application
PUBLIC_BASE_URL=https://zephyrsolutions.info
REPORT_TOKEN_SECRET=your-hmac-secret-key-here

# Optional: Cloudflare Turnstile
TURNSTILE_SECRET_KEY=...
TURNSTILE_SITE_KEY=...
```

### Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment template:
```bash
cp .env.example .env
```

3. Fill in environment variables in `.env`

4. Run local development server:
```bash
npm run dev
```

5. Test form submission locally (requires Cloudflare Workers local runtime or Wrangler)

## Testing Integration Points

### Test Form Submission

```bash
curl -X POST https://zephyrsolutions.info/api/healthcheck/submit \
  -H "Content-Type: application/json" \
  -d '{
    "org_name": "Test Nonprofit",
    "contact_name": "Test User",
    "email": "test@example.org",
    "org_size": "11-50",
    "current_tools": ["Microsoft Office"],
    "top_pain_points": ["Data backup"],
    "backups_maturity": "basic",
    "security_confidence": "low",
    "budget_comfort": "moderate",
    "timeline": "3-6 months",
    "honeypot": ""
  }'
```

### Test Report Access

```bash
# Use token from submission response
curl https://zephyrsolutions.info/api/healthcheck/report?id=<token>
```

### Verify Notion Integration

1. Check Notion database for new lead record
2. Verify all fields are populated correctly
3. Verify status transitions (pending_generation → sent)
4. Verify report JSON is stored

### Verify Email Delivery

1. Check email inbox for report email
2. Verify email contains summary and report link
3. Click report link and verify HTML report renders
4. Check email service logs for delivery status

## Common Integration Patterns

### Rate Limiting

Implement rate limiting using Cloudflare native features or custom logic:

```typescript
async function checkRateLimit(ip: string, env: Env): Promise<boolean> {
  const key = `rate_limit:${ip}`;
  const count = await env.KV.get(key);
  
  if (count && parseInt(count) >= 10) {
    return false; // Rate limit exceeded
  }
  
  await env.KV.put(key, (parseInt(count || '0') + 1).toString(), {
    expirationTtl: 3600 // 1 hour
  });
  
  return true;
}
```

### Token Generation

Generate HMAC-signed tokens for report links:

```typescript
function generateReportToken(leadId: string, env: Env): string {
  const exp = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days
  const payload = `${leadId}.${exp}`;
  const sig = createHmac('sha256', env.REPORT_TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  
  return `${payload}.${sig}`;
}
```

### LLM Prompt Construction

Build prompts from templates and submission data:

```typescript
async function generateReport(submission: HealthCheckSubmission, env: Env): Promise<string> {
  const systemPrompt = await loadPrompt('healthcheck.system.md');
  const reportPrompt = await loadPrompt('healthcheck.report.md');
  
  const userPrompt = reportPrompt.replace('{{SUBMISSION}}', JSON.stringify(submission));
  
  const response = await fetch(env.LLM_API_URL + '/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.LLM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

## Troubleshooting

### Common Issues

1. **Report validation fails**: Check LLM output format, verify schema matches, review repair prompt
2. **Notion API errors**: Verify API key, check database ID, ensure proper permissions
3. **Email delivery fails**: Check email service API key, verify sender domain, review email service logs
4. **Token verification fails**: Verify token secret matches, check expiration logic, ensure base64url encoding
5. **Rate limiting too aggressive**: Adjust rate limit thresholds, verify IP detection logic

### Debugging Tips

- Enable detailed logging in development (disable in production)
- Use Cloudflare Workers logs for serverless function debugging
- Test each integration point independently
- Verify environment variables are set correctly
- Check external service API status and rate limits
