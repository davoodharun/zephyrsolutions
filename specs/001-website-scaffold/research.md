# Research: Basic Website Scaffolding and Proof of Concept

**Date**: 2026-01-26  
**Feature**: Basic Website Scaffolding and Proof of Concept  
**Phase**: Phase 0 - Research

## Research Questions

### 1. Eleventy (11ty) Setup and Configuration

**Question**: How to set up Eleventy for a basic brochure site with local development server?

**Decision**: Use Eleventy v2.x (latest stable) with Node.js LTS. Configure `.eleventy.js` with standard directory structure: `src/` for templates, `content/` for Markdown, `public/` for static assets. Use Nunjucks (`.njk`) as the template engine for flexibility.

**Rationale**: 
- Eleventy is specified in the constitution as the SSG
- Zero-config defaults work well for POC
- Nunjucks provides template inheritance and includes, essential for reusable layouts
- Standard directory structure aligns with Eleventy conventions and constitution expectations

**Alternatives Considered**:
- **Handlebars**: Less flexible than Nunjucks for complex layouts
- **Liquid**: Good but Nunjucks is more commonly used with Eleventy
- **Plain HTML**: Too verbose, no template reuse

**References**:
- Eleventy documentation: https://www.11ty.dev/docs/
- Eleventy quick start: https://www.11ty.dev/docs/getting-started/

### 2. Local Development Server

**Question**: How to provide a local development server that starts with a single command?

**Decision**: Use Eleventy's built-in `--serve` flag with `--watch` for auto-reload. Configure npm script `"dev": "eleventy --serve --watch"` in `package.json`. Default port is 8080, which is acceptable.

**Rationale**:
- Eleventy's built-in server is sufficient for POC
- No additional dependencies required
- Auto-reload on file changes improves developer experience
- Port 8080 is standard and unlikely to conflict

**Alternatives Considered**:
- **Browsersync**: More features but adds dependency; not needed for POC
- **Custom Node server**: Unnecessary complexity for static site
- **Python HTTP server**: Works but doesn't integrate with Eleventy build process

**References**:
- Eleventy serve documentation: https://www.11ty.dev/docs/usage/

### 3. Page Structure and Navigation

**Question**: How to structure pages and implement consistent navigation?

**Decision**: Use Eleventy collections for pages. Create a `pages` collection in `.eleventy.js`. Implement navigation as a data file (`_data/navigation.json`) and include it in base layout. Use frontmatter in Markdown files for page metadata (title, description).

**Rationale**:
- Collections provide automatic page discovery
- Data files enable centralized navigation management
- Frontmatter allows per-page customization while maintaining structure
- Base layout ensures consistent navigation across all pages

**Alternatives Considered**:
- **Manual navigation array in each template**: Duplication and maintenance burden
- **Hardcoded navigation**: Not flexible for future CMS integration
- **Separate navigation component**: Overkill for POC, can be refactored later

**References**:
- Eleventy collections: https://www.11ty.dev/docs/collections/
- Eleventy data files: https://www.11ty.dev/docs/data-global/

### 4. Content Organization

**Question**: How to organize content files for maintainability?

**Decision**: Use Markdown files in `content/pages/` directory. Each page has its own `.md` file with frontmatter (title, description, layout). Use Eleventy's directory data files for site-wide configuration (site name, default metadata).

**Rationale**:
- Markdown is human-readable and easy to edit
- Frontmatter provides structured metadata without requiring database
- Directory structure is clear and scalable
- Aligns with constitution's content format requirements (Markdown + frontmatter)

**Alternatives Considered**:
- **JSON/YAML only**: Less readable for content authors
- **Single content file**: Not scalable for multiple pages
- **Database**: Violates constitution principle of Git versioning

**References**:
- Eleventy frontmatter: https://www.11ty.dev/docs/data-frontmatter/
- Eleventy directory data: https://www.11ty.dev/docs/data-template-dir/

### 5. Basic Styling Approach

**Question**: How to provide readable styling without adding complexity?

**Decision**: Use a single `public/css/style.css` file with basic CSS. Include CSS reset/normalize, typography, layout, and navigation styles. Keep it minimal for POC - focus on readability and basic visual hierarchy.

**Rationale**:
- Single CSS file is simple and maintainable
- No build step required for CSS in POC phase
- Can be enhanced later with CSS preprocessors if needed
- Aligns with "Minimize JavaScript" principle

**Alternatives Considered**:
- **CSS framework (Bootstrap/Tailwind)**: Adds dependency and complexity; not needed for POC
- **CSS-in-JS**: Requires JavaScript, violates minimization principle
- **No styling**: Would fail readability requirement

**References**:
- Modern CSS best practices: https://web.dev/learn/css/

### 6. Setup Documentation Requirements

**Question**: What documentation is needed for 5-minute local setup?

**Decision**: Create `README.md` with: prerequisites (Node.js version), installation steps (`npm install`), start command (`npm run dev`), and verification steps (open browser to localhost:8080). Keep it concise and action-oriented.

**Rationale**:
- README is standard location developers expect
- Concise steps reduce cognitive load
- Verification steps confirm successful setup
- Aligns with constitution's documentation requirements

**Alternatives Considered**:
- **Separate setup guide**: Adds file navigation overhead
- **Video tutorial**: Not searchable, harder to update
- **No documentation**: Would fail success criteria

**References**:
- README best practices: https://github.com/matiassingers/awesome-readme

## Technology Choices Summary

| Technology | Version/Choice | Rationale |
|------------|----------------|-----------|
| Static Site Generator | Eleventy 2.x | Constitution requirement, zero-config friendly |
| Template Engine | Nunjucks (.njk) | Flexible, good for layouts and includes |
| Content Format | Markdown + Frontmatter | Human-readable, Git-friendly, constitution-aligned |
| Development Server | Eleventy --serve | Built-in, no extra dependencies |
| Styling | Plain CSS | Simple, no build step, minimal JavaScript |
| Package Manager | npm (default) | Standard, works with Node.js |

## Resolved Clarifications

All technical decisions have been made based on:
- Constitution requirements (Eleventy, Git versioning, minimal JS)
- Feature spec requirements (local server, multi-page, navigation)
- POC scope constraints (simplicity, quick setup)

No outstanding NEEDS CLARIFICATION items remain.
