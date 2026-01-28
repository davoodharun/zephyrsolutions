# Health Check Setup Guide

This guide explains how to set up and configure the AI-driven IT Health Check workflow.

## Prerequisites

- Cloudflare Pages account with Pages Functions enabled
- Notion workspace with API access
- Email service account (Resend or SendGrid)
- LLM API access (OpenAI-compatible)

## Environment Variables

Set the following environment variables in Cloudflare Pages dashboard (Settings → Environment Variables):

### Required Variables

- `NOTION_API_KEY`: Your Notion integration API key
- `NOTION_DB_LEADS_ID`: The database ID for your "Leads" database
- `LLM_API_KEY`: Your LLM API key (OpenAI, Anthropic, etc.)
- `LLM_API_URL`: LLM API endpoint (defaults to `https://api.openai.com/v1` if not set)
- `EMAIL_API_KEY`: Your email service API key
- `EMAIL_FROM`: Sender email address (must be verified with email provider)
- `EMAIL_PROVIDER`: `"resend"` or `"sendgrid"` (defaults to `"resend"`)
- `PUBLIC_BASE_URL`: Your site's public URL (e.g., `https://zephyrsolutions.info`)
- `REPORT_TOKEN_SECRET`: A secure random string for HMAC token signing (generate with: `openssl rand -hex 32`)

### Optional Variables

- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile secret key (for enhanced spam protection)
- `TURNSTILE_SITE_KEY`: Cloudflare Turnstile site key

## Notion Database Setup

Create a Notion database named "Leads" with the following properties:

### Required Properties

- **Org Name** (Title) - Primary property
- **Lead ID** (Text) - Unique identifier
- **Contact Name** (Text)
- **Email** (Email)
- **Org Size** (Select) - Options: `1-10`, `11-50`, `51-200`, `200+`
- **Tools** (Multi-select) - Current tools in use
- **Pain Points** (Multi-select) - Top pain points
- **Backups** (Select) - Options: `none`, `basic`, `regular`, `automated`, `cloud-based`
- **Security Confidence** (Select) - Options: `very_low`, `low`, `moderate`, `high`, `very_high`
- **Budget Comfort** (Select) - Options: `very_limited`, `limited`, `moderate`, `comfortable`, `flexible`
- **Timeline** (Select) - Options: `immediate`, `1-3 months`, `3-6 months`, `6-12 months`, `flexible`
- **Status** (Select) - Options: `pending_generation`, `sent`, `needs_manual_review`
- **Readiness Score** (Number) - 1-5
- **Readiness Label** (Select) - Options: `Watch`, `Plan`, `Act`
- **Report Summary** (Rich text)
- **Report JSON** (Rich text) - Full report JSON as string
- **Source** (Select) - Value: `website-healthcheck`
- **Created At** (Date)
- **Updated At** (Date)

### Optional Properties

- **Notes** (Rich text) - Additional notes from form submission

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env` and fill in your values

3. Build the Eleventy site:
```bash
npm run build
```

4. Run Cloudflare Workers locally (requires Wrangler):
```bash
npm run functions:dev
```

## Deployment

The site deploys automatically to Cloudflare Pages when you push to the main branch. Ensure all environment variables are set in the Cloudflare Pages dashboard.

## Testing

1. Submit the form at `/health-check/`
2. Check that a lead is created in Notion with status `pending_generation`
3. Verify email is received with report link
4. Click report link and verify HTML report renders
5. Check that lead status updates to `sent` in Notion

## Troubleshooting

- **Report generation fails**: Check LLM API key and URL, verify API quota
- **Notion errors**: Verify API key and database ID, check database permissions
- **Email not sending**: Verify email service API key and sender address
- **Tokens not working**: Verify `REPORT_TOKEN_SECRET` is set correctly
