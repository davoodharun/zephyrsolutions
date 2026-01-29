# Quickstart: Health Check Form Rewrite

**Branch**: `001-health-check-form-rewrite` | **Plan**: [plan.md](./plan.md)

## Prerequisites

- Node.js and npm (per repo root)
- Existing health check API and Notion setup (see `docs/health-check-setup.md`)

## Local setup

1. Clone and branch: `git checkout 001-health-check-form-rewrite` (or create from main).
2. Install: `npm install`
3. Build/serve: `npm run build` and `npm run dev` (or equivalent) to preview site and form.
4. For full submit flow: Cloudflare Pages dev or deployed `/api/healthcheck/submit`; env vars for Notion (and optional KV) as in `docs/health-check-setup.md`.

## Key paths

| Artifact | Path |
|----------|------|
| Form page content | `content/pages/health-check.md` |
| Form script | `public/js/health-check-form.js` |
| Submit API | `functions/api/healthcheck/submit.ts` |
| Submission schema | `schema/healthcheck_submission.schema.json` |
| Notion mapping | `functions/_lib/notion.ts` |
| Home page (CTA) | `content/pages/index.md` |

## Validation

- After schema change: ensure `schema/healthcheck_submission.schema.json` includes `not_sure` in `backups_maturity` and `security_confidence` enums, and that backend validation (e.g. in submit handler) allows new tools and pain point strings.
- Manual: submit form with only new tools/pain points and with “Not Sure” on backups and security; confirm 200 and data in Notion (and report if enabled).

## Optional: Notion reference CSV

If delivering a reference CSV per contracts/notion-csv-reference.md, add it under `specs/001-health-check-form-rewrite/` or document in `docs/health-check-setup.md` how to use it for Notion consistency.
