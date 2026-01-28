# Implementation Plan: AI-Driven Nonprofit IT Health Check Workflow

**Branch**: `001-ai-health-check` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-health-check/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add an AI-driven "Nonprofit IT Health Check" workflow to the existing Eleventy-based marketing website. The workflow collects assessment forms from visitors, generates personalized reports via LLM, emails results to leads, and stores lead data in Notion CRM. The implementation uses Cloudflare Pages Functions for serverless API endpoints, maintaining the existing static site architecture while adding dynamic form processing and report generation capabilities.

## Technical Context

**Language/Version**: TypeScript (Cloudflare Workers runtime), JavaScript (frontend), Node.js 18+ (local development)  
**Primary Dependencies**: Cloudflare Pages Functions API, Notion API client, Resend/SendGrid SDK, OpenAI-compatible API client, JSON schema validation library  
**Storage**: Notion Database (CRM), Cloudflare KV (optional for token storage), Environment variables for secrets  
**Testing**: Vitest or Jest for unit tests, Cloudflare Workers local testing, Manual integration testing  
**Target Platform**: Cloudflare Pages (static site + serverless functions), Modern web browsers  
**Project Type**: Web application (hybrid static + serverless)  
**Performance Goals**: Form submission processing completes in under 2 minutes for 90% of requests, email delivery within 5 minutes for 95% of submissions  
**Constraints**: Cloudflare Workers runtime limits (CPU time, memory), Synchronous processing preferred unless runtime limits require async, No sensitive data in logs or URLs, Rate limiting to prevent abuse (10 submissions/hour per IP minimum)  
**Scale/Scope**: Expected 10-50 form submissions per day initially, Single form with 10-12 fields, 4 API endpoints, Integration with 3 external services (Notion, Email, LLM)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Changes Do Not Require Code Changes
**Status**: ✅ COMPLIANT
- The health check form is a new feature addition, not a content change
- Form structure and validation logic are code-based (appropriate for functional features)
- Report generation logic is code-based (appropriate for business logic)
- No impact on existing CMS-editable content

### Principle II: Structured Content Over Freeform HTML
**Status**: ✅ COMPLIANT
- Form fields are structured and validated
- Report JSON follows strict schema
- HTML report rendering uses templates (not freeform HTML injection)
- No user-provided HTML is rendered

### Principle III: Everything is Versioned in Git
**Status**: ✅ COMPLIANT
- All code, schemas, prompts, and configuration will be committed to Git
- No runtime database stores content state (Notion is external CRM, not content storage)
- All changes go through PR workflow

### Principle IV: Preview Before Publish
**Status**: ✅ COMPLIANT
- Cloudflare Pages supports PR previews automatically
- All changes will be tested in preview environment before merge
- Form submissions can be tested in preview environment

### Principle V: Minimize JavaScript
**Status**: ✅ COMPLIANT
- Frontend form uses minimal vanilla JavaScript for submission
- No heavy client-side frameworks required
- Progressive enhancement: form works without JS (with server-side fallback)
- Serverless functions handle processing (not client-side)

### Additional Compliance Checks

**Forms**: ✅ COMPLIANT
- Uses serverless endpoint with validation and rate limiting (as required by constitution)
- Form endpoint validates input server-side
- Rate limiting implemented to prevent abuse

**Security**: ✅ COMPLIANT
- No secrets in repository (environment variables only)
- Form endpoints validate and rate limit
- Sensitive data not logged
- Secure token generation for report links

**Performance**: ✅ COMPLIANT
- Minimal JavaScript on frontend
- Serverless functions are lightweight
- No large bundles required
- Images optimized (existing site practices apply)

**Accessibility**: ✅ COMPLIANT
- Form fields will have proper labels
- Error messages will be readable
- Keyboard navigation supported
- Follows existing site accessibility patterns

**GATE RESULT**: ✅ PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
repo-root/
├── content/                    # Existing Eleventy content (unchanged)
│   ├── pages/
│   └── global/
├── src/                        # Existing Eleventy source (unchanged)
│   ├── _includes/
│   └── _data/
├── public/                     # Existing static assets (unchanged)
│   ├── css/
│   ├── js/
│   └── images/
├── functions/                  # NEW: Cloudflare Pages Functions
│   ├── api/
│   │   └── healthcheck/
│   │       ├── submit.ts      # POST /api/healthcheck/submit
│   │       └── report.ts      # GET /api/healthcheck/report?id=...
│   └── _lib/                   # Shared utilities
│       ├── env.ts              # Environment variable handling
│       ├── validation.ts       # Input validation
│       ├── notion.ts           # Notion API client
│       ├── email.ts            # Email service client (Resend/SendGrid)
│       ├── llm.ts              # LLM API client
│       ├── crypto.ts           # Token signing/verification
│       └── html.ts             # HTML report template rendering
├── prompts/                    # NEW: LLM prompt templates
│   ├── healthcheck.system.md
│   ├── healthcheck.report.md
│   ├── healthcheck.repair.md
│   └── followup.email.md
├── schema/                     # NEW: JSON schemas for validation
│   ├── healthcheck_submission.schema.json
│   └── healthcheck_report.schema.json
├── content/pages/              # NEW: Health check form page
│   └── health-check.md         # Or integrate into existing page
├── .eleventy.js                # Existing Eleventy config (unchanged)
├── package.json                # Updated with new dependencies
├── wrangler.toml               # NEW: Cloudflare Workers config (optional for local dev)
└── .env.example                # NEW: Environment variable template
```

**Structure Decision**: Hybrid architecture maintaining existing Eleventy static site structure while adding Cloudflare Pages Functions for serverless API endpoints. The `/functions` directory follows Cloudflare Pages Functions routing conventions. Form page can be added as Eleventy content page or integrated into existing page. All prompts and schemas are versioned alongside code.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All constitution principles are satisfied.

## Phase 0: Research Complete

**Status**: ✅ Complete

All technical decisions documented in `research.md`:
- Cloudflare Pages Functions architecture
- Notion API integration patterns
- Email service selection (Resend/SendGrid)
- LLM API integration
- HMAC token security
- JSON Schema validation
- Error handling strategies

No NEEDS CLARIFICATION items remain.

## Phase 1: Design & Contracts Complete

**Status**: ✅ Complete

**Generated Artifacts**:
- `data-model.md`: Entity definitions, relationships, validation rules, state transitions
- `contracts/api-endpoints.md`: API endpoint specifications with request/response formats
- `contracts/json-schemas.md`: JSON Schema definitions for submission and report validation
- `quickstart.md`: Integration scenarios, examples, and troubleshooting guide

**Key Design Decisions**:
- Hybrid architecture: Static Eleventy site + Cloudflare Pages Functions
- Stateless token verification using HMAC signatures
- Synchronous processing for MVP (can be refactored to async if needed)
- Single repair attempt for invalid LLM output
- Graceful degradation: Fallback email on report generation failure

## Constitution Check (Post-Design)

**Status**: ✅ PASS - All principles remain satisfied after design phase

- **Principle I**: No impact on existing CMS-editable content
- **Principle II**: Structured data throughout (JSON schemas, form validation)
- **Principle III**: All code, schemas, and prompts versioned in Git
- **Principle IV**: Cloudflare Pages PR previews supported
- **Principle V**: Minimal JavaScript on frontend, serverless processing

## Next Steps

Ready for `/speckit.tasks` to generate implementation task breakdown.
