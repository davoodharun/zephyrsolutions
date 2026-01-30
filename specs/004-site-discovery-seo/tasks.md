# Tasks: Site Discovery & SEO

**Input**: Design documents from `/specs/004-site-discovery-seo/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec; manual validation per quickstart. Optional verification tasks in Polish phase.

**Organization**: Tasks grouped by user story (US1 = P1 Indexing, US2 = P2 Appearance, US3 = P3 Crawlability) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3 for user story phases only
- File paths included in descriptions

## Path Conventions

- Single static site: `.eleventy.js`, `src/`, `content/`, `docs/` at repo root; build output `_site/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state and data sources for SEO

- [x] T001 Verify Eleventy build and project structure per plan: existing .eleventy.js, src/, content/, docs/ at repo root
- [x] T002 Ensure primaryDomain and defaultSEO in content/global/settings.json are defined; align src/_data/site.json defaultDescription with defaultSEO if used as fallback per data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Global data and layout access so sitemap, robots, and metadata can use primaryDomain and defaults

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Ensure base layout in src/_includes/layouts/base.njk receives globalSettings (primaryDomain, defaultSEO) for canonical URL and metadata fallbacks

**Checkpoint**: Foundation ready — sitemap, robots, and metadata tasks can use globalSettings

---

## Phase 3: User Story 1 - Site Submitted to Google for Indexing (Priority: P1) 🎯 MVP

**Goal**: Site is submittable to Google via a valid sitemap and robots.txt; submission steps documented so the site can be registered and indexed.

**Independent Test**: Run build; open _site/sitemap.xml and _site/robots.txt. Validate sitemap XML; confirm robots.txt contains Sitemap URL. Document GSC submission in docs/; complete submission and confirm homepage indexable (e.g. URL inspection).

### Implementation for User Story 1

- [x] T004 [P] [US1] Add sitemap template (e.g. sitemap.xml.njk in project root) with permalink /sitemap.xml emitting sitemaps.org XML per specs/004-site-discovery-seo/contracts/sitemap-format.md
- [x] T005 [US1] In sitemap template or .eleventy.js, populate sitemap entries from Eleventy collections (pages, portfolio); filter draft and noindex; use globalSettings.primaryDomain for absolute loc URLs
- [x] T006 [P] [US1] Add robots.txt template (e.g. robots.txt.njk in project root) with permalink /robots.txt, User-agent * Allow /, and Sitemap {{ globalSettings.primaryDomain }}/sitemap.xml per specs/004-site-discovery-seo/contracts/metadata-robots.md
- [x] T007 [US1] Add docs/google-submission.md (or section in docs/deploy.md) with steps: verify property in Google Search Console, submit sitemap URL, optional URL inspection for critical URLs

**Checkpoint**: User Story 1 complete — sitemap and robots.txt generated at build; GSC submission documented; site can be submitted and indexed

---

## Phase 4: User Story 2 - Improved Search Result Appearance (Priority: P2)

**Goal**: Every public page has a unique or appropriate title and a meta description (from frontmatter or global default) so search results show clear titles and snippets.

**Independent Test**: Build site; view source on homepage and 2–3 key pages. Confirm <title> and <meta name="description"> are present and non-empty; canonical URL correct.

### Implementation for User Story 2

- [x] T008 [US2] In src/_includes/layouts/base.njk set <title> from page title or global default (globalSettings.defaultSEO.title or site.siteName) so title is never empty
- [x] T009 [US2] In src/_includes/layouts/base.njk set <meta name="description" content="..."> from page description or globalSettings.defaultSEO.description or site.defaultDescription so every public page has non-empty description
- [x] T010 [P] [US2] Add or review frontmatter title and description in content/pages/index.md, content/pages/health-check.md, and other key entry pages (e.g. skills, portfolio) per FR-007

**Checkpoint**: User Story 2 complete — all public pages have title and meta description; key entry points have accurate, click-worthy copy

---

## Phase 5: User Story 3 - Crawlability and Indexability (Priority: P3)

**Goal**: Sitemap lists only indexable pages; non-public or noindex pages are excluded from sitemap or carry noindex meta so they do not compete in search.

**Independent Test**: Build; open _site/sitemap.xml and confirm no draft or noindex URLs listed. If any page is noindex, view source and confirm <meta name="robots" content="noindex,nofollow"> present.

### Implementation for User Story 3

- [x] T011 [US3] In sitemap generation (template or collection filter), exclude draft and noindex pages so sitemap lists only public indexable URLs per FR-002 and FR-006
- [x] T012 [US3] In src/_includes/layouts/base.njk output <meta name="robots" content="noindex,nofollow"> when page has noindex (or equivalent) in frontmatter; omit for normal public pages
- [x] T013 [US3] Document any Disallow or noindex exclusions in specs/004-site-discovery-seo/contracts/metadata-robots.md if non-public paths are added (e.g. /api/, report-only pages)

**Checkpoint**: User Story 3 complete — sitemap and robots/metadata align with indexable vs non-indexable content

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification and docs alignment

- [x] T014 [P] Run quickstart verification: run build, confirm _site/sitemap.xml and _site/robots.txt exist; validate sitemap with an XML sitemap validator
- [x] T015 [P] Audit built HTML for homepage and key entry pages: confirm <title> and <meta name="description"> present and non-empty in src/_includes/layouts/base.njk output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — sitemap and robots need globalSettings
- **User Story 2 (Phase 4)**: Depends on Foundational — layout metadata needs globalSettings; can run in parallel with US1 after Phase 2
- **User Story 3 (Phase 5)**: Depends on US1 (sitemap exists to filter) and layout (noindex meta); can follow US1 and US2
- **Polish (Phase 6)**: Depends on US1–US3 completion

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2/US3
- **US2 (P2)**: After Phase 2 — no dependency on US1/US3 (layout changes independent of sitemap)
- **US3 (P3)**: After US1 (sitemap generation in place to add exclusions) and layout (for noindex); can be done after US2 in same layout file

### Within Each User Story

- US1: T004/T006 can run in parallel; T005 depends on T004; T007 can run after T004–T006
- US2: T008 and T009 both touch base.njk (sequence or single edit); T010 can run in parallel with T008/T009
- US3: T011 (sitemap filter) and T012 (noindex in layout) can be parallel; T013 is documentation

### Parallel Opportunities

- Phase 1: T001 and T002 can run in parallel
- Phase 3: T004 and T006 are [P] (different templates); T007 is doc-only [P] after T006
- Phase 4: T010 is [P] (content files only)
- Phase 6: T014 and T015 are [P]

---

## Parallel Example: User Story 1

```bash
# After Phase 2, create both templates in parallel:
Task T004: Add sitemap.xml.njk with permalink /sitemap.xml
Task T006: Add robots.txt.njk with permalink /robots.txt
# Then T005 (populate sitemap entries), T007 (docs)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1 (sitemap, robots.txt, GSC runbook)  
4. **STOP and VALIDATE**: Build → check _site/sitemap.xml and _site/robots.txt; document and perform GSC submission  
5. Deploy and submit sitemap

### Incremental Delivery

1. Setup + Foundational → global data and layout ready  
2. Add US1 → sitemap + robots + runbook → submit to Google (MVP)  
3. Add US2 → title and description on all pages → better snippets  
4. Add US3 → exclusions and noindex → clean index  
5. Polish → quickstart verification and audit  

### Parallel Team Strategy

- After Phase 2: Developer A — US1 (sitemap, robots, docs); Developer B — US2 (layout metadata, frontmatter). Then Developer C — US3 (filters, noindex) after US1 is in place.

---

## Notes

- [P] tasks use different files or can be reordered without breaking others
- [USn] maps task to spec user story for traceability
- Each user story is independently testable per spec acceptance scenarios
- No automated test suite required; manual validation per quickstart.md
- Commit after each task or logical group; stop at any checkpoint to validate story
