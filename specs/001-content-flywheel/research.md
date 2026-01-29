# Research: Content Flywheel v1

**Feature**: 001-content-flywheel  
**Date**: 2026-01-29

## 1. LLM usage for topic suggestion and long-form content

**Decision**: Reuse the existing LLM integration pattern from the health check feature (`functions/_lib/llm.ts`): same client, retries, timeout (e.g. 55s per request). Use separate prompts for topic suggestion (single completion, JSON array) and asset generation (one completion per asset type or batched where provider allows) to stay within token and timeout limits.

**Rationale**: Consistency with the rest of the codebase; health check already handles rate limits, timeouts, and JSON parsing. Topic suggestion returns a small JSON array (~10 items). Asset generation returns a larger payload; we may need to call the LLM once per asset type (topics, then LinkedIn A/B/C, blog, email, one-pager, optional workshop) or batch where the API supports it to avoid timeout.

**Alternatives considered**: Dedicated content-generation service (overkill for v1); different LLM client (adds inconsistency and maintenance).

---

## 2. GitHub Actions: secure call to Cloudflare API and write to repo

**Decision**: Use `workflow_dispatch` with inputs (theme, audience, channels, tone). Action calls the Cloudflare Pages deployment URL (e.g. `https://zephyrsolutions.pages.dev/api/content/...`) with a secret token (e.g. `CONTENT_API_SECRET`) in a header or query param; Cloudflare Function validates the token. Action receives JSON, checks out repo, writes files under `content/` (or paths in contract), commits, pushes a branch, opens PR via `gh` CLI or GitHub API. Use `actions/checkout` with `token` or `GITHUB_TOKEN` so the workflow can push.

**Rationale**: Cloudflare Functions cannot hold GitHub credentials or push to Git safely; the spec explicitly recommends GitHub Actions for “write to repo + PR”. Using the public deployment URL plus a shared secret keeps implementation simple and avoids running a long-lived worker with repo write access.

**Alternatives considered**: Cloudflare Worker with GitHub App (more secure but more setup for v1); manual download + local commit (acceptable fallback, not primary path).

---

## 3. Prompt structure for topic suggestion and asset generation

**Decision**: Store prompts in `prompts/` (e.g. `content.topics.md`, `content.generate.md`) with placeholders for theme, audience, goals, constraints, and (for generate) topic + asset types. Topic prompt asks for a JSON array of exactly 10 objects with fixed keys (title, hook, persona, why_it_matters, cta_type, difficulty). Generate prompt is structured per asset type (LinkedIn variants, blog, email, one-pager, workshop) with word counts and safety rules embedded; output is a single JSON object keyed by asset type, each containing content + metadata + suggested filename slug.

**Rationale**: Centralized prompts are easier to tune and version; JSON-in/JSON-out matches existing health check pattern and simplifies parsing. Fixed schema for topics and for each asset type reduces malformed output and allows validation before writing files.

**Alternatives considered**: Single mega-prompt for all assets (higher timeout and token risk); streaming (adds complexity; v1 can be non-streaming).

---

## 4. Brand voice and safety rules in generated content

**Decision**: Encode brand and safety rules in the system/user prompts (plain English, nonprofit-friendly, no fear-mongering, no mention of AI/internal systems, no unsubstantiated compliance claims, gentle disclaimers where appropriate). No runtime filtering of generated text for v1; prompt engineering is the primary control. Optional: post-process to strip known bad phrases if needed later.

**Rationale**: Spec FR-005 requires enforcement; prompt-level rules are the standard approach and keep implementation simple. Post-processing can be added if spot-checks (SC-003) reveal gaps.

**Alternatives considered**: Separate “safety” model or filter service (adds cost and latency for v1); human-in-the-loop only (already satisfied by PR review).

---

## 5. File paths and frontmatter for draft content

**Decision**: Follow contentgen.md paths: `content/posts/YYYY-MM-DD-slug.md`, `content/linkedin/YYYY-MM-DD-slug.md`, `content/email/YYYY-MM-DD-slug.md`, `content/onepagers/YYYY-MM-DD-slug.md` (or equivalent under existing `content/` if the repo already has a different structure). Frontmatter: title, date, slug, optional asset_type and topic_title; body is markdown from the LLM. If the site uses Eleventy collections, paths and frontmatter must match existing schema (see docs/content-model or equivalent).

**Rationale**: Consistent naming (date-slug) supports sorting and avoids collisions; frontmatter enables CMS/preview. Aligning with existing content structure avoids duplicate trees.

**Alternatives considered**: Single directory with type prefix (e.g. `content/drafts/blog-YYYY-MM-DD-slug.md`); no frontmatter (rejected — harder for editors and tooling).

---

## 6. Fallback: downloadable bundle when Git write is unavailable

**Decision**: Support a response format that includes all asset contents + suggested filenames. The GitHub Action is the primary consumer; if a “download zip” entry point is added later (e.g. admin page), the same JSON can be zipped client- or server-side. No zip generation in Cloudflare Function for v1 unless required (adds binary/stream handling); optional “return as JSON” is sufficient for Action or future download step.

**Rationale**: Spec FR-006 allows “downloadable bundle” as fallback; keeping the API response as the single source of truth allows multiple consumers without duplicating logic.

**Alternatives considered**: Function returns a base64-encoded zip (possible but heavier and more error-prone for v1).
