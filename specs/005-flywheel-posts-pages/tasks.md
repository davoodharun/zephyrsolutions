# Tasks: Flywheel Posts as Site Pages

**Input**: Design documents from `/specs/005-flywheel-posts-pages/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec; manual verification per quickstart.

**Organization**: Tasks grouped by user story (US1 = P1 Posts as pages, US2 = P2 Findable and consistent) for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2 for user story phases only
- File paths included in descriptions

## Path Conventions

- Single static site: `.eleventy.js`, `content/posts/`, `src/_includes/layouts/` at repo root; build output `_site/posts/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify project state for posts-as-pages

- [X] T001 Verify Eleventy build and content/posts/ structure per plan: existing .eleventy.js, content/posts/ with at least one .md file (e.g. content/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Posts collection and permalink so content/posts/*.md are rendered at /posts/<fileSlug>/

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 Add content/posts/posts.json with permalink "/posts/{{ page.fileSlug }}/" and layout "layouts/base" (or "layouts/post") per specs/005-flywheel-posts-pages/contracts/posts-permalink.md
- [X] T003 Add posts collection in .eleventy.js: addCollection("posts", …) from content/posts/*.md filtered by !p.data.draft, per data-model and quickstart

**Checkpoint**: Foundation ready — posts get /posts/ URL and collection exists; post layout and sitemap tasks can proceed

---

## Phase 3: User Story 1 - Generated Posts Appear as Site Pages (Priority: P1) 🎯 MVP

**Goal**: Flywheel-generated posts are published as site pages at /posts/<fileSlug>/ so visitors can open and read them after merge and deploy.

**Independent Test**: Run build; open _site/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/index.html (or existing post fileSlug); confirm URL is /posts/<fileSlug>/ and page shows full post content (title, body, date) with same style as other site pages.

### Implementation for User Story 1

- [X] T004 [US1] Create src/_includes/layouts/post.njk that uses layout: layouts/base and wraps {{ content | safe }} in <article>, with optional date display from page.date, per specs/005-flywheel-posts-pages/contracts/posts-layout.md (or set layout to layouts/post in content/posts/posts.json from T002)
- [X] T005 [US1] In .eleventy.js extend the indexable collection to include non-draft, non-noindex posts from content/posts/ so post pages appear in sitemap.xml per quickstart section 3

**Checkpoint**: User Story 1 complete — posts render at /posts/<fileSlug>/ with title and meta description; post URLs appear in sitemap

---

## Phase 4: User Story 2 - Post Pages Are Findable and Consistent (Priority: P2)

**Goal**: Post pages have consistent URLs, metadata (title, description, date), and optional posts index at /posts/ so posts are findable and fit the site.

**Independent Test**: Confirm each post page has unique URL /posts/<fileSlug>/; view source shows <title> and <meta name="description">; optional: open /posts/ and see list of posts with links.

### Implementation for User Story 2

- [X] T006 [P] [US2] Add posts index page at /posts/: create template (e.g. content/posts/index.md with permalink /posts/ and layout that lists collections.posts reverse-chronologically with title, date, link to post URL) or equivalent per quickstart section 4; ensure index does not get permalink /posts/index/ from directory data (override in frontmatter)
- [X] T007 [US2] Document in docs/content-flywheel.md that flywheel-generated posts are published as site pages at /posts/<fileSlug>/ and optionally list URL pattern per FR-003

**Checkpoint**: User Story 2 complete — URL pattern documented; optional posts index lists all non-draft posts with correct links

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verification and draft/noindex behavior

- [X] T008 [P] Run quickstart verification: run build, confirm _site/posts/<fileSlug>/ exists for at least one post and sitemap.xml includes post URLs
- [X] T009 [P] Audit one post page built HTML: confirm <title>, <meta name="description">, and canonical link are present and non-empty; confirm draft posts (if any) are excluded from _site/posts/ and from sitemap

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — needs posts collection and permalink
- **User Story 2 (Phase 4)**: Depends on Foundational; optional index (T006) uses collections.posts from T003
- **Polish (Phase 5)**: Depends on US1 (and optionally US2) completion

### User Story Dependencies

- **US1 (P1)**: After Phase 2 — no dependency on US2
- **US2 (P2)**: After Phase 2 — index (T006) can be done in parallel with T007 after Phase 3

### Within Each User Story

- US1: T004 (post layout) before or with T005 (indexable); directory data in T002 can set layout to layouts/post once post.njk exists, or use base in T002 and add post.njk as enhancement
- US2: T006 and T007 can be parallel

### Parallel Opportunities

- Phase 4: T006 and T007 are independent (index template vs docs)
- Phase 5: T008 and T009 are [P]

---

## Parallel Example: User Story 2

```bash
# After Phase 3, optional index and docs in parallel:
Task T006: Add posts index template (content/posts/index.md or equivalent)
Task T007: Document posts URL in docs/content-flywheel.md
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational (T002 directory data, T003 posts collection)  
3. Complete Phase 3: User Story 1 (T004 post layout, T005 indexable includes posts)  
4. **STOP and VALIDATE**: Build → open /posts/<fileSlug>/ for a post; confirm content and metadata; check sitemap  
5. Deploy and verify post URL live

### Incremental Delivery

1. Setup + Foundational → posts get /posts/ URL and collection ready  
2. Add US1 → post layout + sitemap → posts visible and discoverable (MVP)  
3. Add US2 → posts index + docs → findable and consistent  
4. Polish → quickstart verification and audit  

### Notes

- [P] tasks use different files or can be reordered without breaking others
- [USn] maps task to spec user story for traceability
- Each user story is independently testable per spec acceptance scenarios
- No automated test suite; manual validation per quickstart.md
- Commit after each task or logical group; stop at any checkpoint to validate story
