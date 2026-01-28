# Tasks: AI-Driven Nonprofit IT Health Check Workflow

**Input**: Design documents from `/specs/001-ai-health-check/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Hybrid project**: Existing Eleventy site at root, Cloudflare Pages Functions in `/functions`
- Paths shown below follow the hybrid architecture from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create `/functions` directory structure for Cloudflare Pages Functions
- [x] T002 Create `/prompts` directory for LLM prompt templates
- [x] T003 Create `/schema` directory for JSON schema files
- [x] T004 [P] Update `package.json` with TypeScript and Cloudflare Workers dependencies
- [x] T005 [P] Create `tsconfig.json` for TypeScript configuration
- [x] T006 [P] Create `wrangler.toml` for Cloudflare Workers local development (optional)
- [x] T007 [P] Create `.env.example` with all required environment variables
- [x] T008 [P] Update `.gitignore` to exclude build outputs, `.env`, and Cloudflare-specific files

**Checkpoint**: Project structure ready for foundational work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 Create `/functions/_lib/env.ts` for environment variable handling and validation
- [x] T010 [P] Create `/functions/_lib/validation.ts` with JSON Schema validation utilities
- [x] T011 [P] Create `/schema/healthcheck_submission.schema.json` with submission validation schema
- [x] T012 [P] Create `/schema/healthcheck_report.schema.json` with report validation schema
- [x] T013 Create `/functions/_lib/crypto.ts` for HMAC token generation and verification
- [x] T014 [P] Create `/functions/_lib/notion.ts` with Notion API client and lead CRUD operations
- [x] T015 [P] Create `/functions/_lib/email.ts` with Resend/SendGrid email client
- [x] T016 [P] Create `/functions/_lib/llm.ts` with OpenAI-compatible LLM API client
- [x] T017 Create `/functions/_lib/html.ts` for HTML report template rendering
- [x] T018 Create `/prompts/healthcheck.system.md` with system prompt for LLM
- [x] T019 Create `/prompts/healthcheck.report.md` with report generation prompt
- [x] T020 Create `/prompts/healthcheck.repair.md` with JSON repair prompt
- [x] T021 Create `/prompts/followup.email.md` with email content generation prompt

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visitor Completes Health Check Assessment (Priority: P1) 🎯 MVP

**Goal**: Visitor can complete and submit the health check form, receiving immediate confirmation

**Independent Test**: Visitor completes form, sees success message, form data is validated and processed without exposing sensitive information

### Implementation for User Story 1

- [x] T022 [US1] Create `/content/pages/health-check.md` with health check form page (or integrate into existing page)
- [x] T023 [US1] Add form HTML with all required fields (org_name, contact_name, email, org_size, current_tools, top_pain_points, backups_maturity, security_confidence, budget_comfort, timeline, notes, honeypot)
- [x] T024 [US1] Add client-side form validation JavaScript in `/public/js/health-check-form.js`
- [x] T025 [US1] Implement form submission handler that POSTs to `/api/healthcheck/submit`
- [x] T026 [US1] Add success/error message display UI
- [x] T027 [US1] Implement `/functions/api/healthcheck/submit.ts` endpoint handler
- [x] T028 [US1] Add request validation using submission schema in submit endpoint
- [x] T029 [US1] Add honeypot field validation (reject if filled)
- [x] T030 [US1] Add rate limiting logic (10 requests/hour per IP) in submit endpoint
- [x] T031 [US1] Add error handling and logging (without sensitive data) in submit endpoint
- [x] T032 [US1] Return appropriate HTTP status codes and error messages

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can submit forms and receive immediate feedback

---

## Phase 4: User Story 2 - Visitor Receives Personalized Health Check Report via Email (Priority: P1) 🎯 MVP

**Goal**: Visitor receives email with personalized report summary and secure report link within 5 minutes

**Independent Test**: Submit form, verify email received with report summary and working report link

### Implementation for User Story 2

- [ ] T033 [US2] Implement Notion lead creation in submit endpoint (status: pending_generation)
- [ ] T034 [US2] Implement LLM report generation call in submit endpoint using prompts
- [ ] T035 [US2] Implement report JSON validation against schema in submit endpoint
- [ ] T036 [US2] Implement report repair logic (one attempt) if validation fails
- [ ] T037 [US2] Implement Notion lead update with report data (status: sent, readiness fields, report JSON)
- [ ] T038 [US2] Implement report token generation (HMAC-signed, 30-day expiry) in submit endpoint
- [ ] T039 [US2] Implement email generation using LLM followup prompt in submit endpoint
- [ ] T040 [US2] Implement email sending with report summary and link in submit endpoint
- [ ] T041 [US2] Implement fallback email logic when report generation fails after repair
- [ ] T042 [US2] Update Notion lead status to "needs_manual_review" on report generation failure
- [ ] T043 [US2] Add error handling for LLM API failures with graceful degradation
- [ ] T044 [US2] Add error handling for Notion API failures with retry logic
- [ ] T045 [US2] Add error handling for email API failures with logging

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - form submission triggers report generation and email delivery

---

## Phase 5: User Story 3 - Lead Data Appears in CRM System (Priority: P1) 🎯 MVP

**Goal**: All form submissions and assessment results are stored in Notion CRM for business follow-up

**Independent Test**: Submit form, verify lead record appears in Notion with all fields populated correctly

### Implementation for User Story 3

- [x] T046 [US3] Create Notion database schema documentation for "Leads" database
- [x] T047 [US3] Implement Notion database property mapping in `/functions/_lib/notion.ts`
- [x] T048 [US3] Implement lead creation with all form fields in submit endpoint
- [x] T049 [US3] Implement lead update with readiness_score, readiness_label, report summary, report JSON
- [x] T050 [US3] Implement lead status transitions (pending_generation → sent → needs_manual_review)
- [x] T051 [US3] Add timestamp fields (Created At, Updated At) to Notion lead records
- [x] T052 [US3] Add source field ("website-healthcheck") to all lead records
- [x] T053 [US3] Implement error handling and retry logic for Notion API calls
- [x] T054 [US3] Verify all form fields are correctly mapped to Notion properties

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - complete workflow from form to CRM

---

## Phase 6: User Story 4 - Visitor Views Secure HTML Report (Priority: P2)

**Goal**: Visitor can click report link from email to view full branded HTML report

**Independent Test**: Click valid report link, verify HTML report renders with all assessment content

### Implementation for User Story 4

- [x] T055 [US4] Implement `/functions/api/healthcheck/report.ts` endpoint handler
- [x] T056 [US4] Implement token verification (HMAC signature and expiration check) in report endpoint
- [x] T057 [US4] Implement Notion lead lookup by lead_id from token in report endpoint
- [x] T058 [US4] Implement report JSON extraction from Notion lead record
- [x] T059 [US4] Implement HTML report template rendering in `/functions/_lib/html.ts`
- [x] T060 [US4] Add branded styling to HTML report (consistent with site theme)
- [x] T061 [US4] Implement error handling for invalid/expired tokens in report endpoint
- [x] T062 [US4] Implement error handling for missing lead records in report endpoint
- [x] T063 [US4] Ensure no internal system details exposed in error messages
- [x] T064 [US4] Add proper HTML structure, accessibility attributes, and semantic markup to report

**Checkpoint**: At this point, all user stories should be independently functional - complete end-to-end workflow

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T065 [P] Add comprehensive error logging (without sensitive data) across all endpoints
- [x] T066 [P] Add request/response logging for debugging (sanitized)
- [x] T067 [P] Verify all environment variables are properly documented in `.env.example`
- [x] T068 [P] Add form accessibility improvements (ARIA labels, keyboard navigation, focus management)
- [x] T069 [P] Add form styling consistent with existing site design
- [x] T070 [P] Optimize LLM prompt templates based on initial testing
- [ ] T071 [P] Add monitoring/alerting for failed report generations (optional)
- [ ] T072 [P] Add admin notification webhook/email for manual review cases (optional)
- [x] T073 [P] Create documentation in `docs/health-check-setup.md` for environment setup
- [ ] T074 [P] Create documentation in `docs/health-check-troubleshooting.md` for common issues
- [ ] T075 [P] Verify quickstart.md scenarios work end-to-end
- [ ] T076 [P] Test rate limiting with various IP addresses
- [ ] T077 [P] Test token expiration and renewal scenarios
- [ ] T078 [P] Test error recovery paths (LLM failure, Notion failure, email failure)
- [x] T079 [P] Verify no sensitive data appears in browser console or network logs
- [ ] T080 [P] Performance testing: verify workflow completes within 2 minutes for 90% of requests

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start immediately after Foundational
  - User Story 2 (P1): Depends on User Story 1 (needs form submission endpoint)
  - User Story 3 (P1): Depends on User Story 2 (needs report generation)
  - User Story 4 (P2): Depends on User Story 2 (needs report generation and tokens)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 (needs form submission endpoint) - Also depends on Foundational
- **User Story 3 (P1)**: Depends on User Story 2 (needs report generation workflow) - Integrated with US2
- **User Story 4 (P2)**: Depends on User Story 2 (needs report generation and token creation)

### Within Each User Story

- Frontend form before backend endpoint
- Validation before processing
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Schema files, prompt files, and utility libraries can be created in parallel
- Different utility modules (_lib files) can be implemented in parallel
- Polish tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Form submission)
4. Complete Phase 4: User Story 2 (Report generation and email)
5. Complete Phase 5: User Story 3 (CRM integration)
6. **STOP and VALIDATE**: Test complete workflow independently
7. Deploy/demo if ready
8. Add Phase 6 (User Story 4 - HTML report) as enhancement

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test form submission → Deploy/Demo
3. Add User Story 2 → Test report generation → Deploy/Demo
4. Add User Story 3 → Test CRM integration → Deploy/Demo (MVP!)
5. Add User Story 4 → Test report viewing → Deploy/Demo
6. Add Polish phase → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (form)
   - Developer B: User Story 2 utilities (LLM, email, Notion)
3. Once User Story 1 is done:
   - Developer A: User Story 2 integration
   - Developer B: User Story 3 (CRM)
4. Once User Stories 1-3 are done:
   - Developer A: User Story 4 (HTML report)
   - Developer B: Polish phase

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- User Stories 1, 2, 3 are P1 (MVP) and must be completed together
- User Story 4 is P2 (enhancement) and can be added after MVP
- Verify all environment variables are set before testing
- Test each integration point (Notion, Email, LLM) independently
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: exposing sensitive data, hardcoding secrets, skipping validation
