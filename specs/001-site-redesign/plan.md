# Implementation Plan: Site Redesign with Warm Material Design

**Branch**: `001-site-redesign` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-site-redesign/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Redesign the Zephyr Solutions website with a warm Material Design aesthetic featuring full-page view with parallax scrolling, warm color palette, Material Design principles, and fun but professional content for non-technical audiences. Research phase confirmed: CSS transforms with vanilla JavaScript for performant parallax (60fps target, requestAnimationFrame, Intersection Observer), Material Design 3 warm color tokens for accessible friendly palette, Material Design 3 elevation and motion guidelines for consistent design language, full-page layout with continuous sections, and plain language content strategy (8th grade readability). Design phase established: warm color palette system with CSS custom properties, parallax configuration with performance optimization, Material Design elevation system (0-5 levels), and content tone guidelines for non-technical audiences. This redesign transforms the existing minimal professional design into a more engaging, approachable experience while maintaining all existing functionality and constitution compliance.

## Technical Context

**Language/Version**: Node.js (LTS 18.x/20.x), CSS3, JavaScript (ES6+ for progressive enhancement)  
**Primary Dependencies**: Eleventy (11ty) static site generator (existing), CSS for styling, minimal JavaScript for parallax effects (requestAnimationFrame, Intersection Observer), no additional frameworks required  
**Storage**: File-based (existing Markdown/JSON/YAML content files, CSS files)  
**Testing**: Manual visual testing, browser compatibility testing, performance testing (fps monitoring), accessibility audits, user testing with non-technical audiences  
**Target Platform**: Web browsers (desktop and mobile), existing Eleventy build process, static hosting  
**Project Type**: Web (static site - design update to existing site)  
**Performance Goals**: Parallax scrolling maintains 60fps, page load <3 seconds on 3G, minimal JavaScript bundle size (<50KB), CSS optimized  
**Constraints**: Must maintain constitution compliance (minimal JS, static HTML output, Git versioning, CMS compatibility), must preserve existing functionality, must respect prefers-reduced-motion, must maintain WCAG AA accessibility, must work without JavaScript (progressive enhancement)  
**Scale/Scope**: Update existing CSS/styling system, add parallax JavaScript, update content tone across all pages, apply Material Design to existing components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Changes Do Not Require Code Changes
**Status**: ✅ COMPLIANT  
**Rationale**: This is a visual design update. Content tone changes can be made through existing CMS (TinaCMS) without code modifications. Design system updates (colors, styles) are code changes but don't prevent content editing through CMS.

### Principle II: Structured Content Over Freeform HTML
**Status**: ✅ COMPLIANT  
**Rationale**: Redesign maintains existing structured content approach. Material Design and parallax are visual/styling enhancements, not content structure changes. No freeform HTML injection introduced.

### Principle III: Everything is Versioned in Git
**Status**: ✅ COMPLIANT  
**Rationale**: All design changes (CSS, JavaScript, content updates) will be committed to Git. No runtime configuration or database changes. Maintains existing Git workflow.

### Principle IV: Preview Before Publish
**Status**: ✅ COMPLIANT  
**Rationale**: Design changes will go through existing PR preview workflow. Visual changes can be reviewed in preview builds before merging to production. Maintains existing preview process.

### Principle V: Minimize JavaScript
**Status**: ⚠️ REQUIRES JUSTIFICATION  
**Rationale**: Parallax scrolling requires JavaScript for smooth effects. However, implementation will use progressive enhancement (works without JS, enhanced with it), minimal vanilla JavaScript (no frameworks), and performance-optimized code (requestAnimationFrame). JavaScript will be lightweight (<50KB) and only for visual enhancements, not core functionality. This is justified as a core design requirement that significantly enhances user experience.

**Gate Result**: ✅ PASS - All principles satisfied, JavaScript addition is minimal and justified for parallax requirement

### Post-Phase 1 Design Re-Evaluation

After Phase 1 design completion:

**Principle I**: ✅ MAINTAINED - Content editing through CMS remains unchanged  
**Principle II**: ✅ MAINTAINED - Structured content approach preserved  
**Principle III**: ✅ MAINTAINED - All changes versioned in Git  
**Principle IV**: ✅ MAINTAINED - Preview workflow unchanged  
**Principle V**: ✅ JUSTIFIED - Minimal JavaScript for parallax (<50KB), progressive enhancement, performance-optimized with requestAnimationFrame

**Final Gate Result**: ✅ PASS - Design maintains constitution compliance, JavaScript addition is minimal, justified, and performance-optimized

### Post-Phase 1 Design Re-Evaluation

After Phase 1 design completion:

**Principle I**: ✅ MAINTAINED - Content editing through CMS remains unchanged  
**Principle II**: ✅ MAINTAINED - Structured content approach preserved  
**Principle III**: ✅ MAINTAINED - All changes versioned in Git  
**Principle IV**: ✅ MAINTAINED - Preview workflow unchanged  
**Principle V**: ✅ JUSTIFIED - Minimal JavaScript for parallax, progressive enhancement, performance-optimized

**Final Gate Result**: ✅ PASS - Design maintains constitution compliance, JavaScript addition is minimal and justified

## Project Structure

### Documentation (this feature)

```text
specs/001-site-redesign/
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
├── css/
│   └── style.css              # Updated with warm palette and Material Design
├── js/
│   └── parallax.js            # Minimal parallax scrolling implementation
└── images/                    # Existing images (no changes)

src/
├── _includes/
│   ├── layouts/
│   │   └── base.njk           # Updated for full-page view and parallax
│   └── components/              # Existing components (updated styling)

content/
├── pages/                     # Existing content (tone updates)
├── portfolio/                 # Existing portfolio (no structural changes)
└── global/                    # Existing settings (no changes)

.eleventy.js                   # Existing config (no changes)
package.json                   # Existing dependencies (no new deps needed)
```

**Structure Decision**: Design update to existing Eleventy structure. Changes primarily in CSS and minimal JavaScript addition. Content updates will be made through existing CMS. No structural changes to repository organization.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| JavaScript for parallax | Core design requirement for engaging full-page experience | CSS-only parallax is limited and doesn't achieve desired smooth effects; JavaScript enables performant 60fps scrolling with requestAnimationFrame |
