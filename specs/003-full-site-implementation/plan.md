# Implementation Plan: Full Site Implementation with CMS Integration

**Branch**: `003-full-site-implementation` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-full-site-implementation/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Complete the full site implementation for Zephyr Solutions with enhanced styling, portfolio/work section, image management, comprehensive documentation, and TinaCMS integration. Research phase confirmed: TinaCMS Git-backed integration approach, portfolio structure using Eleventy collections, image optimization at build time, section-based page composition with reusable components, enhanced styling building on existing design system, and comprehensive Markdown documentation structure. Design phase established: data model for portfolio items, images, sections, and CMS users; CMS schema contracts defining all editable collections and section types; section component contracts for reusable page sections. This feature transforms the proof-of-concept into a production-ready site where non-developer editors can manage all content through a visual CMS interface, with portfolio case studies, enhanced visual design, and complete documentation enabling team collaboration.

## Technical Context

**Language/Version**: Node.js (LTS 18.x/20.x), TypeScript (for TinaCMS config if needed)  
**Primary Dependencies**: Eleventy (11ty) static site generator, TinaCMS (Git-backed CMS), image optimization libraries (sharp or similar), Node.js package manager  
**Storage**: File-based (Markdown/JSON/YAML content files, image assets in repository or media strategy)  
**Testing**: Manual visual testing, CMS workflow testing, accessibility audits, browser compatibility testing  
**Target Platform**: Web browsers (desktop and mobile), local development environment, production static hosting  
**Project Type**: Web (static site with CMS integration)  
**Performance Goals**: Images optimized and lazy-loaded, CSS/JS bundles minimal, page load <2 seconds on 3G connection, CMS interface responsive  
**Constraints**: Must maintain constitution compliance (Git versioning, preview workflow, minimal JS), images must be optimized, CMS must be Git-backed, documentation must be comprehensive, all content editable via CMS  
**Scale/Scope**: Portfolio collection (3+ items initially), enhanced pages with sections, image assets, complete documentation suite, CMS schema for all collections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Changes Do Not Require Code Changes
**Status**: ✅ COMPLIANT (CORE FEATURE)  
**Rationale**: This feature implements TinaCMS integration specifically to enable non-developer content editing. CMS interface allows editors to update all content types (pages, portfolio, services, settings) without touching code. This is the primary goal of this feature.

### Principle II: Structured Content Over Freeform HTML
**Status**: ✅ COMPLIANT  
**Rationale**: Portfolio items and enhanced content will use structured section types (Hero, Feature List, Testimonials, etc.) as specified in constitution. CMS schema enforces structured content through controlled fields. No freeform HTML injection.

### Principle III: Everything is Versioned in Git
**Status**: ✅ COMPLIANT  
**Rationale**: TinaCMS is Git-backed by design. All CMS changes are automatically committed to Git. Images and content files are stored in repository. No runtime database.

### Principle IV: Preview Before Publish
**Status**: ✅ COMPLIANT  
**Rationale**: TinaCMS provides preview functionality. PR previews will be available for all changes. CMS changes go through preview workflow before production. This is a core requirement of the feature.

### Principle V: Minimize JavaScript
**Status**: ✅ COMPLIANT  
**Rationale**: TinaCMS adds necessary JavaScript for CMS interface, but this is justified for content management capability. Site output remains static HTML. CMS JS is only loaded in edit mode, not on public site.

**Gate Result**: ✅ PASS - All principles satisfied, this feature enables full constitution compliance

### Post-Phase 1 Design Re-Evaluation

After Phase 1 design completion:

**Principle I**: ✅ ENABLED - TinaCMS integration provides non-developer content editing capability  
**Principle II**: ✅ ENFORCED - Section-based composition with CMS schema enforces structured content  
**Principle III**: ✅ MAINTAINED - All CMS changes committed to Git automatically, images in repository  
**Principle IV**: ✅ ENABLED - CMS preview functionality and PR previews support preview workflow  
**Principle V**: ✅ MAINTAINED - CMS JS only in edit mode, site output remains static HTML

**Final Gate Result**: ✅ PASS - Design fully enables constitution compliance, CMS integration aligns with all principles

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
src/
├── _includes/
│   ├── layouts/
│   │   └── base.njk           # Base layout (enhanced)
│   ├── components/            # Reusable components
│   │   ├── sections/          # Section components (Hero, Feature List, etc.)
│   │   └── portfolio/         # Portfolio-specific components
│   └── shortcodes/            # Eleventy shortcodes if needed
├── _data/                     # Global site data
└── pages/                     # Page templates (if needed)

content/
├── pages/                     # Page content (Markdown)
├── portfolio/                 # Portfolio/case studies (Markdown)
├── services/                  # Service detail pages (Markdown)
└── global/                    # Global settings (JSON/YAML)

public/
├── css/
│   └── style.css              # Enhanced styling
├── images/                    # Image assets
│   ├── portfolio/            # Portfolio images
│   ├── services/             # Service images
│   └── general/              # General site images
└── js/                        # Minimal JS if needed

tina/                          # TinaCMS configuration
├── config.ts                  # TinaCMS schema configuration
└── admin.tsx                  # CMS admin interface

docs/                          # Documentation
├── editor-guide.md           # Content editor guide
├── dev-setup.md              # Developer setup instructions
├── deploy.md                 # Deployment process
└── content-model.md          # Content model reference

.eleventy.js                   # Eleventy configuration (enhanced)
package.json                   # Dependencies including TinaCMS
.gitignore                     # Git ignore rules
README.md                      # Project documentation

_site/                         # Build output (not committed)
```

**Structure Decision**: Extends existing Eleventy structure with TinaCMS integration. Portfolio content in `content/portfolio/`, images organized by purpose in `public/images/`, TinaCMS config in `tina/`, and comprehensive documentation in `docs/`. Section components in `src/_includes/components/sections/` for reusable page sections.
