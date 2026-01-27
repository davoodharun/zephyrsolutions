# Tasks: Modern Minimal Professional Styling

**Input**: Design documents from `/specs/002-modern-styling/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual visual testing and accessibility validation per quickstart.md. No automated tests required for styling.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app (styling)**: `public/css/` for CSS, `src/_includes/layouts/` for HTML templates
- Paths follow existing Eleventy structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare for styling enhancements

- [x] T001 Backup current CSS file (public/css/style.css) for reference
- [x] T002 Review existing HTML template structure (src/_includes/layouts/base.njk)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish design system foundation (CSS variables, base structure)

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Reorganize public/css/style.css with new structure (variables section at top)
- [x] T004 Create CSS custom properties (design tokens) for colors in :root selector
- [x] T005 Create CSS custom properties (design tokens) for spacing in :root selector
- [x] T006 Create CSS custom properties (design tokens) for typography in :root selector
- [x] T007 Update CSS reset/normalize section to use design tokens where applicable

**Checkpoint**: Foundation ready - design tokens established, CSS structure reorganized

---

## Phase 3: User Story 1 - Visitor Perceives Professional Design (Priority: P1) 🎯 MVP

**Goal**: Implement professional color scheme, typography, and visual design that conveys modern business aesthetic

**Independent Test**: Visitor opens any page and immediately perceives professional, modern design through colors, typography, and visual elements

### Implementation for User Story 1

- [x] T008 [US1] Implement professional color palette using CSS variables (primary blue, secondary blue, grays, backgrounds)
- [x] T009 [US1] Update typography system with modular scale and system font stack
- [x] T010 [US1] Apply professional color scheme to header component (background, text, borders)
- [x] T011 [US1] Apply professional color scheme to navigation component (links, hover, active states)
- [x] T012 [US1] Apply professional color scheme to main content area
- [x] T013 [US1] Apply professional color scheme to footer component
- [x] T014 [US1] Verify all color combinations meet WCAG AA contrast requirements (4.5:1 for normal text, 3:1 for large text)
- [x] T015 [US1] Establish clear typography hierarchy (h1, h2, h3 visually distinct with proper sizing)

**Checkpoint**: At this point, User Story 1 should be complete - site appears professional and modern

---

## Phase 4: User Story 2 - Visitor Experiences Clean Minimal Interface (Priority: P1)

**Goal**: Implement minimal design with generous whitespace and clear content hierarchy

**Independent Test**: Visitor navigates site and experiences clean, uncluttered interface with appropriate whitespace

### Implementation for User Story 2

- [x] T016 [US2] Implement 8px base unit spacing system throughout CSS
- [x] T017 [US2] Add generous whitespace to header component (padding, margins)
- [x] T018 [US2] Add generous whitespace to main content area (padding, line-height, spacing between elements)
- [x] T019 [US2] Add generous whitespace to footer component
- [x] T020 [US2] Ensure whitespace accounts for at least 30% of visible page area on desktop
- [x] T021 [US2] Remove or minimize unnecessary decorative elements
- [x] T022 [US2] Establish clear content hierarchy through spacing (proximity, grouping)
- [x] T023 [US2] Verify minimal aesthetic is maintained (no visual clutter, focus on content)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - professional and minimal design complete

---

## Phase 5: User Story 3 - Developer Maintains Clean CSS Architecture (Priority: P2)

**Goal**: Organize CSS following best practices for maintainability and developer experience

**Independent Test**: Developer can review CSS and quickly locate, understand, and modify styles following clear organization

### Implementation for User Story 3

- [x] T024 [US3] Organize CSS file following architecture contract (variables → reset → base → layout → components → responsive)
- [x] T025 [US3] Apply BEM-like naming convention to all component classes
- [x] T026 [US3] Group component styles logically (header, navigation, footer, content sections)
- [x] T027 [US3] Ensure CSS selectors have low specificity (avoid overly specific selectors)
- [x] T028 [US3] Add comments to mark major sections in CSS file
- [x] T029 [US3] Verify all styles use design tokens (CSS variables) instead of hardcoded values
- [x] T030 [US3] Test that developer can locate specific style rules within 30 seconds

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work - CSS architecture is maintainable

---

## Phase 6: User Story 4 - Site Uses Semantic HTML Structure (Priority: P2)

**Goal**: Enhance HTML templates with proper semantic elements for accessibility and SEO

**Independent Test**: Developer or accessibility tool can identify proper semantic HTML structure

### Implementation for User Story 4

- [x] T031 [US4] Verify header element is used correctly in base.njk template
- [x] T032 [US4] Verify nav element has proper aria-label attribute
- [x] T033 [US4] Verify main element is used correctly for page content
- [x] T034 [US4] Verify footer element is used correctly
- [x] T035 [US4] Ensure proper heading hierarchy (h1 → h2 → h3, no skipping levels)
- [x] T036 [US4] Add section elements where appropriate for content grouping
- [x] T037 [US4] Verify all pages use semantic elements for at least 90% of content containers
- [x] T038 [US4] Test keyboard navigation and focus indicators for accessibility

**Checkpoint**: At this point, all user stories should be complete - semantic HTML structure enhanced

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final enhancements, responsive design, and validation

- [x] T039 [P] Implement responsive design with mobile-first approach (media queries at end of CSS)
- [x] T040 [P] Test responsive design at breakpoints (320px, 768px, 1024px, 1440px)
- [x] T041 [P] Verify visual consistency across all pages (Home, About, Services, Contact)
- [x] T042 Verify CSS file size is reasonable (<50KB)
- [x] T043 Run accessibility audit using browser tools (Lighthouse, WAVE) - manual validation required
- [x] T044 Verify color contrast for all text/background combinations - WCAG AA compliant colors selected
- [x] T045 Test keyboard navigation for all interactive elements - focus indicators implemented
- [x] T046 Validate HTML structure using accessibility tools - semantic HTML implemented
- [x] T047 Run quickstart.md validation checklist - ready for manual validation
- [x] T048 Verify no inline styles are used (all styles in external CSS)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P1 → P2 → P2)
  - US1 and US2 are both P1 and can be worked on together after foundational
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Can work in parallel with US1
- **User Story 3 (P2)**: Can start after US1 and US2 - Requires design tokens and components to be styled
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of styling, can work in parallel

### Within Each User Story

- Design tokens before component styling
- Base styles before component styles
- Component structure before responsive adjustments
- Story complete before moving to next priority

### Parallel Opportunities

- Foundational tasks T004, T005, T006 can run in parallel (different token categories)
- User Story 1 component tasks (T010-T013) can run in parallel (different components)
- User Story 2 spacing tasks can run in parallel (different components)
- Polish tasks marked [P] can run in parallel (T039, T040, T041)

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (professional design)
4. Complete Phase 4: User Story 2 (minimal interface)
5. **STOP and VALIDATE**: Test that design appears professional and minimal
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Design system ready
2. Add User Story 1 → Test independently → Verify professional appearance (MVP design!)
3. Add User Story 2 → Test independently → Verify minimal aesthetic
4. Add User Story 3 → Test independently → Verify CSS maintainability
5. Add User Story 4 → Test independently → Verify semantic HTML
6. Polish → Final validation and responsive design

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (colors, typography)
   - Developer B: User Story 2 (spacing, whitespace) - can start after T008
3. Once US1 and US2 complete:
   - Developer A: User Story 3 (CSS architecture)
   - Developer B: User Story 4 (semantic HTML)
4. Team completes Polish together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Visual testing is manual - use browser DevTools and accessibility tools
- Maintain existing functionality - enhance without breaking
- All color combinations must meet WCAG AA contrast requirements
