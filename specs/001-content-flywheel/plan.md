# Implementation Plan: Content Flywheel v1 — Topic Suggestion + Asset Generator

**Branch**: `001-content-flywheel` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-content-flywheel/spec.md`

**Note**: This plan is produced by the `/speckit.plan` command. Phase 2 (tasks) is produced by `/speckit.tasks`.

## Summary

Content Flywheel v1 lets the consultant request topic suggestions (theme + audience) and generate multiple marketing assets (LinkedIn variants, blog, email, one-pager) from a chosen topic. Entry point is a workflow dispatch (e.g. GitHub Action) with inputs; Cloudflare Pages Functions expose POST `/api/content/topics` and POST `/api/content/generate`; a GitHub Action consumes the JSON payload, writes markdown files to the repo, and opens a PR for review. No auto-publish; all content is reviewable before merge.

## Technical Context

**Language/Version**: TypeScript (existing repo; align with `functions/` and Eleventy)  
**Primary Dependencies**: Cloudflare Pages Functions, existing LLM integration pattern (see health check), GitHub Actions  
**Storage**: Git repo (files written by GitHub Action); no new database for v1. Optional Notion logging is out of scope for v1.  
**Testing**: Node/tsx for scripts; contract tests for API request/response shapes; manual or CI run of workflow  
**Target Platform**: Cloudflare Pages (serverless functions at edge); GitHub Actions (runner for file write + PR)  
**Project Type**: Web (existing Eleventy + Pages Functions; this feature adds `functions/api/content/*`)  
**Performance Goals**: Topic suggestion &lt;30s; full asset set &lt;3 min end-to-end (per spec SC-002)  
**Constraints**: LLM token/time limits (align with existing health check timeouts); GitHub API rate limits for PR creation; function CPU/memory limits on Cloudflare  
**Scale/Scope**: Single consultant (low request volume); 10 topic candidates per request; 4–6 asset types per generation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| I. Content changes do not require code changes | Pass | Generated content is edited as markdown/frontmatter in repo; no code change needed to update copy. |
| II. Structured content over freeform HTML | Pass | Outputs are structured (markdown, frontmatter, defined asset types). |
| III. Everything versioned in Git | Pass | Drafts written to repo via GitHub Action; PR provides versioning and audit. |
| IV. Preview before publish | Pass | PR review is the gate; no automatic publishing. |
| V. Minimize JavaScript | Pass | No new client-side framework; API is server-side (Pages Functions). |

**Result**: No violations. No complexity tracking required.

## Project Structure

### Documentation (this feature)

```text
specs/001-content-flywheel/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (api-endpoints.md)
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created by plan)
```

### Source Code (repository root)

```text
functions/
├── api/
│   ├── healthcheck/     # Existing
│   │   ├── report.ts
│   │   └── submit.ts
│   └── content/         # New for this feature
│       ├── topics.ts    # POST /api/content/topics
│       └── generate.ts  # POST /api/content/generate
├── _lib/
│   ├── llm.ts           # Existing; reuse for content generation
│   ├── env.ts           # Existing; add content API env if needed
│   └── ...
prompts/                  # Existing; add content flywheel prompts
├── content.topics.md
├── content.generate.md
.github/
└── workflows/
    └── content-flywheel.yml   # New: workflow_dispatch, calls API, writes files, opens PR
```

**Structure Decision**: Add `functions/api/content/` for two endpoints (topics, generate); reuse existing `functions/_lib/llm.ts` and env patterns. GitHub Action lives in `.github/workflows/`. Content output directories (e.g. `content/posts/`, `content/linkedin/`) follow contentgen.md; exact paths are in contracts and quickstart.

## Complexity Tracking

Not applicable — no constitution violations.
