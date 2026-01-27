# Implementation Plan: Modern Minimal Professional Styling

**Branch**: `002-modern-styling` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-modern-styling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Enhance the Zephyr Solutions website with modern, minimal, and professional styling following CSS and HTML best practices. Research phase confirmed approach: modular CSS architecture with design tokens (CSS variables), professional blue/gray color palette meeting WCAG AA standards, system fonts with modular typography scale, 8px base unit spacing system, semantic HTML enhancements, and mobile-first responsive design. Design phase established CSS architecture contract (variables → reset → base → layout → components → responsive), HTML structure contract (semantic elements, heading hierarchy, ARIA labels), and validation procedures. Implementation will enhance existing site without breaking functionality.

## Technical Context

**Language/Version**: CSS3, HTML5 (web standards)  
**Primary Dependencies**: None (pure CSS/HTML, no additional libraries required)  
**Storage**: N/A (styling only, no data storage)  
**Testing**: Manual visual testing, browser developer tools, accessibility audit tools (Lighthouse, WAVE), color contrast checkers  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)  
**Project Type**: Web (styling enhancement to existing static site)  
**Performance Goals**: CSS file size remains reasonable (<50KB), no performance degradation, styles load without blocking render  
**Constraints**: Must maintain existing HTML structure and functionality, enhance without breaking current behavior, must meet WCAG AA accessibility standards, must work across all existing pages (Home, About, Services, Contact)  
**Scale/Scope**: 4-5 pages, single CSS file, HTML template updates for semantic structure

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Changes Do Not Require Code Changes
**Status**: ✅ COMPLIANT  
**Rationale**: Styling changes do not affect content editing workflow. CSS and HTML structure improvements are code-level changes that don't impact the CMS/content editing experience (when TinaCMS is integrated).

### Principle II: Structured Content Over Freeform HTML
**Status**: ✅ COMPLIANT  
**Rationale**: Enhancing HTML with semantic elements strengthens structured content approach. CSS improvements maintain design consistency and prevent visual drift. No freeform HTML is being introduced.

### Principle III: Everything is Versioned in Git
**Status**: ✅ COMPLIANT  
**Rationale**: All CSS and HTML template changes will be committed to Git. No runtime configuration or external styling dependencies.

### Principle IV: Preview Before Publish
**Status**: ✅ COMPLIANT  
**Rationale**: Styling changes will be previewed through local development server and PR previews. Visual changes are particularly important to preview before production.

### Principle V: Minimize JavaScript
**Status**: ✅ COMPLIANT  
**Rationale**: This feature is pure CSS/HTML with no JavaScript requirements. Aligns perfectly with minimal JavaScript principle.

**Gate Result**: ✅ PASS - All principles satisfied

### Post-Phase 1 Design Re-Evaluation

After Phase 1 design completion:

**Principle I**: ✅ Maintained - Styling changes don't affect content editing workflow  
**Principle II**: ✅ Enhanced - Semantic HTML strengthens structured content approach  
**Principle III**: ✅ Maintained - All CSS and HTML changes committed to Git  
**Principle IV**: ✅ Maintained - Styling changes previewed through local dev server and PR previews  
**Principle V**: ✅ Maintained - Pure CSS/HTML implementation, no JavaScript added

**Final Gate Result**: ✅ PASS - Design aligns with all constitution principles, enhances existing structure without violations

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
public/
└── css/
    └── style.css          # Enhanced CSS with design system

src/
├── _includes/
│   └── layouts/
│       └── base.njk       # HTML template updates for semantic structure
└── _data/                 # (no changes)

content/
└── pages/                 # (no changes)
```

**Structure Decision**: Styling enhancement maintains existing Eleventy structure. Changes are limited to CSS file (`public/css/style.css`) and HTML template (`src/_includes/layouts/base.njk`) for semantic improvements. No new directories or files required.
