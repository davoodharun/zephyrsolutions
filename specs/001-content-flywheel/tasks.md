# Tasks: Content Flywheel v1 — Topic Suggestion + Asset Generator

**Input**: Design documents from `specs/001-content-flywheel/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification; no test tasks included.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `functions/` (Cloudflare Pages Functions)
- **Prompts**: `prompts/`
- **Workflows**: `.github/workflows/`
- **Content output**: `content/posts/`, `content/linkedin/`, `content/email/`, `content/onepagers/` (per data-model.md; align with existing repo structure)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create content flywheel structure and prompt stubs

- [x] T001 Create directory `functions/api/content/` and ensure Pages build includes it (per plan.md structure)
- [x] T002 [P] Add topic suggestion prompt template in `prompts/content.topics.md` with placeholders for theme, audience, goals, constraints and required JSON output shape (10 TopicCandidate objects)
- [x] T003 [P] Add asset generation prompt template in `prompts/content.generate.md` with placeholders for topic and asset types and brand/safety rules from spec FR-005

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared env and validation so both content endpoints can be implemented

**⚠️ CRITICAL**: No user story endpoint work should begin until this phase is complete

- [x] T004 Add optional `CONTENT_API_SECRET` to Env type in `functions/_lib/env.ts` and document in `.env.example`
- [x] T005 [P] Create `functions/_lib/validation-content.ts` with request validation: `validateTopicSuggestionRequest(body)` (theme, audience required; goals optional array) and `validateAssetGenerationRequest(body)` (topic.title required; asset_types required, allowed: linkedin, blog, email, onepager, workshop_outline) per data-model.md and contracts

**Checkpoint**: Foundation ready — US1 and US2 implementation can begin

---

## Phase 3: User Story 1 — Suggest Topics (Priority: P1) 🎯 MVP

**Goal**: Consultant can request topic suggestions (theme + audience) and receive 10 topic candidates with title, hook, persona, why_it_matters, cta_type, difficulty.

**Independent Test**: POST to `/api/content/topics` with theme and audience; response has `ok: true` and `topics` array of 10 objects with required fields. No asset generation or workflow required.

### Implementation for User Story 1

- [x] T006 [US1] Implement POST handler in `functions/api/content/topics.ts`: parse JSON body, call `validateTopicSuggestionRequest`, return 400 with `errors` if invalid
- [x] T007 [US1] In `functions/api/content/topics.ts` call existing LLM helper (from `functions/_lib/llm.ts`) with prompt from `prompts/content.topics.md`; parse response to array of TopicCandidate; return 200 with `{ ok: true, topics }`; cap at 10 topics; return 500 with `error: "topic_generation_failed"` on failure
- [x] T008 [US1] Add OPTIONS handler and CORS headers in `functions/api/content/topics.ts` per contracts (Allow-Origin, Allow-Methods POST/OPTIONS, Allow-Headers Content-Type, Authorization)
- [x] T009 [US1] If `CONTENT_API_SECRET` is set in env, require it in `Authorization: Bearer <secret>` or `X-Content-API-Secret` and return 401 when missing or wrong in `functions/api/content/topics.ts`

**Checkpoint**: User Story 1 complete — topic suggestion works via POST /api/content/topics

---

## Phase 4: User Story 2 — Generate Content Assets (Priority: P2)

**Goal**: Consultant can submit a topic and list of asset types and receive structured content (LinkedIn variants, blog, email, one-pager, optional workshop outline) with correct length and brand/safety rules.

**Independent Test**: POST to `/api/content/generate` with topic and asset_types; response has `ok: true`, `topic_title`, `generated_at`, `assets` array (ContentAsset per type), and `errors` array. No workflow required.

### Implementation for User Story 2

- [x] T010 [US2] Implement POST handler in `functions/api/content/generate.ts`: parse JSON body, call `validateAssetGenerationRequest`, return 400 with `errors` if invalid
- [x] T011 [US2] In `functions/api/content/generate.ts` for each requested asset type call LLM with prompt from `prompts/content.generate.md` (per type or batched per research); build ContentAsset with type, variant (for LinkedIn), title, content, metadata, slug, suggested_filename; collect partial results and per-asset errors into `errors` array; return 200 with `{ ok: true, topic_title, generated_at, assets, errors }`
- [x] T012 [US2] Add OPTIONS handler and CORS headers in `functions/api/content/generate.ts` per contracts
- [x] T013 [US2] If `CONTENT_API_SECRET` is set, require it in `functions/api/content/generate.ts` (same as topics)
- [x] T014 [US2] Ensure `prompts/content.generate.md` encodes brand/safety rules (plain English, nonprofit-friendly, no fear-mongering, no mention of AI/internal systems, no unsubstantiated claims) and word-count/structure requirements per spec FR-004 and FR-005

**Checkpoint**: User Story 2 complete — asset generation works via POST /api/content/generate

---

## Phase 5: User Story 3 — Save as Drafts for Review (Priority: P3)

**Goal**: Consultant can trigger a workflow that calls the content API, writes markdown files to the repo with date-slug naming and frontmatter, and opens a PR for review. No automatic publishing.

**Independent Test**: Run workflow_dispatch with inputs; workflow calls /api/content/topics then /api/content/generate; files appear under content/posts/, content/linkedin/, content/email/, content/onepagers/; a new branch is pushed and a PR is opened with title "Content: <topic title>".

### Implementation for User Story 3

- [x] T015 [US3] Create `.github/workflows/content-flywheel.yml` with `workflow_dispatch` and inputs: theme (string), audience (string), preferred_channels (optional), tone (optional)
- [x] T016 [US3] In `.github/workflows/content-flywheel.yml` add step to call `POST /api/content/topics` (deployment URL + secret if set) with inputs and save response JSON
- [x] T017 [US3] In `.github/workflows/content-flywheel.yml` add step to select topic (e.g. first from topics array or from input) and call `POST /api/content/generate` with topic and asset_types `["linkedin","blog","email","onepager"]`; save response JSON
- [x] T018 [US3] In `.github/workflows/content-flywheel.yml` add step to checkout repo, create branch (e.g. `content/YYYY-MM-DD-<slug>`), for each asset in response write file to path per data-model.md (content/posts/YYYY-MM-DD-<slug>.md, content/linkedin/YYYY-MM-DD-<slug>-<variant>.md, content/email/YYYY-MM-DD-<slug>.md, content/onepagers/YYYY-MM-DD-<slug>.md) with frontmatter (title, date, slug) and body from asset.content
- [x] T019 [US3] In `.github/workflows/content-flywheel.yml` add step to commit, push branch, open PR with title "Content: <topic title>" using GitHub CLI or API
- [x] T020 [US3] Document workflow inputs and required secrets (e.g. CONTENT_API_SECRET, deployment URL, GITHUB_TOKEN) in `specs/001-content-flywheel/quickstart.md` or `docs/content-flywheel.md`

**Checkpoint**: User Story 3 complete — full flow from dispatch to PR

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and validation

- [x] T021 [P] Update `docs/` with content flywheel usage: env vars (LLM_API_KEY, LLM_API_URL, CONTENT_API_SECRET), workflow dispatch steps, and file path conventions (e.g. in docs/dev-setup.md or new docs/content-flywheel.md)
- [x] T022 Run quickstart validation: verify curl examples in `specs/001-content-flywheel/quickstart.md` against deployed or local endpoints and confirm workflow steps match content-flywheel.yml

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS US1 and US2
- **Phase 3 (US1)**: Depends on Phase 2 — can start after T004, T005
- **Phase 4 (US2)**: Depends on Phase 2 — can start after T004, T005; independent of US1
- **Phase 5 (US3)**: Depends on Phase 3 and Phase 4 (workflow calls both endpoints)
- **Phase 6 (Polish)**: Depends on at least Phase 3 and 4; full value after Phase 5

### User Story Dependencies

- **US1 (P1)**: No dependency on US2 or US3 — implement and test topics endpoint alone
- **US2 (P2)**: No dependency on US1 for implementation (topic can be user-provided); workflow (US3) uses both US1 and US2
- **US3 (P3)**: Depends on US1 and US2 (workflow calls both APIs)

### Within Each User Story

- Validation and CORS before LLM calls
- Handler structure before error handling and auth
- Prompt content can be done in parallel with handler skeleton (T002/T003 with T006; T009/T010 with T011)

### Parallel Opportunities

- T002 and T003 can run in parallel (different prompt files)
- T005 can run in parallel with T004 (validation module vs env)
- After Phase 2, T006–T009 (US1) and T010–T014 (US2) can be worked in parallel by different implementers
- T021 (docs) can run in parallel with other polish

---

## Parallel Example: User Story 1

```text
# After T005 complete, US1 implementation:
T006: Implement POST handler and validation in functions/api/content/topics.ts
T007: Add LLM call and response shape in functions/api/content/topics.ts (depends on T006)
T008: Add CORS in functions/api/content/topics.ts
T009: Add optional secret check in functions/api/content/topics.ts
```

---

## Parallel Example: User Story 2

```text
# After T005 complete, US2 implementation (can run in parallel with US1):
T010: Implement POST handler and validation in functions/api/content/generate.ts
T011: Add LLM calls per asset type and build assets array in functions/api/content/generate.ts
T012–T014: CORS, secret, prompt rules in same file
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T005)
3. Complete Phase 3: User Story 1 (T006–T009)
4. **STOP and VALIDATE**: Call POST /api/content/topics with theme and audience; verify 10 topics returned
5. Deploy and demo topic suggestion

### Incremental Delivery

1. Setup + Foundational → then US1 → test topics only (MVP)
2. Add US2 → test generate only (full API)
3. Add US3 → test workflow end-to-end (topic → generate → files → PR)
4. Polish (docs, quickstart validation)

### Parallel Team Strategy

- After Phase 2: Developer A does US1 (topics), Developer B does US2 (generate)
- After Phase 3 and 4: Developer C does US3 (workflow) using both endpoints

---

## Notes

- [P] = different files or independent subtasks; no same-file conflicts
- [USn] maps task to spec user story for traceability
- No test tasks: spec did not request TDD or contract tests
- Commit after each task or logical group; validate at each checkpoint
- Content output paths (content/posts/, etc.) may need to match existing Eleventy/site structure — confirm in T018 with repo layout
