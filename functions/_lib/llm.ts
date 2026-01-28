/**
 * LLM API client (OpenAI-compatible)
 * Handles calling LLM APIs for report generation and email content
 * Includes retry with backoff for transient failures (429, 5xx, network).
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

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 1000;
const LLM_REQUEST_TIMEOUT_MS = 55000; // Under 60s Worker limit

function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

function isRetryableErrorCode(code: string | undefined): boolean {
  if (!code) return false;
  const retryable = ['resource_exhausted', 'rate_limit_exceeded', 'overloaded', 'server_error', 'internal'];
  return retryable.some(c => (code || '').toLowerCase().includes(c));
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function parseErrorResponse(response: Response): Promise<{ code?: string; message: string; isRetryable?: boolean }> {
  let message = `HTTP ${response.status}`;
  let code: string | undefined;
  let isRetryable: boolean | undefined;
  try {
    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    // OpenAI-style: error.code, error.message
    code = data.error?.code ?? data.error?.type ?? data.code;
    message = data.error?.message ?? data.message ?? data.detail ?? message;
    // Gateway/proxy style: error (number), details.detail, details.isRetryable
    if (data.details) {
      message = data.details.detail ?? data.details.title ?? message;
      isRetryable = data.details.isRetryable;
    }
    if (data.error != null && typeof data.error === 'number') code = String(data.error);
    if (code) message = `[${code}] ${message}`;
  } catch {
    // ignore parse errors
  }
  return { code, message, isRetryable };
}

async function fetchWithRetry(
  endpoint: string,
  options: RequestInit,
  env: Env
): Promise<Response> {
  let lastError: Error | null = null;
  let backoff = INITIAL_BACKOFF_MS;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), LLM_REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(endpoint, {
        ...options,
        signal: options.signal ?? controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) return response;
      const { code, message, isRetryable } = await parseErrorResponse(response);
      const shouldRetry = isRetryable === true || isRetryableStatus(response.status) || isRetryableErrorCode(code);
      if (attempt < MAX_RETRIES && shouldRetry) {
        console.warn(`LLM API attempt ${attempt}/${MAX_RETRIES} failed (${response.status} ${code || ''}): ${message}. Retrying in ${backoff}ms...`);
        await sleep(backoff);
        backoff *= 2;
        continue;
      }
      throw new Error(`LLM API error: ${message}`);
    } catch (err) {
      clearTimeout(timeoutId);
      lastError = err instanceof Error ? err : new Error(String(err));
      if (err instanceof Error && err.name === 'AbortError') {
        lastError = new Error(`LLM request timed out after ${LLM_REQUEST_TIMEOUT_MS / 1000}s`);
      }
      const isNetwork = lastError.message.includes('fetch') || lastError.message.includes('network') || lastError.message.includes('Failed to fetch') || lastError.message.includes('timed out');
      if (attempt < MAX_RETRIES && isNetwork) {
        console.warn(`LLM API attempt ${attempt}/${MAX_RETRIES} network error. Retrying in ${backoff}ms...`);
        await sleep(backoff);
        backoff *= 2;
        continue;
      }
      throw lastError;
    }
  }

  throw lastError ?? new Error('LLM API request failed after retries');
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
    const response = await fetchWithRetry(endpoint, {
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
    }, env);

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('LLM report generation failed:', msg);
    throw new Error(`Failed to generate report: ${msg}`);
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
    const response = await fetchWithRetry(endpoint, {
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
    }, env);

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('LLM repair failed:', msg);
    throw new Error(`Failed to repair report: ${msg}`);
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
    const response = await fetchWithRetry(endpoint, {
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
    }, env);

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
    const msg = error instanceof Error ? error.message : String(error);
    console.error('LLM email generation failed:', msg);
    // Fallback to simple email so user still gets report link
    return {
      subject: 'Your IT Health Check Report',
      body: `Hi ${contactName},\n\nThank you for completing the IT Health Check assessment for ${orgName}.\n\nYour personalized report is ready. View it here: ${reportUrl}\n\nBest regards,\nZephyr Solutions`
    };
  }
}
