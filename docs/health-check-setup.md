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

### Optional: KV namespace for report fallback

If the Notion update fails (e.g. property name/type mismatch), the report link can still work by storing reports in **Cloudflare KV**. The report endpoint checks KV first, then Notion.

1. **Create a KV namespace** (Cloudflare dashboard: **Workers & Pages** → **KV** → **Create namespace**, or CLI: `npx wrangler kv:namespace create HEALTHCHECK_REPORTS`).
2. **Bind it to your Pages project**: **Pages** → your project → **Settings** → **Functions** → **KV namespace bindings** → **Add binding** → Variable name: `HEALTHCHECK_REPORTS_KV`, KV namespace: select the one you created.
3. Redeploy. On each successful report generation, the report is stored in KV (90-day TTL) and the report page reads from KV first, so the link works even when Notion doesn’t have the Report JSON.

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
- **Backups** (Select) - Options: `none`, `basic`, `regular`, `automated`, `cloud-based`, `not_sure`
- **Security Confidence** (Select) - Options: `very_low`, `low`, `moderate`, `high`, `very_high`, `not_sure`
- **Budget Comfort** (Select) - Options: `very_limited`, `limited`, `moderate`, `comfortable`, `flexible`
- **Timeline** (Select) - Options: `immediate`, `1-3 months`, `3-6 months`, `6-12 months`, `flexible`
- **Status** (Select) - Options: `pending_generation`, `sent`, `needs_manual_review`
- **Readiness Score** (Number) - 1-5
- **Readiness Label** (Select) - Options: `Watch`, `Plan`, `Act`
- **Report Summary** (Rich text)
- **Report JSON** (Rich text) - Full report JSON; name must be exactly "Report JSON" (or "Report Json" / "ReportJSON" for reading). Required for report links to work.
- **Source** (Select) - Value: `website-healthcheck`
- **Created At** (Date)
- **Updated At** (Date)

### Optional Properties

- **Notes** (Rich text) - Additional notes from form submission

### Optional: Reference list of allowed values

If you need a reference of form field names and allowed values for Notion consistency, filtering, or imports, see **specs/001-health-check-form-rewrite/notion-reference.md**. Notion properties (Tools, Pain Points, Backups, Security Confidence, etc.) are **rich_text**; values are free-form from the form. Use the reference list for consistency when reporting or importing; the form and `schema/healthcheck_submission.schema.json` are the source of truth.

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

**Report normalization (no LLM, no Cloudflare):** From repo root run `npm run test:report` to test that LLM-like JSON (different key names, object-as-array) is normalized and passes validation. This exercises the mapping from raw LLM output to schema shape.

**Notion update in isolation:** If Report JSON is not being saved to Notion (status stays `pending_generation`) but report viewing works via KV, run `npm run test:notion-update -- <leadId>` with a lead ID from your Notion DB (e.g. from an existing row’s Lead ID). The script uses the same `updateNotionLead` logic as the API and prints the exact Notion API error (e.g. property not found, wrong type). Ensure `.env` has `NOTION_API_KEY` and `NOTION_DB_LEADS_ID`.

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

### Report link returns 404 (report not found)

The report URL works only if the lead’s **Report JSON** was saved to Notion. If the Notion update fails or the property is missing, the link returns 404.

**What to check:**

1. **Cloudflare Real-time Logs** – When you open the report link, look for:
   - **`Report 404:`** – Shows `leadId`, `leadFound` (true/false), `hasReportJson` (true/false). If `leadFound: true` and `hasReportJson: false`, the lead exists but Report JSON wasn’t saved (update failed or wrong property name).
   - **`Notion lead update failed:`** – Shown when the submit handler tries to save the report to Notion. The message tells you why (e.g. property not found, invalid type).
   - **`Report JSON empty for lead ... property names:`** – Lists the lead’s Notion property names so you can confirm whether "Report JSON" (or "Report Json" / "ReportJSON") exists.
2. **Notion database** – The Leads database must have a **Rich text** property named **"Report JSON"** (exact spelling). The code also reads "Report Json" and "ReportJSON" if present. Create or rename the property if needed.
3. **Notion API** – Ensure the integration has **edit** access to the database and that the property type is Rich text (not Title, Select, etc.).
4. **Quick fix: use KV fallback** – Bind a KV namespace as `HEALTHCHECK_REPORTS_KV` (see "Optional: KV namespace for report fallback" above). Reports are then stored in KV on submit; the report page reads from KV first, so the link works even when the Notion update fails. You can fix the Notion property name/type later and still serve reports from KV.
