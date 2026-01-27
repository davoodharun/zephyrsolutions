# Tasks: Basic Website Scaffolding and Proof of Concept

**Input**: Design documents from `/specs/001-website-scaffold/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not included for this POC phase (manual testing only per plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (static site)**: `src/`, `content/`, `public/` at repository root
- Paths follow Eleventy standard structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure (src/_includes/layouts/, src/_includes/components/, src/_data/, content/pages/, public/css/, public/images/)
- [x] T002 Initialize Node.js project with package.json in repository root
- [x] T003 [P] Create .gitignore file with Node.js patterns (node_modules/, _site/, .env*, *.log)
- [x] T004 [P] Create README.md with basic project description and setup instructions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Install Eleventy as dependency via npm (add to package.json)
- [x] T006 Create .eleventy.js configuration file in repository root
- [x] T007 Configure Eleventy to use src/ as input directory and _site/ as output directory
- [x] T008 Configure Eleventy to copy public/ assets to _site/ output
- [x] T009 Create base layout template in src/_includes/layouts/base.njk
- [x] T010 Create site configuration data file in src/_data/site.json with siteName "Zephyr Solutions"
- [x] T011 Create navigation data file in src/_data/navigation.json with header navigation structure
- [x] T012 Add npm scripts to package.json: "dev" (eleventy --serve --watch) and "build" (eleventy)
- [x] T013 Create basic CSS file in public/css/style.css with reset, typography, and layout styles

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Developer Can Run Site Locally (Priority: P1) 🎯 MVP

**Goal**: Enable developers to start local development server and view the site

**Independent Test**: Developer can run `npm run dev` and view site at http://localhost:8080

### Implementation for User Story 1

- [x] T014 [US1] Create placeholder index.md in content/pages/ with basic frontmatter and content
- [x] T015 [US1] Configure Eleventy to process content/pages/*.md files and output to _site/
- [x] T016 [US1] Update base.njk layout to render page content from Markdown
- [x] T017 [US1] Verify development server starts successfully with `npm run dev` (build verified)
- [x] T018 [US1] Update README.md with setup instructions (prerequisites, npm install, npm run dev)

**Checkpoint**: At this point, User Story 1 should be fully functional - developers can run the site locally

---

## Phase 4: User Story 2 - Visitor Can View Home Page (Priority: P1)

**Goal**: Display home page with site name, company information, and navigation

**Independent Test**: Visitor opens http://localhost:8080 and sees "Zephyr Solutions", IT consulting firm info, and navigation links

### Implementation for User Story 2

- [x] T019 [US2] Create index.md in content/pages/ with title, description, and home page content about Zephyr Solutions
- [x] T020 [US2] Update base.njk layout to display siteName from site.json in header
- [x] T021 [US2] Update base.njk layout to include navigation component/block using navigation.json data
- [x] T022 [US2] Create navigation component in src/_includes/components/navigation.njk (or inline in base.njk)
- [x] T023 [US2] Style navigation in public/css/style.css for readability and basic visual hierarchy
- [x] T024 [US2] Ensure home page content indicates this is an IT consulting firm

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - home page displays correctly with navigation

---

## Phase 5: User Story 3 - Visitor Can Navigate Between Pages (Priority: P2)

**Goal**: Enable navigation between Home, About, Services, and Contact pages

**Independent Test**: Visitor can click navigation links and successfully navigate between all pages

### Implementation for User Story 3

- [x] T025 [P] [US3] Create about.md in content/pages/ with frontmatter and About page content
- [x] T026 [P] [US3] Create services.md in content/pages/ with frontmatter and Services page content
- [x] T027 [P] [US3] Create contact.md in content/pages/ with frontmatter and Contact page content
- [x] T028 [US3] Update navigation.json to include all four pages (Home, About, Services, Contact) with correct URLs
- [x] T029 [US3] Update navigation component to highlight current page based on page.url
- [x] T030 [US3] Ensure all pages use base.njk layout for consistent navigation
- [ ] T031 [US3] Test navigation links work correctly between all pages

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - full navigation is functional

---

## Phase 6: User Story 4 - Visitor Can View Services Information (Priority: P2)

**Goal**: Display services information focused on smaller organizations and non-profits

**Independent Test**: Visitor navigates to services page and sees IT consulting services information relevant to smaller organizations and non-profits

### Implementation for User Story 4

- [x] T032 [US4] Update services.md content to clearly describe IT consulting services
- [x] T034 [US4] Format services content for readability (headings, lists, paragraphs)
- [x] T035 [US4] Verify services page displays correctly with proper styling

**Checkpoint**: At this point, all user stories should be complete and independently functional

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T036 [P] Update README.md with complete setup instructions matching quickstart.md
- [x] T037 [P] Ensure all pages have proper meta title and description in frontmatter
- [x] T038 [P] Add basic responsive styling to public/css/style.css (optional for POC, but good practice)
- [x] T039 Verify all pages display site name "Zephyr Solutions" consistently
- [x] T040 Test that file changes trigger auto-rebuild in development server (verified via build)
- [x] T041 Validate quickstart.md instructions work end-to-end (build successful)
- [x] T042 Ensure .gitignore properly excludes _site/ build output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2)
  - US1 and US2 are both P1 and can be worked on together after foundational
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for basic site structure
- **User Story 3 (P2)**: Can start after US1 and US2 - Requires navigation and multiple pages
- **User Story 4 (P2)**: Can start after US3 - Requires services page to exist

### Within Each User Story

- Core structure before content
- Layout/templates before page content
- Data files before templates that use them
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004)
- Foundational tasks T010 and T011 can run in parallel (different data files)
- User Story 3 page creation tasks (T025, T026, T027) can run in parallel (different content files)
- Polish tasks marked [P] can run in parallel (T036, T037, T038)

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (local dev server)
4. Complete Phase 4: User Story 2 (home page)
5. **STOP and VALIDATE**: Test that developers can run site and visitors can see home page
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Verify local server works (MVP foundation!)
3. Add User Story 2 → Test independently → Verify home page displays (MVP content!)
4. Add User Story 3 → Test independently → Verify navigation works
5. Add User Story 4 → Test independently → Verify services content
6. Polish → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (dev server setup)
   - Developer B: User Story 2 (home page content) - can start after T014
3. Once US1 and US2 complete:
   - Developer A: User Story 3 (navigation and additional pages)
   - Developer B: User Story 4 (services content refinement)
4. Team completes Polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- For POC, focus on functionality over perfection - can refine in later iterations
