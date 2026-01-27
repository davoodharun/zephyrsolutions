# Implementation Plan: Basic Website Scaffolding and Proof of Concept

**Branch**: `001-website-scaffold` | **Date**: 2026-01-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-website-scaffold/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Create a basic website scaffolding and proof of concept for Zephyr Solutions, an IT consulting firm brochure site. The site must be servable locally and runnable with minimal setup. This POC establishes the foundation using Eleventy (11ty) as the static site generator, with focus on local development server, basic page structure (Home, About, Services, Contact), and navigation. Research phase confirmed Eleventy's built-in server with watch mode meets requirements. Design phase established file-based content structure with Markdown frontmatter, Nunjucks templates, and centralized navigation/data files. TinaCMS integration is deferred to a later phase to keep POC focused on core functionality.

## Technical Context

**Language/Version**: Node.js (LTS version, typically 18.x or 20.x)  
**Primary Dependencies**: Eleventy (11ty) static site generator, Node.js package manager (npm/pnpm/yarn)  
**Storage**: File-based (Markdown/JSON/YAML content files in repository)  
**Testing**: Manual testing for POC phase; automated testing framework TBD for future phases  
**Target Platform**: Web browsers (desktop focus for POC), local development environment  
**Project Type**: Web (static site)  
**Performance Goals**: Local dev server starts in <5 seconds, pages load in <1 second locally  
**Constraints**: Must run locally in <5 minutes from fresh clone, single command to start server, no database required  
**Scale/Scope**: 4-5 pages (Home, About, Services, Contact, optional), basic navigation, placeholder content for POC

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Content Changes Do Not Require Code Changes
**Status**: ⚠️ DEFERRED FOR POC  
**Rationale**: For the proof of concept, content will be in Markdown files that require code repository access. TinaCMS integration (which enables non-developer content editing) is explicitly deferred to maintain POC scope. This is acceptable for initial scaffolding as it establishes the foundation for future CMS integration.

### Principle II: Structured Content Over Freeform HTML
**Status**: ✅ COMPLIANT  
**Rationale**: Pages will use Eleventy templates and layouts. Content will be structured via frontmatter and Markdown, not freeform HTML. Section-based composition can be introduced in POC templates.

### Principle III: Everything is Versioned in Git
**Status**: ✅ COMPLIANT  
**Rationale**: All content, templates, and configuration will be committed to Git. No runtime database. This aligns perfectly with static site generator approach.

### Principle IV: Preview Before Publish
**Status**: ✅ COMPLIANT (LOCAL FOCUS)  
**Rationale**: Local development server provides immediate preview capability. PR previews will be addressed in deployment phase (post-POC).

### Principle V: Minimize JavaScript
**Status**: ✅ COMPLIANT  
**Rationale**: Static site generator produces static HTML/CSS. No client-side frameworks required for POC. Progressive enhancement can be added later if needed.

**Gate Result**: ✅ PASS (with noted deferral of CMS for POC scope)

### Post-Phase 1 Design Re-Evaluation

After Phase 1 design completion:

**Principle I**: ⚠️ Still deferred - File-based content requires Git access, but structure is ready for future TinaCMS integration  
**Principle II**: ✅ Maintained - Templates use structured layouts, content via frontmatter, no freeform HTML  
**Principle III**: ✅ Maintained - All content in Git, no runtime database  
**Principle IV**: ✅ Enhanced - Local dev server provides immediate preview, PR previews will be added in deployment phase  
**Principle V**: ✅ Maintained - Static HTML/CSS output, no JavaScript frameworks

**Final Gate Result**: ✅ PASS - Design aligns with constitution principles, CMS integration deferred appropriately for POC scope

## Project Structure

### Documentation (this feature)

```text
specs/001-website-scaffold/
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
├── _includes/          # Eleventy layout templates and components
│   ├── layouts/
│   │   └── base.njk    # Base layout template
│   └── components/     # Reusable components (header, footer, nav)
├── _data/              # Global site data (site.json for config)
└── pages/              # Page templates (can use collections instead)
    ├── index.njk       # Home page
    ├── about.njk       # About page
    ├── services.njk    # Services page
    └── contact.njk     # Contact page

content/                # Markdown content files
├── pages/
│   ├── index.md        # Home page content
│   ├── about.md        # About page content
│   ├── services.md     # Services page content
│   └── contact.md      # Contact page content

public/                 # Static assets (CSS, images, etc.)
├── css/
│   └── style.css       # Basic styling
└── images/             # Image assets

.eleventy.js            # Eleventy configuration
package.json            # Node.js dependencies and scripts
.gitignore              # Git ignore rules
README.md               # Setup and usage instructions

_site/                  # Build output (not committed, in .gitignore)
```

**Structure Decision**: Using Eleventy's standard directory structure with `src/` for templates, `content/` for Markdown content, and `public/` for static assets. This aligns with constitution's repository structure expectations and Eleventy best practices. The `_site/` directory is the build output and will be excluded from version control.

