# Health Check Setup Guide

This guide explains how to set up and configure the AI-driven IT Health Check workflow.

## Prerequisites

- Cloudflare Pages account with Pages Functions enabled
- Notion workspace with API access
- Email service account (Resend or SendGrid)
- LLM API access (OpenAI-compatible)

## Environment Variables

Set the following environment variables in Cloudflare Pages dashboard (**Settings** → **Environment variables**).

**Important:** Add variables for **both Production and Preview** if you test on preview URLs (e.g. `*.pages.dev`). Use the **Production** / **Preview** toggle when adding each variable. Secrets (like `LLM_API_KEY`) are not shared between environments.

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

### Use Cloudflare Pages (not Workers)

**Important:** When you connect a GitHub repository to Cloudflare Pages, Cloudflare automatically handles deployment. You should NOT include `wrangler pages deploy` in your build command.

#### Correct Configuration

1. **In the Cloudflare dashboard** go to your project → **Settings** → **Builds & deployments**.
2. **Build command:** `npm run build` (ONLY this - no deploy command)
3. **Build output directory:** `_site`
4. **Root directory:** `/` (leave empty or set to root)
5. **Do NOT add a custom deploy command** - Cloudflare Pages will automatically:
   - Deploy the `_site` directory as static assets
   - Detect and deploy the `functions/` directory automatically
   - Make "Variables and Secrets" available once Functions are detected

#### Why This Works

When Cloudflare Pages runs your build:
1. It executes `npm run build` which creates `_site/`
2. It automatically scans the repository for a `functions/` directory
3. It deploys both the static site (`_site/`) and Functions together
4. Functions become available in the dashboard, enabling "Variables and Secrets"

#### If You See "No Functions" Error

If you previously had a custom deploy command like `npx wrangler deploy --assets=./_site`, remove it. That command deploys to **Workers** (not Pages) and ignores Functions.

#### Manual Deployment (Optional)

If you need to deploy manually from your local machine (not recommended for CI/CD):
```bash
npx wrangler pages deploy _site --project-name=zephyrsolutions
```
But for GitHub-connected projects, let Cloudflare handle deployment automatically.

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

### Only getting "submission received" email, not the report email

This happens when the **LLM call fails** (e.g. `resource_exhausted`, rate limit, or network error). The handler sends a fallback "thank you, we'll process manually" email and returns 500.

**What to check:**

1. **500 response body** – When report generation fails, the JSON includes `error_detail` and `debug`:
   - `debug.llm_key_set: false` → **LLM_API_KEY is not set** for this deployment. In Cloudflare Pages → **Settings** → **Environment variables**, add `LLM_API_KEY` as a **Secret** for **Production** (and **Preview** if you test on `*.pages.dev`).
   - `debug.llm_key_set: true` but no usage on your LLM provider → Request may be going to `debug.llm_base_url` (wrong URL), or failing before the API (timeout/block).
2. **Cloudflare Real-time Logs** – Look for `LLM call: key_set= ... url= ...` and `LLM report generation failed:`. If you never see `LLM call:`, the failure happened earlier (e.g. Notion).
3. **LLM provider** – If using OpenAI: check [usage and limits](https://platform.openai.com/usage). If using a proxy/gateway: check its quota and that it allows requests from Cloudflare Workers.
4. **`LLM_API_URL`** – Must be reachable from Cloudflare’s network. Use `https://api.openai.com/v1` for OpenAI, or leave unset to use that default.
5. **Leads in Notion** – Failed runs mark the lead as `needs_manual_review` so you can process them manually or resubmit after fixing the LLM.
