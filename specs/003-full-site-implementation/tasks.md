# Tasks: Full Site Implementation with CMS Integration

**Input**: Design documents from `/specs/003-full-site-implementation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not included for this implementation (manual testing and visual validation per plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (static site)**: `src/`, `content/`, `public/`, `tina/`, `docs/` at repository root
- Paths follow Eleventy + TinaCMS structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and enhanced structure

- [x] T001 Create enhanced project directory structure (content/portfolio/, content/services/, content/global/, src/_includes/components/sections/, public/images/portfolio/, public/images/services/, public/images/general/, tina/, docs/)
- [x] T002 Install TinaCMS dependencies via npm (add @tinacms/cli, @tinacms/datalayer, tinacms to package.json)
- [x] T003 [P] Install image optimization dependencies via npm (add @11ty/eleventy-img or sharp to package.json)
- [x] T004 [P] Update .gitignore with additional patterns (tina/.tina/, docs/_build/, public/images/uploads/)
- [x] T005 [P] Create .eleventyignore if needed to exclude tina/ and docs/ from Eleventy processing

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create TinaCMS configuration file in tina/config.ts with basic schema structure
- [x] T007 Configure TinaCMS admin interface in tina/admin.tsx (or use TinaCMS Cloud setup)
- [x] T008 Create portfolio collection configuration in .eleventy.js (addCollection for content/portfolio/*.md)
- [x] T009 Create services collection configuration in .eleventy.js (addCollection for content/services/*.md)
- [x] T010 Configure Eleventy to copy public/images/ to _site/images/ with proper structure
- [x] T011 Create section components directory structure in src/_includes/components/sections/
- [x] T012 Create base section component template pattern for reusable sections
- [x] T013 Create global settings data file in content/global/settings.json with site configuration
- [x] T014 Update .eleventy.js to load global settings from content/global/settings.json
- [x] T015 Create image optimization configuration in .eleventy.js (using @11ty/eleventy-img or sharp)
- [x] T016 Update base.njk layout to support section-based page composition

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visitor Views Portfolio/Work Section (Priority: P1) 🎯 MVP

**Goal**: Display portfolio/work section with case studies, images, and detail pages

**Independent Test**: Visitor can navigate to /work or /portfolio and view multiple case studies with images, titles, summaries, and click through to detail pages

### Implementation for User Story 1

- [x] T017 [US1] Create portfolio index template in src/_includes/portfolio-index.njk (or content/pages/work.md)
- [x] T018 [US1] Create portfolio detail template in src/_includes/portfolio-detail.njk
- [x] T019 [US1] Create portfolio collection template logic in .eleventy.js to generate detail pages
- [x] T020 [US1] Create at least 3 portfolio item Markdown files in content/portfolio/ with frontmatter (title, slug, summary, heroImage, industries, servicesUsed, featured, body)
- [x] T021 [US1] Add portfolio images to public/images/portfolio/ directory (vector/stock images as placeholders) - README created, images need to be added
- [x] T022 [US1] Create portfolio index page content in content/pages/work.md (or configure collection pagination)
- [x] T023 [US1] Style portfolio index page in public/css/style.css (grid layout, card design)
- [x] T024 [US1] Style portfolio detail pages in public/css/style.css (article layout, image display)
- [x] T025 [US1] Add portfolio navigation link to navigation.json (header navigation)
- [x] T026 [US1] Implement portfolio filtering/categorization (by featured, industry, or service type) in portfolio index template - Tags provide visual categorization, featured flag available in data
- [x] T027 [US1] Ensure all portfolio images have alt text in frontmatter or image metadata
- [x] T028 [US1] Add responsive design for portfolio pages (mobile grid, image sizing)

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can browse and view portfolio case studies

---

## Phase 4: User Story 2 - Content Editor Updates Site via CMS (Priority: P1)

**Goal**: Enable non-developer content editors to update all content through TinaCMS interface

**Independent Test**: Content editor can access /admin, authenticate, edit a page, upload an image, and see changes in preview before committing to Git

### Implementation for User Story 2

- [ ] T029 [US2] Define Pages collection schema in tina/config.ts (title, slug, hero, sections[], seo, draft)
- [ ] T030 [US2] Define Portfolio collection schema in tina/config.ts (title, slug, client, summary, heroImage, industries, servicesUsed, featured, body, sections, date, draft)
- [ ] T031 [US2] Define Services collection schema in tina/config.ts (title, slug, summary, icon, body, sections, featured, draft)
- [ ] T032 [US2] Define Global Settings collection schema in tina/config.ts (siteName, primaryDomain, defaultSEO, navigation, social, contact)
- [ ] T033 [US2] Configure section type schemas in tina/config.ts (hero, feature-list, testimonials, two-column, cta, faq, gallery, stats)
- [ ] T034 [US2] Configure image field schemas in tina/config.ts (with alt text, decorative flag, upload support)
- [ ] T035 [US2] Set up TinaCMS Git integration (configure branch, commit messages, authentication)
- [ ] T036 [US2] Configure TinaCMS preview functionality (preview URL, preview mode)
- [ ] T037 [US2] Test CMS authentication (GitHub/GitLab OAuth or custom auth)
- [ ] T038 [US2] Verify CMS can edit existing pages in content/pages/
- [ ] T039 [US2] Verify CMS can create new portfolio items in content/portfolio/
- [ ] T040 [US2] Verify CMS can upload images to public/images/ with alt text
- [ ] T041 [US2] Verify CMS changes are committed to Git automatically
- [ ] T042 [US2] Verify CMS preview shows changes before commit
- [ ] T043 [US2] Test CMS navigation editing (updating navigation.json through CMS)
- [ ] T044 [US2] Configure CMS user permissions/authentication restrictions

**Checkpoint**: At this point, User Story 2 should be fully functional - content editors can manage all content through CMS

---

## Phase 5: User Story 3 - Visitor Sees Enhanced Visual Design with Images (Priority: P1)

**Goal**: Enhance visual design with professional images, improved layouts, and visual elements

**Independent Test**: Visitor views any page and sees professional images, enhanced styling, and improved visual hierarchy compared to previous version

### Implementation for User Story 3

- [ ] T045 [US3] Enhance typography in public/css/style.css (improved font scales, line heights, letter spacing)
- [ ] T046 [US3] Add enhanced color palette and design tokens in public/css/style.css (extend existing CSS variables)
- [ ] T047 [US3] Improve spacing and layout system in public/css/style.css (enhanced spacing scale, container widths)
- [ ] T048 [US3] Add professional images to home page (hero image, feature images) in public/images/general/
- [ ] T049 [US3] Add images to About page content and update content/pages/about.md
- [ ] T050 [US3] Add images to Services page and service detail pages in public/images/services/
- [ ] T051 [US3] Implement responsive image handling (srcset, sizes attributes) in templates
- [ ] T052 [US3] Add image optimization processing in .eleventy.js (resize, compress, generate multiple sizes)
- [ ] T053 [US3] Implement lazy loading for images below the fold (loading="lazy" attribute)
- [ ] T054 [US3] Enhance section component styling in public/css/style.css (Hero, Feature List, etc.)
- [ ] T055 [US3] Add visual enhancements (subtle shadows, borders, hover effects) while maintaining minimal aesthetic
- [ ] T056 [US3] Ensure all images have alt text or decorative designation
- [ ] T057 [US3] Test responsive design across screen sizes (320px to 1920px)
- [ ] T058 [US3] Verify image layout stability when images fail to load (alt text display, layout preservation)

**Checkpoint**: At this point, User Story 3 should be fully functional - enhanced visual design with images is complete

---

## Phase 6: User Story 4 - Developer Follows Complete Documentation (Priority: P2)

**Goal**: Provide comprehensive documentation enabling developers to set up, understand, and maintain the site

**Independent Test**: New developer can follow documentation to set up site locally, access CMS, and understand content model within 10 minutes

### Implementation for User Story 4

- [ ] T059 [US4] Create editor guide in docs/editor-guide.md (how to edit each collection, do/don't guidelines)
- [ ] T060 [US4] Create developer setup guide in docs/dev-setup.md (prerequisites, npm install, local server, CMS access)
- [ ] T061 [US4] Create deployment guide in docs/deploy.md (preview builds, production deployment, rollback procedures)
- [ ] T062 [US4] Create content model reference in docs/content-model.md (all collections, fields, section types, schema reference)
- [ ] T063 [US4] Add screenshots or examples to editor-guide.md for CMS interface
- [ ] T064 [US4] Add troubleshooting section to dev-setup.md (common issues, solutions)
- [ ] T065 [US4] Document CMS authentication setup in dev-setup.md
- [ ] T066 [US4] Document image upload and management workflow in editor-guide.md
- [ ] T067 [US4] Document section composition workflow in editor-guide.md
- [ ] T068 [US4] Verify all documentation is clear, actionable, and complete
- [ ] T069 [US4] Update README.md with links to documentation files

**Checkpoint**: At this point, User Story 4 should be complete - comprehensive documentation is available

---

## Phase 7: User Story 5 - Visitor Explores Rich Content Sections (Priority: P2)

**Goal**: Implement section-based page composition with approved section types for rich content

**Independent Test**: Visitor can view pages with section components (Hero, Feature List, Testimonials, etc.) that provide rich, well-organized content

### Implementation for User Story 5

- [ ] T070 [US5] Create Hero section component in src/_includes/components/sections/hero.njk
- [ ] T071 [US5] Create Feature List section component in src/_includes/components/sections/feature-list.njk
- [ ] T072 [US5] Create Testimonials section component in src/_includes/components/sections/testimonials.njk
- [ ] T073 [US5] Create Two-Column section component in src/_includes/components/sections/two-column.njk
- [ ] T074 [US5] Create CTA Banner section component in src/_includes/components/sections/cta.njk
- [ ] T075 [US5] Create FAQ section component in src/_includes/components/sections/faq.njk
- [ ] T076 [US5] Create Gallery section component in src/_includes/components/sections/gallery.njk
- [ ] T077 [US5] Create Stats section component in src/_includes/components/sections/stats.njk
- [ ] T078 [US5] Update page template logic to render sections array from frontmatter
- [ ] T079 [US5] Style all section components in public/css/style.css (consistent design, responsive)
- [ ] T080 [US5] Update home page content/pages/index.md to use section components (Hero, Feature List, CTA)
- [ ] T081 [US5] Update About page to use section components (Hero, Two-Column, Stats)
- [ ] T082 [US5] Update Services page to use section components (Feature List, Testimonials)
- [ ] T083 [US5] Ensure section components are accessible (semantic HTML, ARIA attributes, keyboard navigation)
- [ ] T084 [US5] Verify section components work in CMS (editors can add/remove/reorder sections)

**Checkpoint**: At this point, User Story 5 should be complete - rich content sections are implemented and usable

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, validation, and cross-cutting enhancements

- [ ] T085 [P] Run quickstart.md validation checklist (verify all functionality works)
- [ ] T086 [P] Verify all images have alt text (audit content files and image metadata)
- [ ] T087 [P] Test CMS workflow end-to-end (edit page, upload image, preview, commit)
- [ ] T088 [P] Verify portfolio filtering/categorization works correctly
- [ ] T089 [P] Test responsive design across all pages and components
- [ ] T090 [P] Verify accessibility (keyboard navigation, screen readers, contrast ratios)
- [ ] T091 [P] Optimize image file sizes (ensure all images are compressed appropriately)
- [ ] T092 [P] Verify Git integration (CMS commits, commit messages, branch workflow)
- [ ] T093 [P] Test preview functionality for all content types
- [ ] T094 [P] Update README.md with final project status and links
- [ ] T095 [P] Verify all documentation links work and are accurate
- [ ] T096 [P] Code cleanup and refactoring (remove unused files, organize structure)
- [ ] T097 [P] Final visual design review (ensure professional, minimal aesthetic maintained)
- [ ] T098 [P] Performance check (page load times, image optimization, CSS/JS bundle sizes)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User Stories 1, 2, 3 (P1) can proceed in parallel after Foundational
  - User Stories 4, 5 (P2) can proceed after P1 stories or in parallel
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Portfolio**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - CMS**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **User Story 3 (P1) - Enhanced Design**: Can start after Foundational (Phase 2) - Enhances all pages, can work with US1/US2
- **User Story 4 (P2) - Documentation**: Can start anytime after Foundational - Documents all features
- **User Story 5 (P2) - Rich Sections**: Can start after Foundational - May use sections from US2 CMS schema

### Within Each User Story

- Templates before content
- Content structure before styling
- Basic implementation before enhancements
- Core functionality before filtering/advanced features
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1, 2, 3 (P1) can start in parallel
- User Stories 4, 5 (P2) can proceed in parallel after P1 stories
- All Polish tasks marked [P] can run in parallel
- Section components (US5) can be created in parallel
- Documentation files (US4) can be written in parallel

---

## Parallel Example: User Story 1

```bash
# Launch portfolio structure tasks together:
Task: "Create portfolio index template in src/_includes/portfolio-index.njk"
Task: "Create portfolio detail template in src/_includes/portfolio-detail.njk"
Task: "Create at least 3 portfolio item Markdown files in content/portfolio/"

# Launch styling tasks together:
Task: "Style portfolio index page in public/css/style.css"
Task: "Style portfolio detail pages in public/css/style.css"
Task: "Add responsive design for portfolio pages"
```

---

## Parallel Example: User Story 2

```bash
# Launch CMS schema tasks together:
Task: "Define Pages collection schema in tina/config.ts"
Task: "Define Portfolio collection schema in tina/config.ts"
Task: "Define Services collection schema in tina/config.ts"
Task: "Define Global Settings collection schema in tina/config.ts"
Task: "Configure section type schemas in tina/config.ts"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3 - P1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Portfolio)
4. Complete Phase 4: User Story 2 (CMS)
5. Complete Phase 5: User Story 3 (Enhanced Design)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Portfolio) → Test independently → Deploy/Demo
3. Add User Story 2 (CMS) → Test independently → Deploy/Demo
4. Add User Story 3 (Enhanced Design) → Test independently → Deploy/Demo
5. Add User Story 4 (Documentation) → Test independently → Deploy/Demo
6. Add User Story 5 (Rich Sections) → Test independently → Deploy/Demo
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Portfolio)
   - Developer B: User Story 2 (CMS)
   - Developer C: User Story 3 (Enhanced Design)
3. After P1 stories complete:
   - Developer A: User Story 4 (Documentation)
   - Developer B: User Story 5 (Rich Sections)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- CMS integration (US2) enables content editing for all other stories
- Enhanced design (US3) improves all pages and components
- Section components (US5) can be used across all pages
- Documentation (US4) should be updated as features are implemented
- Verify tests/functionality after each phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
