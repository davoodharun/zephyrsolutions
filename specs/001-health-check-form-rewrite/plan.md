# Implementation Plan: Health Check Form Full-Stack Rewrite

**Branch**: `001-health-check-form-rewrite` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-health-check-form-rewrite/spec.md`

## Summary

Full-stack edit of the health check form: clearer assessment name and purpose (plain-language, non-technical), expanded Current Tools (e.g. Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint) and Pain Points (e.g. large maintenance overhead, repetitive tasks, website maintenance), “Not Sure” on at least backups and security confidence, brief explanations where helpful, home page CTA/card linking to the form, and optional Notion CSV/instructions if schema or allowed values change. Existing API and Notion integration remain; changes are additive and backward compatible.

## Technical Context

**Language/Version**: TypeScript (Cloudflare Functions), JavaScript (form), Markdown/Nunjucks (content)
**Primary Dependencies**: Eleventy, Cloudflare Pages Functions, @notionhq/client, existing healthcheck submit/report API
**Storage**: Notion (lead database); optional KV for report fallback (existing)
**Testing**: Manual / acceptance per spec; existing schema validation via JSON Schema
**Target Platform**: Cloudflare Pages (functions + static), static site (11ty build)
**Project Type**: Web (brochure site + serverless API)
**Performance Goals**: Same as existing form (no new latency requirements)
**Constraints**: Backward-compatible submission payload; “Not Sure” stored as distinct value or safe default for report/Notion
**Scale/Scope**: Additive form options, one new home section/CTA, optional CSV artifact

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| I. Content changes do not require code changes | PASS | Copy, options, and home CTA are content/template edits; form structure remains CMS-friendly. |
| II. Structured content over freeform HTML | PASS | Form and home CTA use existing section/template patterns; no custom HTML injection. |
| III. Everything versioned in Git | PASS | All content and code changes committed; no runtime DB for content. |
| IV. Preview before publish | PASS | PR previews unchanged; form and home changes previewed on branch. |
| V. Minimize JavaScript | PASS | Form remains minimal JS; no new frameworks or large bundles. |

No violations. Complexity Tracking table left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-health-check-form-rewrite/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (schema delta, optional CSV)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks - not created by plan)
```

### Source Code (repository root)

```text
content/
├── pages/
│   ├── index.md         # Home: add CTA/section for assessment + link to /health-check/
│   └── health-check.md  # Form page: title, intro, options, explanations, "Not Sure"
public/
└── js/
    └── health-check-form.js   # Validation + submit; support new options and "Not Sure"

functions/
├── api/healthcheck/
│   └── submit.ts        # Accept new enum values and "Not Sure"; no breaking change
├── _lib/
│   └── notion.ts        # Map new values to Notion (rich_text); no schema change required
schema/
└── healthcheck_submission.schema.json   # Add new tools/pain points; add not_sure to selected enums

docs/
└── health-check-setup.md  # Optional: document CSV usage if delivered
```

**Structure Decision**: Existing Eleventy + Cloudflare Pages layout. Form lives in `content/pages/health-check.md`; behavior in `public/js/health-check-form.js`. API and Notion mapping stay in `functions/`. Schema updated in place. Optional Notion CSV and instructions in `specs/001-health-check-form-rewrite/` or `docs/`.

## Complexity Tracking

> No constitution violations. Table left empty.
