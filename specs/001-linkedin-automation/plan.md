# Implementation Plan: LinkedIn Post Automation

**Branch**: `001-linkedin-automation` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-linkedin-automation/spec.md`

## Summary

1. **Organize flywheel images by topic/post** (P1): Store or associate images so they are tied to a topic/post (e.g. topic-scoped folder under content, or documented naming convention using existing `public/images/content-flywheel/YYYY-MM-DD-<slug>-*.png`).
2. **Auto-publish to LinkedIn on merge** (P2): On merge to main, when `content/linkedin/` changes, run a workflow that publishes each new/updated post (and its associated image when available) to LinkedIn via the LinkedIn developer app (UGC Post API + Assets API for image).

Existing repo: Eleventy, TinaCMS, content in `content/`, GitHub Actions (content-flywheel). LinkedIn posts live in `content/linkedin/`; flywheel images in `public/images/content-flywheel/` with naming `YYYY-MM-DD-<slug>-hero|social|inline.png`. Association today is by date+slug in filenames.

## Technical Context

**Language/Version**: Bash (workflows), Node/TypeScript optional for LinkedIn API client (or curl + jq).  
**Primary Dependencies**: GitHub Actions; LinkedIn API (UGC Post API, Assets API for image upload); OAuth 2.0 for LinkedIn app.  
**Storage**: Git (content files, image files); no new database.  
**Testing**: Manual / workflow run; optional contract tests for “post + image → LinkedIn” flow.  
**Target Platform**: GitHub Actions (ubuntu-latest); LinkedIn API (REST).  
**Project Type**: Automation (workflows + optional small scripts or serverless).  
**Performance Goals**: Publish within 5 minutes of merge; workflow completes within typical Actions limits.  
**Constraints**: LinkedIn API rate limits and token lifetime; secrets in GitHub Secrets only.  
**Scale/Scope**: One publish workflow per merge; one or more posts per merge; low volume (content flywheel cadence).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|--------|
| I. Content changes do not require code changes | Pass | LinkedIn content remains markdown in Git; publish is automation on merge. |
| II. Structured content | Pass | No new freeform HTML; post content is markdown. |
| III. Everything versioned in Git | Pass | Posts and images stay in repo; LinkedIn publish is a side effect of merge. |
| IV. Preview before publish | Pass | PR preview applies to site; LinkedIn publish happens only after merge to main (approved content). |
| V. Minimize JavaScript | Pass | Automation is workflow + API calls; no new client-side JS. |
| Secrets | Pass | LinkedIn credentials in GitHub Secrets only. |
| DoD (security) | Pass | No secrets in repo; API credentials stored as secrets. |

**Verdict**: No constitution violations. Proceed to Phase 0/1.

## Project Structure

### Documentation (this feature)

```text
specs/001-linkedin-automation/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (workflow trigger, LinkedIn API usage)
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

No new application source tree. Changes are:

- **Content / assets**: Optional new path for images (e.g. `content/flywheel/<date>-<slug>/images/`) or keep `public/images/content-flywheel/` with documented convention; `content/linkedin/` unchanged.
- **Workflows**: `.github/workflows/` — new workflow (e.g. `linkedin-publish.yml`) triggered on push to main when `content/linkedin/` changes; optionally update content-flywheel workflow to write images to topic-scoped path if chosen.
- **Scripts**: Optional `.github/scripts/` — script to call LinkedIn API (upload image, create UGC post) or inline in workflow; or small Node/TS helper if preferred.
- **Docs**: `docs/` — add LinkedIn automation setup (app, secrets, idempotency).

```text
.github/
├── workflows/
│   ├── content-flywheel.yml   # existing; optionally adjust image output path
│   └── linkedin-publish.yml   # new: on push to main, publish content/linkedin + images
├── scripts/
│   └── linkedin-publish.sh    # optional: parse post, upload image, create UGC post
content/
├── linkedin/                  # existing; post markdown files
└── flywheel/                  # optional: topic-scoped folders with images
public/
└── images/
    └── content-flywheel/       # existing; current image location (date-slug-hero|social|inline)
docs/
└── linkedin-automation.md     # setup: LinkedIn app, secrets, idempotency
```

**Structure Decision**: Automation-only feature. No new backend/frontend apps. Workflow + optional script + content path convention (or restructure). Contracts define workflow trigger conditions and LinkedIn API usage (inputs/outputs, auth).

## Complexity Tracking

Not applicable; no constitution violations.
