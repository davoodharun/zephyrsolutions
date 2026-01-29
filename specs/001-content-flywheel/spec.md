# Feature Specification: Content Flywheel v1 — Topic Suggestion + Asset Generator

**Feature Branch**: `001-content-flywheel`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "Content Flywheel v1: topic suggestion and asset generator for marketing content (Cloudflare Pages, GitHub Actions)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Suggest Topics (Priority: P1)

As the consultant (Harun), I want to input a general area (e.g., "cybersecurity for nonprofits") and get multiple topic ideas with angles and target personas so I can pick one quickly without brainstorming from scratch.

**Why this priority**: Topic suggestion is the entry point; without it, the consultant must manually come up with ideas before generating assets.

**Independent Test**: Can be fully tested by requesting topic suggestions for a theme and audience, then verifying that a list of distinct topic candidates is returned with title, hook/angle, target persona, and why it matters. Delivers value even if asset generation is not yet built.

**Acceptance Scenarios**:

1. **Given** the consultant has a theme and target audience in mind, **When** they request topic suggestions, **Then** they receive at least 10 topic candidates, each with a title, hook/angle, who it's for (persona), why it matters, recommended CTA type, and estimated difficulty (low/med/high).
2. **Given** the consultant provides constraints (e.g., "no jargon", "board-friendly"), **When** they request topic suggestions, **Then** the returned topics respect those constraints in tone and language.
3. **Given** the consultant requests topics for a specific audience (e.g., nonprofit ED, ops manager), **When** they receive the list, **Then** each topic clearly indicates which persona it is for.

---

### User Story 2 - Generate Content Assets (Priority: P2)

As the consultant, I want to choose a topic (from suggestions or one I provide) and generate ready-to-edit assets (LinkedIn post variants, blog post, email newsletter, board one-pager) so I can publish with minimal effort while keeping a consistent voice.

**Why this priority**: Asset generation is the core value; it depends on having a topic (from P1 or manual input).

**Independent Test**: Can be fully tested by submitting a selected topic and optional brand/constraints, then verifying that the requested asset types are returned with content that matches the specified word counts and style (plain English, nonprofit-friendly). Delivers value even if saving to version control is not yet built (e.g., downloadable payload).

**Acceptance Scenarios**:

1. **Given** the consultant has selected a topic, **When** they request asset generation for LinkedIn, blog, email, and one-pager, **Then** they receive structured content for each requested type with appropriate length and structure (e.g., blog 600–1200 words with H2 sections; LinkedIn 120–220 words with hook and CTA; email 150–300 words with subject and preview; one-pager with 5–7 bullet sections).
2. **Given** the consultant requests multiple LinkedIn variants, **When** they receive the output, **Then** they get at least three variants (e.g., educational, story/case, checklist) with distinct angles.
3. **Given** brand voice and safety rules are configured, **When** any asset is generated, **Then** the content uses plain English, is nonprofit-friendly, avoids fear-mongering or shaming, and does not mention internal systems or make unsubstantiated compliance claims.
4. **Given** the consultant requests an optional asset type (e.g., workshop outline), **When** supported, **Then** they receive a 30–45 minute outline with 5–7 sections and talking points.

---

### User Story 3 - Save as Drafts for Review (Priority: P3)

As the consultant, I want generated outputs saved as draft files (e.g., markdown with frontmatter) so I can review and merge them via my normal workflow (e.g., pull request) before publishing.

**Why this priority**: Review-before-publish reduces risk and keeps content under version control; the feature still delivers value with a downloadable bundle if saving to repo is not available.

**Independent Test**: Can be fully tested by running a "save drafts" flow after generation and verifying that files appear in the expected structure (e.g., by channel/type and date-slug) and that a change set is created for review (e.g., PR). Delivers value by ensuring content is reviewable and traceable.

**Acceptance Scenarios**:

1. **Given** the consultant has generated assets for a topic, **When** they trigger "save as drafts", **Then** each asset is written as a file with a consistent naming scheme (e.g., date and slug) and appropriate frontmatter/metadata.
2. **Given** drafts have been written, **When** the consultant reviews the change set, **Then** they can approve or edit before publishing (no automatic publishing).
3. **Given** the consultant cannot or does not use version-controlled drafts, **When** they request generation, **Then** they can obtain a downloadable bundle (e.g., zip) of the same content as a fallback.

---

### Edge Cases

- What happens when topic suggestion is requested with a very broad or very narrow theme? System should return a sensible set (e.g., cap at 10; avoid empty or duplicate angles).
- What happens when asset generation fails for one asset type (e.g., word limit exceeded)? System should return partial results and indicate which asset(s) failed or were skipped.
- What happens when the consultant requests an unsupported asset type? System should either support it per spec (e.g., workshop outline as optional) or return a clear "not supported" indication.
- What happens when brand/safety rules conflict with requested tone? System must always enforce safety rules (no fear-mongering, no unsubstantiated claims); tone preferences apply only within those bounds.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a request for topic suggestions with at least: theme (or general area), target audience (or persona), and optional constraints (e.g., no jargon, board-friendly).
- **FR-002**: System MUST return a list of topic candidates (e.g., 10) for each topic-suggestion request, each with: title, hook/angle, who it's for (persona), why it matters, recommended CTA type (e.g., free resource / assessment / short call), and estimated difficulty (low/med/high).
- **FR-003**: System MUST accept a request for asset generation with: selected topic (from suggestions or user-provided), optional brand voice settings, optional constraints (word counts, style rules), and list of desired asset types.
- **FR-004**: System MUST generate and return content for each requested asset type according to defined content requirements (LinkedIn: 120–220 words, 3 variants; blog: 600–1200 words with H2 sections; email: 150–300 words with subject and preview; one-pager: 5–7 bullet sections; optional workshop outline: 30–45 min, 5–7 sections with talking points).
- **FR-005**: System MUST enforce brand voice and safety rules on all generated content: plain English, nonprofit-friendly, no fear-mongering or shaming, no mention of internal systems or AI, no unsubstantiated certification/compliance claims; include gentle disclaimers where appropriate.
- **FR-006**: System MUST support at least one way to produce reviewable drafts (e.g., files in a version-controlled repo with a change set for review, or a downloadable bundle). Drafts MUST NOT be published automatically without consultant review.
- **FR-007**: System MUST allow the consultant to trigger the flow via a defined entry point (e.g., workflow dispatch with inputs for theme, audience, channels, tone). A future admin UI is out of scope for v1.
- **FR-008**: System MUST output structured content (e.g., JSON or equivalent) so that downstream steps can write files with consistent naming (e.g., date-slug) and frontmatter.

### Key Entities

- **Topic candidate**: A suggested content idea; attributes include title, hook/angle, target persona, why it matters, recommended CTA type, estimated difficulty.
- **Content asset**: A single generated artifact (e.g., one LinkedIn variant, one blog post); attributes include type, title, body/content, metadata (word count, variant label, etc.), and suggested filename/slug.
- **Generation run**: Optional metadata for a single topic-suggestion or asset-generation request (e.g., theme, topic chosen, assets requested); may be used later for logging or CRM (e.g., Notion) and is out of scope for v1 core.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Consultant can obtain at least 10 distinct topic candidates for a given theme and audience in a single request.
- **SC-002**: Consultant can generate a full set of requested assets (LinkedIn + blog + email + one-pager) for a chosen topic and receive them in under 3 minutes (end-to-end).
- **SC-003**: Generated content passes a spot-check for brand voice and safety (plain English, no fear-mongering, no unsubstantiated claims) on 100% of sampled outputs.
- **SC-004**: Consultant can review drafts before publishing (e.g., via change set or download); zero automatic publishing of generated content without explicit review.
- **SC-005**: Time from "I have a theme" to "I have reviewable drafts" is reduced compared to creating all content manually (e.g., measurable as time-to-draft).

## Assumptions

- Topic suggestion and asset generation are backed by a content-generation capability (e.g., LLM); the exact provider is an implementation detail.
- The first release uses a workflow-triggered entry point (e.g., manual run with inputs); an in-app admin UI may be added later.
- Outputs are consumed by a process that can write files and open a change set (e.g., PR); if that is unavailable, a downloadable bundle is an acceptable fallback.
- Brand voice and safety rules are fixed for v1 (no per-tenant customization).
- Optional CRM logging of "content generation run" to a separate database (e.g., Notion) is out of scope for v1 core.

## Dependencies

- A content-generation capability (e.g., LLM API) that can produce text meeting length and structure constraints.
- A way to trigger the flow with parameters (e.g., theme, audience, preferred channels, tone) and to receive structured output (e.g., JSON).
- For "save as drafts": a way to write files and create a reviewable change set (e.g., version control + PR), or a fallback such as zip download.

## Out of Scope (v1)

- Auto-posting to LinkedIn or any channel.
- Full CMS replacement or fully autonomous publishing without review.
- In-app admin page for running suggestion/generation (MVP is workflow-triggered).
- Per-tenant or per-run override of brand/safety rules.
