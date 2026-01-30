# Tasks: LinkedIn Post Automation

**Input**: Design documents from `/specs/001-linkedin-automation/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec; manual validation via workflow run and quickstart.

**Organization**: Tasks grouped by user story (US1 = image association/documentation, US2 = LinkedIn publish workflow).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 or US2
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm repository structure; no new application code.

- [X] T001 Verify repository has `content/linkedin/`, `public/images/content-flywheel/`, `.github/workflows/`, `.github/scripts/`, `docs/` per plan (no new dirs required for this feature)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Contracts that US1 and US2 implementations depend on.

**⚠️ CRITICAL**: User story work references these contracts.

- [X] T002 [P] Ensure specs/001-linkedin-automation/contracts/image-resolution.md exists and documents step-by-step image-to-post resolution (parse post filename for date+slug; image path `public/images/content-flywheel/YYYY-MM-DD-<slug>-social.png` then hero then inline)
- [X] T003 [P] Ensure specs/001-linkedin-automation/contracts/publish-state.md exists and documents publish state schema (e.g. `content/linkedin/.published.json`: post path -> { publishedAtCommit, timestamp })

**Checkpoint**: Contracts ready — US1 and US2 implementation can proceed

---

## Phase 3: User Story 1 – Flywheel images organized by topic/post (Priority: P1) 🎯 MVP

**Goal**: Users and automation can find which images belong to a given LinkedIn post via documented path convention (date+slug).

**Independent Test**: Run Content Flywheel; confirm images in `public/images/content-flywheel/` use `YYYY-MM-DD-<slug>-hero|social|inline`; open docs and locate images for a post in under one minute.

- [X] T004 [US1] Add "Image and post association" section to docs/content-flywheel.md describing date+slug convention and path `public/images/content-flywheel/YYYY-MM-DD-<slug>-hero|social|inline.png` (and that LinkedIn publish prefers social)
- [X] T005 [US1] Create docs/linkedin-automation.md with "Finding images for a post" subsection referencing date+slug and content-flywheel path; add "Setup (LinkedIn app, secrets)" placeholder for US2

**Checkpoint**: User Story 1 complete — image-to-post association is documented and discoverable

---

## Phase 4: User Story 2 – Auto-publish LinkedIn posts on merge (Priority: P2)

**Goal**: On merge to main with changes under `content/linkedin/`, a workflow publishes each new/updated post (and its image when available) to LinkedIn via the developer app; idempotent and no duplicate posts.

**Independent Test**: Merge a PR that adds or updates `content/linkedin/*.md`; verify workflow runs and post (with image when present) appears on LinkedIn; re-run workflow and verify no duplicate post.

- [X] T006 [US2] Create .github/workflows/linkedin-publish.yml triggered on push to main with paths: `content/linkedin/**`; steps: checkout, list changed `.md` files under content/linkedin/ (exclude .published.json), call publish script, commit and push content/linkedin/.published.json if updated
- [X] T007 [US2] Create .github/scripts/linkedin-publish.sh that: accepts list of post file paths and commit SHA; reads content/linkedin/.published.json; for each post not already in state (per contracts/publish-state.md): parse date+slug from filename; resolve image per specs/001-linkedin-automation/contracts/image-resolution.md; obtain LinkedIn access token (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN); upload image via LinkedIn Assets API if file exists; create UGC post via UGC Post API (shareCommentary from post body, media when image uploaded); append entry to state; write updated content/linkedin/.published.json
- [X] T008 [US2] In .github/workflows/linkedin-publish.yml pass LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN as env to script; script on auth or API failure exits non-zero and logs message without exposing tokens (FR-007)
- [X] T009 [US2] Document required GitHub Secrets (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN) and LinkedIn app setup (OAuth, w_member_social, Assets API scopes) in docs/linkedin-automation.md
- [X] T010 [US2] In .github/scripts/linkedin-publish.sh when no image file exists for a post, create UGC post without media (FR-006)

**Checkpoint**: User Story 2 complete — merge to main with content/linkedin changes triggers publish to LinkedIn with image when available; idempotent

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and validation.

- [X] T011 [P] Add "Idempotency" and "Re-running the workflow" subsection to docs/linkedin-automation.md (state file, skip already-published posts)
- [X] T012 Run quickstart validation: follow specs/001-linkedin-automation/quickstart.md (setup secrets, merge test PR or dry-run) and confirm publish flow or document any gaps

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS US1 and US2
- **Phase 3 (US1)**: Depends on Phase 2
- **Phase 4 (US2)**: Depends on Phase 2; can run after or in parallel with Phase 3
- **Phase 5 (Polish)**: Depends on Phase 3 and Phase 4

### User Story Dependencies

- **US1 (P1)**: After Foundational; no dependency on US2
- **US2 (P2)**: After Foundational; uses same image-resolution convention as US1

### Parallel Opportunities

- T002 and T003 can run in parallel (different contract files)
- T004 and T005 can run in parallel (different doc files)
- T011 can run in parallel with other polish

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2
2. Complete Phase 3 (US1): document image association
3. **STOP and VALIDATE**: Confirm users can find images for a post in under one minute using docs

### Full Feature

1. Complete Phase 1–3 (MVP)
2. Complete Phase 4 (US2): workflow + script + secrets doc
3. Complete Phase 5: idempotency doc + quickstart validation

---

## Notes

- [P] tasks use different files and have no dependencies on each other
- [US1]/[US2] map tasks to user stories for traceability
- No automated tests in this list; spec does not require them; validate via manual workflow run
- Commit content/linkedin/.published.json from workflow only when post content changed (not when only state file changed) to avoid unnecessary re-triggers; path filter content/linkedin/** may re-trigger on state file push — workflow should list only *.md files as "posts to publish" so state-only commits do not republish
