# Data Model: Content Flywheel v1

**Feature**: 001-content-flywheel  
**Date**: 2026-01-29

## Entities

### TopicSuggestionRequest

Input for the topic suggestion endpoint.

**Fields**:
- `theme` (string, required): General area (e.g. "cybersecurity for nonprofits")
- `audience` (string, required): Target persona — e.g. "nonprofit ED", "ops manager", "small business owner"
- `goals` (array of strings, optional): Multi-select — e.g. "reduce cost", "reduce risk", "modernize", "reliability", "compliance"
- `constraints` (string, optional): Free text (e.g. "no jargon", "board-friendly")
- `region` (string, optional): Geographic or regional constraint

**Validation**: theme and audience non-empty; goals if present must be from allowed set.

---

### TopicCandidate

A single suggested content topic returned by the topic suggestion API.

**Fields**:
- `title` (string): Short topic title
- `hook` (string): Angle or hook for the topic
- `persona` (string): Who it's for (e.g. "nonprofit ED")
- `why_it_matters` (string): Brief rationale
- `cta_type` (string): Recommended CTA — "free resource" | "assessment" | "short call"
- `difficulty` (string): "low" | "med" | "high"

**Validation**: All fields present; cta_type and difficulty from allowed enums.

---

### AssetGenerationRequest

Input for the asset generation endpoint.

**Fields**:
- `topic` (object, required): Selected topic; at least `title` and optionally `hook`, `persona`, etc. (can be one of TopicCandidate or user-provided)
- `asset_types` (array of strings, required): Requested types — e.g. "linkedin", "blog", "email", "onepager", "workshop_outline"
- `brand_voice` (object, optional): Overrides — tone, avoid list, etc. (v1 may fix these in prompt)
- `constraints` (object, optional): Word counts, style rules (e.g. max words per asset type)

**Validation**: topic.title non-empty; asset_types non-empty and subset of supported types.

---

### ContentAsset

A single generated artifact (one LinkedIn variant, one blog post, etc.).

**Fields**:
- `type` (string): "linkedin" | "blog" | "email" | "onepager" | "workshop_outline"
- `variant` (string, optional): For LinkedIn — "educational" | "story" | "checklist"
- `title` (string): Display or subject title
- `content` (string): Body (markdown for blog/onepager; plain or markdown for LinkedIn/email)
- `metadata` (object, optional): subject, preview_text (email); word_count; etc.
- `slug` (string): Suggested filename slug (no extension)
- `suggested_filename` (string, optional): Full suggested filename (e.g. "2026-01-29-cybersecurity-nonprofits.md")

**Validation**: type required; content non-empty; slug safe for filenames.

---

### AssetGenerationResponse

Payload returned by the asset generation endpoint; consumed by GitHub Action or download flow.

**Fields**:
- `topic_title` (string): Topic used for generation
- `generated_at` (string, ISO 8601): Generation timestamp
- `assets` (array of ContentAsset): One entry per requested asset (e.g. 3 LinkedIn + 1 blog + 1 email + 1 onepager)
- `errors` (array of strings, optional): Per-asset or global errors (e.g. "blog generation timed out")

**Validation**: assets array may be partial if some types failed; errors explain failures.

---

## State / Lifecycle

- **Topic suggestion**: Stateless; request → response. No persisted topics.
- **Asset generation**: Stateless; request → response. No persisted generation run in v1.
- **Drafts**: Written by GitHub Action to Git; lifecycle is branch → PR → merge (or discard). No separate state store.

---

## File paths (for GitHub Action)

| Asset type       | Path pattern (relative to repo root)        |
|------------------|---------------------------------------------|
| blog             | `content/posts/YYYY-MM-DD-<slug>.md`        |
| linkedin         | `content/linkedin/YYYY-MM-DD-<slug>-<variant>.md` |
| email            | `content/email/YYYY-MM-DD-<slug>.md`        |
| onepager         | `content/onepagers/YYYY-MM-DD-<slug>.md`    |
| workshop_outline | `content/workshops/YYYY-MM-DD-<slug>.md`     |

Exact directory names (e.g. `content/` vs `src/content/`) must match the existing site content structure; see quickstart and repo layout.
