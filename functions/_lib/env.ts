/**
 * Environment variable handling and validation
 * Provides type-safe access to Cloudflare Pages environment variables
 */

export interface Env {
  // Notion API
  NOTION_API_KEY: string;
  NOTION_DB_LEADS_ID: string;

  // LLM API
  LLM_API_KEY: string;
  LLM_API_URL?: string; // Optional, defaults to OpenAI

  // Email Service
  EMAIL_API_KEY: string;
  EMAIL_FROM: string;
  EMAIL_PROVIDER?: string; // "resend" or "sendgrid", defaults to "resend"

  // Application
  PUBLIC_BASE_URL: string;
  REPORT_TOKEN_SECRET: string;

  // Optional: Cloudflare Turnstile
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;

  // Cloudflare KV (optional for rate limiting)
  RATE_LIMIT_KV?: KVNamespace;

  // Optional: store reports in KV so report link works even if Notion update fails
  HEALTHCHECK_REPORTS_KV?: KVNamespace;
}

/**
 * Validates that all required environment variables are present
 * @param env Environment variables object
 * @throws Error if required variables are missing
 */
export function validateEnv(env: Env): void {
  const required = [
    'NOTION_API_KEY',
    'NOTION_DB_LEADS_ID',
    'LLM_API_KEY',
    'EMAIL_API_KEY',
    'EMAIL_FROM',
    'PUBLIC_BASE_URL',
    'REPORT_TOKEN_SECRET'
  ];

  const missing: string[] = [];

  for (const key of required) {
    if (!env[key as keyof Env] || (typeof env[key as keyof Env] === 'string' && env[key as keyof Env] === '')) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

/**
 * Gets environment variable with optional default
 */
export function getEnv(key: keyof Env, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
}
