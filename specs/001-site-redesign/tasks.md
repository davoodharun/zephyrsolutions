# Tasks: Site Redesign with Warm Material Design

**Input**: Design documents from `/specs/001-site-redesign/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not included for this implementation (manual testing and visual validation per plan.md).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (static site)**: `public/`, `src/`, `content/` at repository root
- Paths follow existing Eleventy structure from plan.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and preparation for redesign

- [x] T001 Create public/js/ directory for parallax JavaScript file
- [x] T002 [P] Backup existing public/css/style.css to public/css/style.css.backup
- [x] T003 [P] Verify existing site structure (src/, content/, public/) is intact
- [x] T004 [P] Check current color palette in public/css/style.css to understand what needs updating

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create warm color palette CSS custom properties in public/css/style.css (replace existing color variables with warm palette)
- [x] T006 Create Material Design elevation CSS custom properties in public/css/style.css (elevation-0 through elevation-5)
- [x] T007 Create parallax JavaScript file structure in public/js/parallax.js with configuration object and initialization function
- [x] T008 Update base.njk layout in src/_includes/layouts/base.njk to include parallax.js script tag
- [x] T009 Update base.njk layout to support full-page view structure (remove container constraints, add section classes)
- [x] T010 Add prefers-reduced-motion media query support in public/css/style.css for accessibility

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visitor Experiences Engaging Full-Page Design with Parallax Scrolling (Priority: P1) 🎯 MVP

**Goal**: Implement full-page view with smooth parallax scrolling effects that create visual depth

**Independent Test**: Visitor can scroll through the site and experience smooth parallax scrolling effects where background elements move at different speeds than foreground content

### Implementation for User Story 1

- [x] T011 [US1] Implement parallax scroll handler in public/js/parallax.js using requestAnimationFrame for smooth performance
- [x] T012 [US1] Add Intersection Observer to public/js/parallax.js to only animate visible elements for performance
- [x] T013 [US1] Implement prefers-reduced-motion detection in public/js/parallax.js to disable parallax when user prefers reduced motion
- [x] T014 [US1] Add parallax element classes to home page sections in content/pages/index.md (parallax-bg, parallax-mid, parallax-fg)
- [x] T015 [US1] Add parallax element classes to other page templates as needed - Single page design implemented
- [x] T016 [US1] Style parallax container elements in public/css/style.css with proper overflow and positioning
- [x] T017 [US1] Implement full-page section layout in public/css/style.css (min-height: 100vh, continuous flow)
- [x] T018 [US1] Add smooth scroll behavior in public/css/style.css (scroll-behavior: smooth with reduced-motion fallback)
- [ ] T019 [US1] Test parallax performance on desktop browsers (verify 60fps target)
- [x] T020 [US1] Configure mobile behavior in public/js/parallax.js (disable or simplify on mobile devices)
- [x] T021 [US1] Add progressive enhancement fallback in public/css/style.css (no-js class styles for when JavaScript disabled)

**Checkpoint**: At this point, User Story 1 should be fully functional - visitors can experience smooth parallax scrolling

---

## Phase 4: User Story 2 - Visitor Sees Warm, Approachable Color Palette (Priority: P1)

**Goal**: Apply warm color palette consistently across all pages and components

**Independent Test**: Visitor views any page and sees a warm color palette (oranges, yellows, warm grays, soft reds) that creates a friendly, approachable feeling

### Implementation for User Story 2

- [x] T022 [US2] Update primary colors in public/css/style.css CSS variables (warm oranges: #ff6b35, #f7931e)
- [x] T023 [US2] Update secondary colors in public/css/style.css CSS variables (warm yellows: #ffc107, #ffb300)
- [x] T024 [US2] Update accent colors in public/css/style.css CSS variables (soft reds: #e57373, #ef5350)
- [x] T025 [US2] Update surface/background colors in public/css/style.css CSS variables (warm whites: #fff8f5, #f5ebe0)
- [x] T026 [US2] Update text colors in public/css/style.css CSS variables (warm grays/browns: #3e2723, #6d4c41, #8d6e63)
- [x] T027 [US2] Update link colors in public/css/style.css CSS variables (warm oranges: #f7931e, #ff6b35)
- [x] T028 [US2] Update border colors in public/css/style.css CSS variables (warm light grays: #d7ccc8, #efebe9)
- [x] T029 [US2] Apply warm colors to header component in src/_includes/layouts/base.njk styling
- [x] T030 [US2] Apply warm colors to navigation component styling in public/css/style.css
- [x] T031 [US2] Apply warm colors to footer component styling in public/css/style.css
- [x] T032 [US2] Apply warm colors to portfolio cards in public/css/style.css
- [x] T033 [US2] Apply warm colors to buttons and interactive elements in public/css/style.css
- [ ] T034 [US2] Verify color contrast ratios meet WCAG AA standards (4.5:1 normal text, 3:1 large text) using contrast checker
- [ ] T035 [US2] Test warm color palette across all pages (home, about, services, work, contact)

**Checkpoint**: At this point, User Story 2 should be complete - warm color palette is consistently applied

---

## Phase 5: User Story 3 - Visitor Experiences Material Design Principles (Priority: P2)

**Goal**: Implement Material Design elevation, shadows, and smooth animations

**Independent Test**: Visitor interacts with the site and experiences Material Design elements including elevated cards with shadows, smooth transitions, and interactive elements that respond with clear visual feedback

### Implementation for User Story 3

- [x] T036 [US3] Apply Material Design elevation to cards in public/css/style.css (use elevation-1, elevation-2 on hover)
- [x] T037 [US3] Apply Material Design elevation to buttons in public/css/style.css (elevation-1 at rest, elevation-2 on hover, elevation-0 on active)
- [x] T038 [US3] Add smooth transitions to interactive elements in public/css/style.css (transition: all 0.2s ease)
- [x] T039 [US3] Implement hover effects for cards in public/css/style.css (elevation increase, slight transform translateY)
- [x] T040 [US3] Implement hover effects for buttons in public/css/style.css (elevation increase, background color change)
- [x] T041 [US3] Implement active/pressed states for buttons in public/css/style.css (elevation decrease, transform translateY)
- [x] T042 [US3] Add focus states for interactive elements in public/css/style.css (outline with warm color, elevation)
- [x] T043 [US3] Apply Material Design elevation to navigation items in public/css/style.css
- [x] T044 [US3] Apply Material Design elevation to portfolio cards in public/css/style.css
- [ ] T045 [US3] Add smooth page transitions if applicable (fade-in, slide-in effects)
- [x] T046 [US3] Ensure Material Design animations don't interfere with screen readers (aria-live, proper semantics)
- [ ] T047 [US3] Test Material Design elements on touch devices (ensure touch feedback works)

**Checkpoint**: At this point, User Story 3 should be complete - Material Design principles are applied throughout

---

## Phase 6: User Story 4 - Visitor Reads Fun, Human-Friendly Content (Priority: P2)

**Goal**: Update content tone to be fun, engaging, and understandable for non-technical audiences

**Independent Test**: Visitor reads site content and finds it fun, engaging, and easy to understand without requiring technical knowledge

### Implementation for User Story 4

- [x] T048 [US4] Rewrite home page content in content/pages/index.md using friendly, approachable language (avoid technical jargon)
- [x] T049 [US4] Rewrite about page content in content/pages/about.md using plain language and relatable examples
- [x] T050 [US4] Rewrite services page content in content/pages/services.md explaining technical concepts in simple terms
- [x] T051 [US4] Update portfolio case study summaries in content/portfolio/*.md to use friendly, benefit-focused language
- [x] T052 [US4] Update contact page content in content/pages/contact.md with warm, inviting tone
- [x] T053 [US4] Review all content for technical jargon and replace with plain language alternatives
- [x] T054 [US4] Add analogies and relatable examples where technical concepts are explained
- [x] T055 [US4] Ensure content maintains professional credibility while being fun and engaging
- [ ] T056 [US4] Test content readability using readability tools (target 8th grade level or below)
- [ ] T057 [US4] Verify content is understandable to non-technical test users

**Checkpoint**: At this point, User Story 4 should be complete - content is fun, human-friendly, and accessible

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, validation, and cross-cutting enhancements

- [ ] T058 [P] Test parallax performance across different browsers (Chrome, Firefox, Safari, Edge)
- [ ] T059 [P] Test warm color palette accessibility with contrast checker tool
- [ ] T060 [P] Test Material Design elements on various screen sizes (320px to 1920px)
- [ ] T061 [P] Verify reduced motion preferences are respected (test with system setting enabled)
- [ ] T062 [P] Test site with JavaScript disabled (progressive enhancement fallback)
- [ ] T063 [P] Test site on mobile devices (verify parallax behavior, touch interactions)
- [ ] T064 [P] Verify page load time is under 3 seconds on 3G connection
- [ ] T065 [P] Check JavaScript bundle size is under 50KB (minified)
- [ ] T066 [P] Test keyboard navigation (Tab, arrow keys, focus indicators)
- [ ] T067 [P] Test with screen reader (verify parallax doesn't interfere)
- [ ] T068 [P] Verify all pages use warm color palette consistently
- [ ] T069 [P] Verify Material Design elements are present on 80%+ of interactive components
- [ ] T070 [P] Run quickstart.md validation checklist
- [ ] T071 [P] Code cleanup and optimization (remove unused CSS, optimize JavaScript)
- [ ] T072 [P] Update README.md if needed to reflect design changes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User Stories 1, 2 (P1) can proceed in parallel after Foundational
  - User Stories 3, 4 (P2) can proceed after P1 stories or in parallel
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Parallax**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - Warm Colors**: Can start after Foundational (Phase 2) - Can work in parallel with US1
- **User Story 3 (P2) - Material Design**: Can start after Foundational (Phase 2) - Enhances US1/US2, can work in parallel
- **User Story 4 (P2) - Content Tone**: Can start after Foundational (Phase 2) - Independent, can work in parallel

### Within Each User Story

- CSS variables before component styling
- JavaScript structure before implementation
- Base styles before enhancements
- Core functionality before optimizations
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, User Stories 1 and 2 (P1) can start in parallel
- User Stories 3 and 4 (P2) can proceed in parallel after P1 stories
- All Polish tasks marked [P] can run in parallel
- Color variable updates (US2) can be done in parallel
- Content updates (US4) can be done in parallel across different pages

---

## Parallel Example: User Story 1

```bash
# Launch parallax implementation tasks together:
Task: "Implement parallax scroll handler in public/js/parallax.js"
Task: "Add Intersection Observer to public/js/parallax.js"
Task: "Implement prefers-reduced-motion detection in public/js/parallax.js"
```

---

## Parallel Example: User Story 2

```bash
# Launch color updates together:
Task: "Update primary colors in public/css/style.css CSS variables"
Task: "Update secondary colors in public/css/style.css CSS variables"
Task: "Update accent colors in public/css/style.css CSS variables"
Task: "Update surface/background colors in public/css/style.css CSS variables"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2 - P1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Parallax)
4. Complete Phase 4: User Story 2 (Warm Colors)
5. **STOP and VALIDATE**: Test both P1 stories independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Parallax) → Test independently → Deploy/Demo
3. Add User Story 2 (Warm Colors) → Test independently → Deploy/Demo
4. Add User Story 3 (Material Design) → Test independently → Deploy/Demo
5. Add User Story 4 (Content Tone) → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Parallax)
   - Developer B: User Story 2 (Warm Colors)
3. After P1 stories complete:
   - Developer A: User Story 3 (Material Design)
   - Developer B: User Story 4 (Content Tone)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Parallax (US1) enhances visual experience but site works without it (progressive enhancement)
- Warm colors (US2) are fundamental visual identity change
- Material Design (US3) enhances existing components
- Content tone (US4) can be updated incrementally through CMS
- Verify tests/functionality after each phase
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: breaking existing functionality, large CSS/JS bundles, accessibility regressions
