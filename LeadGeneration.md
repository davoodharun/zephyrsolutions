# Zephyr AI Health Check — Cloudflare Pages + Notion CRM (Spec Kit v1)

## 0. Objective
Add an AI-driven “Nonprofit IT Health Check” workflow to the existing marketing website, deployed on Cloudflare Pages. The workflow must:
- Collect a short assessment form
- Generate a nonprofit-friendly report via LLM in strict JSON
- Email the lead their results (summary + hosted HTML report link)
- Write the lead + metadata + score into Notion CRM

Primary outcomes:
- Increase inbound lead quality via value-first assessment
- Provide immediate, high-trust deliverable
- Keep operations lightweight and cost-effective

Non-goals:
- Rebuild the website framework
- Store sensitive secrets or credentials from leads
- Aggressive drip marketing automation

## 1. Platform Choice
- Hosting: Cloudflare Pages (static site)
- Backend: Cloudflare Pages Functions (Workers runtime) under `/functions`
- CRM: Notion Database (“Leads”)
- Email provider: Resend (recommended) or SendGrid (acceptable)
- LLM: OpenAI-compatible API (implementation via fetch)

## 2. Repository Architecture
Repo must support both static site and serverless endpoints.

```text
repo-root/
├─ README.md
├─ SPEC.md
├─ .env.example
├─ wrangler.toml (optional; only if needed for local dev)
├─ package.json
├─ src/                       # static website files (existing site lives here OR root)
│  ├─ health-check.html        # landing page + form (or integrate into existing page)
│  ├─ thanks.html
│  ├─ assets/
│  └─ ...
├─ functions/                  # Cloudflare Pages Functions
│  ├─ api/
│  │  ├─ healthcheck/
│  │  │  ├─ submit.ts          # POST /api/healthcheck/submit
│  │  │  ├─ report.ts          # GET  /api/healthcheck/report?id=...
│  │  │  └─ webhook.ts         # optional admin/webhooks
│  │  └─ _lib/
│  │     ├─ env.ts
│  │     ├─ validation.ts
│  │     ├─ notion.ts
│  │     ├─ email.ts
│  │     ├─ llm.ts
│  │     ├─ crypto.ts
│  │     └─ html.ts
├─ prompts/
│  ├─ healthcheck.system.md
│  ├─ healthcheck.report.md
│  ├─ healthcheck.repair.md
│  └─ followup.email.md
└─ schema/
   ├─ healthcheck_submission.schema.json
   └─ healthcheck_report.schema.json


Notes:

Cloudflare Pages Functions route based on file paths.

/functions/api/healthcheck/submit.ts becomes /api/healthcheck/submit.

3. User Flow

Visitor opens Health Check landing page and submits form.

Backend creates Notion Lead page (status = pending_generation).

Backend calls LLM to generate strict JSON report.

Backend validates report JSON against schema.

Backend stores report summary + readiness score into Notion.

Backend emails the lead:

summary bullets

readiness label/score

link to hosted report page: /api/healthcheck/report?id=<token>

Admin is notified (optional): email or webhook.

MVP must be synchronous (single request) unless runtime limits force async.

4. Frontend Requirements

Embed a short form (10–12 fields max) on health-check.html or existing page section.

Submit via fetch to: POST /api/healthcheck/submit

Show success state immediately:

“Check your email in a few minutes.”

Add minimal spam protections:

Honeypot input

Optional Cloudflare Turnstile (recommended; v1 can ship without if low spam)

Form Fields (MVP)

Required:

org_name (string)

contact_name (string)

email (string)

org_size (enum: 1-10, 11-50, 51-200, 200+)

current_tools (multi enum)

top_pain_points (multi enum)

backups_maturity (enum)

security_confidence (enum)

budget_comfort (enum)

timeline (enum)
Optional:

notes (string)

5. API Endpoints
5.1 POST /api/healthcheck/submit

Request: HealthCheckSubmission (see Contracts)
Response:

200 JSON: { ok: true, lead_id, report_url }

400 on validation error

Behavior:

Validate inbound payload.

Create/update lead in Notion:

status=pending_generation

store raw payload (as JSON text property) OR individual properties

Generate report via LLM (strict JSON only).

Validate report JSON against schema.

If invalid: run one repair pass.

If still invalid: mark Notion status=needs_manual_review and send fallback email.

Store results in Notion:

readiness_score, readiness_label, summary, top priorities

Email results to lead with report_url

Return response to frontend.

5.2 GET /api/healthcheck/report?id=<token>

Returns HTML report page.
Behavior:

Token maps to a lead record (signed token recommended).

Fetch report data from Notion (or KV/R2 if used later).

Render a simple, branded HTML report page.

Never expose internal Notion IDs; token must not be guessable.

6. Data Model — Notion CRM (Required)

Create Notion database: "Leads"

Properties (minimum):

Org Name (Title)

Lead ID (Text)

Contact Name (Text)

Email (Email)

Org Size (Select)

Tools (Multi-select)

Pain Points (Multi-select)

Backups (Select)

Security Confidence (Select)

Budget Comfort (Select)

Timeline (Select)

Status (Select: pending_generation | sent | needs_manual_review)

Readiness Score (Number)

Readiness Label (Select: Watch | Plan | Act)

Report Summary (Rich text)

Report JSON (Rich text) (store full JSON string)

Source (Select: website-healthcheck)

Created At (Date)

Updated At (Date)

7. Contracts (Schemas)
7.1 HealthCheckSubmission

Must validate before processing (schema in /schema)

7.2 HealthCheckReport (LLM output)

Must be JSON only

Must match schema in /schema

Must not contain markdown

Required shape:

version: "1"

summary: string

readiness_score: 1..5

readiness_label: Watch|Plan|Act

top_risks: 2..5 items

top_priorities: 2..4 items

do_not_worry_yet: 1..3 items

next_steps: 3..6 items

recommended_entry_offer: Free resources|Fixed-price assessment|Short call

admin_notes: string

8. Prompting Rules
8.1 Healthcheck.system.md

Persona:

Conservative nonprofit IT advisor

Plain English, no jargon (or define it)

Focus on stability, affordability, and staff simplicity

Don’t recommend trendy tools without strong justification
Safety:

Never request passwords, keys, donor PII, or sensitive details
Output:

JSON only, no markdown

8.2 healthcheck.report.md

Input:

Submission payload
Task:

Produce HealthCheckReport JSON exactly matching schema

8.3 healthcheck.repair.md

Input:

Invalid JSON + schema errors
Task:

Output corrected JSON only

8.4 followup.email.md

Task:

Create warm, non-salesy email body using report fields

CTA based on readiness_label

9. Security & Privacy

Rate limit /api/healthcheck/submit (soft limit; Cloudflare native protections acceptable)

Add honeypot field to reduce bots

Do not log full email/body in console logs

Store secrets in Cloudflare Pages project environment variables

Tokenization:

report link must use signed token (HMAC) with expiry (e.g., 30 days)

10. Environment Variables

Required:

NOTION_API_KEY

NOTION_DB_LEADS_ID

LLM_API_KEY

EMAIL_API_KEY

PUBLIC_BASE_URL (e.g., https://zephyrsolutions.info
)

REPORT_TOKEN_SECRET (HMAC secret)

Optional:

TURNSTILE_SECRET_KEY

TURNSTILE_SITE_KEY

11. Milestones

M1 (MVP):

Form + submit endpoint + LLM report + Notion writeback + email + HTML report link

M2 (Hardening):

token expiry, Turnstile, better admin notifications, improved validation and retries

M3 (PDF):

Add PDF generation (only if runtime supports it reliably; otherwise generate PDF externally and store in R2)

M4 (Content Flywheel):

GitHub Action that calls a content generator script and opens PRs

12. Definition of Done

A visitor submits the form and receives an email within minutes containing a useful summary and a working report link.

Lead appears in Notion with readiness score and stored report JSON.

Validation failures route to manual review and send a polite fallback email.

No sensitive info is collected or leaked in logs or URLs.

Cursor Implementation Notes (do exactly this)

Use TypeScript for Pages Functions.

Validation: implement a small, deterministic validator (schema-based preferred). If avoiding dependencies, validate required keys/types manually.

LLM calls: use fetch; request JSON-only output with strict instructions.

Notion API: implement create/update page and property mapping.

Email adapter: implement Resend first.

Report link: implement HMAC-signed token:

token = base64url(lead_id + "." + exp + "." + sig)

sig = HMAC_SHA256(secret, lead_id + "." + exp)

Rendering: generate HTML report with a simple template function (no framework required).


## What Cursor should build first (MVP checklist)
If you want to keep Cursor laser-focused, paste this as a “Task List” under the spec:

```md
## MVP Task List
1. Add /src/health-check.html with a form that POSTs JSON to /api/healthcheck/submit
2. Implement /functions/api/healthcheck/submit.ts
   - validate input
   - create/update Notion lead (status=pending_generation)
   - call LLM to generate report JSON
   - validate report JSON; attempt one repair if invalid
   - update Notion lead (status=sent, readiness fields, report JSON)
   - send email to lead with report link
   - return { ok, lead_id, report_url }
3. Implement /functions/api/healthcheck/report.ts
   - verify token
   - fetch report JSON from Notion
   - render branded HTML report
4. Add .env.example and document Cloudflare env var setup
