# Tasks: Health Check Form Full-Stack Rewrite

**Input**: Design documents from `/specs/001-health-check-form-rewrite/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec; manual/acceptance per quickstart.md and spec acceptance scenarios.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story (US1–US5)
- Include exact file paths in descriptions

## Path Conventions

- Form page: `content/pages/health-check.md`
- Form script: `public/js/health-check-form.js`
- Home page: `content/pages/index.md`
- Schema: `schema/healthcheck_submission.schema.json`
- Submit API: `functions/api/healthcheck/submit.ts`
- Notion mapping: `functions/_lib/notion.ts`
- Docs: `docs/health-check-setup.md`

---

## Phase 1: Setup

**Purpose**: Verify feature context and paths

- [x] T001 Verify feature branch `001-health-check-form-rewrite` and presence of design docs in specs/001-health-check-form-rewrite/ (plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md)
- [x] T002 Confirm key paths exist: content/pages/health-check.md, content/pages/index.md, schema/healthcheck_submission.schema.json, functions/api/healthcheck/submit.ts, public/js/health-check-form.js

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Schema and API accept new values so form submissions succeed. Must complete before US2/US3 submit flows.

**⚠️ CRITICAL**: User stories that submit new options or "Not Sure" depend on this phase.

- [x] T003 Update schema/healthcheck_submission.schema.json: add `not_sure` to `backups_maturity` and `security_confidence` enums per contracts/schema-delta.md
- [x] T004 Ensure functions/api/healthcheck/submit.ts accepts new current_tools and top_pain_points values and `not_sure` for backups_maturity and security_confidence (validation or schema use; no rejection of new values)

**Checkpoint**: Submit handler and schema allow new options and not_sure; Notion mapping already stores rich_text as-is.

---

## Phase 3: User Story 1 – Clear Assessment Name and Purpose (P1) – MVP

**Goal**: Visitor sees a clear assessment name and short, plain-language explanation that it’s free and what it’s for (IT and web development support).

**Independent Test**: Visit /health-check/; confirm heading and intro state it’s a free assessment and explain purpose in plain language (no submission required).

- [x] T005 [P] [US1] Update heading and intro in content/pages/health-check.md to a clear name (e.g. Free IT & Web Assessment) and one- to two-sentence plain-language purpose per research.md and FR-001

**Checkpoint**: US1 deliverable is complete and independently verifiable.

---

## Phase 4: User Story 2 – Expanded Form Options (P2)

**Goal**: Visitor can select new tools (Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint) and new pain points (large maintenance overhead, too much time on repetitive tasks, website maintenance); submission is accepted and stored.

**Independent Test**: Open form; confirm Current Tools and Pain Points include new options; submit with only new options selected; confirm 200 and data stored.

- [x] T006 [US2] Add expanded Current Tools options (Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint) to content/pages/health-check.md alongside existing options
- [x] T007 [US2] Add expanded Pain Points options (Large maintenance overhead, Too much time on repetitive tasks, Website maintenance) to content/pages/health-check.md alongside existing options

**Checkpoint**: New options visible and submittable; backend stores them (Foundational + schema allow any strings for these fields).

---

## Phase 5: User Story 3 – Non-Technical Audience and “Not Sure” (P3)

**Goal**: At least one question has brief plain-language explanation; at least Backup Strategy Maturity and Security Confidence Level offer “Not Sure”; submission with “Not Sure” is valid and stored.

**Independent Test**: Confirm at least one question has helper text and at least one select has “Not Sure”; submit with “Not Sure” where offered; confirm submission succeeds.

- [x] T008 [US3] Add brief plain-language helper text to at least one question (e.g. Backup Strategy Maturity or Security Confidence) in content/pages/health-check.md using existing field-help pattern
- [x] T009 [US3] Add “Not Sure” option to Backup Strategy Maturity and Security Confidence Level selects (value `not_sure`) in content/pages/health-check.md
- [x] T010 [US3] Ensure public/js/health-check-form.js does not reject `not_sure` for backups_maturity and security_confidence (required select: any non-empty value is valid)

**Checkpoint**: Helper text and “Not Sure” visible; form submits and backend stores not_sure.

---

## Phase 6: User Story 4 – Home Page Highlights and Guidance (P4)

**Goal**: Home page has at least one visible element (CTA, card, or section) that highlights the free assessment and links to the health check form.

**Independent Test**: Load home page; confirm at least one element promotes the assessment and links to /health-check/; click link and land on form page.

- [x] T011 [P] [US4] Add at least one home page element (CTA, card, or section) that highlights the free assessment and links to /health-check/ in content/pages/index.md per FR-006 and SC-003

**Checkpoint**: Home page drives traffic to form; link works.

---

## Phase 7: User Story 5 – Notion DB Alignment and CSV (P5)

**Goal**: If form changes require Notion alignment, provide a reference CSV (or equivalent) and brief instructions. Per research, Notion schema does not change; optional reference artifact suffices.

**Independent Test**: Confirm optional reference artifact exists (if delivered) and docs describe how to use it for Notion consistency.

- [x] T012 [P] [US5] Add optional Notion reference CSV or markdown table (field names and allowed values including new tools, pain points, and not_sure) in specs/001-health-check-form-rewrite/ or docs/ per contracts/notion-csv-reference.md
- [x] T013 [US5] Add brief instructions for optional reference CSV/table in docs/health-check-setup.md (how to use for Notion consistency)

**Checkpoint**: Site owner can align exports/imports with form values if needed.

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Validation and docs consistency.

- [x] T014 [P] Run quickstart.md validation: submit form with only new tools/pain points and “Not Sure” on backups and security; confirm 200 and data in Notion (and report link if enabled)
- [x] T015 [P] Review docs/health-check-setup.md for any updates needed for new options or “Not Sure” (env, setup steps, or reference CSV usage)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Setup; blocks US2 and US3 (submit flow).
- **Phase 3 (US1)**: Can start after Setup; content-only, no API dependency.
- **Phase 4 (US2)**: Depends on Foundational (schema + submit accept new values).
- **Phase 5 (US3)**: Depends on Foundational (schema + submit accept not_sure).
- **Phase 6 (US4)**: Can start after Setup; content-only.
- **Phase 7 (US5)**: Can run after form/schema stable; optional artifact.
- **Phase 8 (Polish)**: After US2/US3 (and optionally US1, US4, US5).

### User Story Dependencies

- **US1 (P1)**: Independent; content only.
- **US2 (P2)**: Depends on Foundational; independent of US1, US3, US4.
- **US3 (P3)**: Depends on Foundational; independent of US1, US2, US4.
- **US4 (P4)**: Independent; content only.
- **US5 (P5)**: Independent; optional; can follow any story.

### Parallel Opportunities

- T005 (US1), T011 (US4), T012 (US5) are in different files and can run in parallel after their phase prerequisites.
- T006 and T007 (US2) both edit content/pages/health-check.md; sequence or combine if desired.
- T008, T009, T010 (US3) share form page and script; sequence T008 → T009 → T010.
- T014 and T015 (Polish) can run in parallel.

---

## Parallel Example: After Foundational

```text
# US1 and US4 can run in parallel (different files):
T005 [US1] content/pages/health-check.md (heading + intro)
T011 [US4] content/pages/index.md (home CTA)

# US2 then US3 on health-check.md (same file, order T006 → T007 then T008 → T009 → T010)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup
2. Phase 2: Foundational (schema + submit)
3. Phase 3: US1 (clear name and purpose)
4. **STOP and VALIDATE**: Visit /health-check/; confirm heading and intro.
5. Deploy/demo if ready.

### Incremental Delivery

1. Setup + Foundational → backend ready for new values
2. US1 → clear assessment name (MVP)
3. US2 → expanded tools and pain points → test submit
4. US3 → “Not Sure” and helper text → test submit
5. US4 → home CTA
6. US5 → optional CSV/docs
7. Polish → quickstart validation and docs review

### Single-Developer Order

1. T001–T002 (Setup)
2. T003–T004 (Foundational)
3. T005 (US1)
4. T006–T007 (US2)
5. T008–T010 (US3)
6. T011 (US4)
7. T012–T013 (US5)
8. T014–T015 (Polish)

---

## Notes

- [P] = different files, no dependencies on same-phase tasks.
- [USn] maps task to user story for traceability.
- Each user story is independently testable per spec acceptance scenarios.
- No automated test tasks; use manual checks from quickstart.md and spec.
- Commit after each task or logical group.
