<!--
Sync Impact Report:
Version: 1.0.0 (initial creation)
Ratified: 2026-01-26
Last Amended: 2026-01-26

Modified Principles: N/A (initial creation)
Added Sections:
  - Purpose
  - Success Criteria
  - Non-Goals
  - Tech Stack
  - Content Model
  - Page Composition Rules
  - URL & SEO Rules
  - Asset & Media Rules
  - Repository Structure
  - Branching, Reviews, and Publishing
  - Environments & Deployments
  - Definition of Done
  - Change Management
  - Documentation Requirements
  - Ownership

Templates requiring updates:
  ✅ plan-template.md - Constitution Check section remains generic (appropriate)
  ✅ spec-template.md - No constitution-specific references to update
  ✅ tasks-template.md - No constitution-specific references to update
  ✅ checklist-template.md - No constitution-specific references to update

Follow-up TODOs: None
-->

# Company Brochure Website (11ty + TinaCMS) Constitution

## Purpose

Create a fast, secure, low-maintenance company brochure website that is easy to
update via a Git-backed visual editor (TinaCMS) while preserving a clean,
developer-friendly workflow (PRs, previews, versioning).

## Core Principles

### I. Content Changes Do Not Require Code Changes

Content updates MUST be achievable through the CMS interface without modifying
source code, templates, or build configuration. Editors assemble pages from
approved section types. Rationale: Enables non-developer content management
while maintaining design consistency and security.

### II. Structured Content Over Freeform HTML

Pages are built from approved, reusable section types (Hero, Feature List,
Testimonials, etc.). Editors configure sections through controlled fields, not
raw HTML. Custom HTML injection is prohibited by default. Rationale: Prevents
design inconsistencies, security vulnerabilities, and content drift while
maintaining flexibility through well-defined section schemas.

### III. Everything is Versioned in Git

All content, configuration, and code changes are committed to Git. Rollback is
a revert. No runtime database stores content state. Rationale: Provides
complete audit trail, enables preview builds from any commit, and supports
collaborative workflows through standard Git practices.

### IV. Preview Before Publish

Every change MUST be viewable as a preview build before merging to production.
PR previews are mandatory. Rationale: Prevents broken content, design issues,
and accessibility regressions from reaching production. Enables stakeholder
review without affecting live site.

### V. Minimize JavaScript

Default to static HTML with progressive enhancement. Avoid unnecessary
client-side frameworks. Large JavaScript bundles are prohibited unless
justified. Rationale: Improves performance, accessibility, and SEO while
reducing maintenance burden and security surface area.

## Success Criteria

Non-developer editors MUST be able to update:

- Home, About, Services (index + detail), Work/Case Studies, Contact pages
- Global navigation/footer, social links, legal links
- SEO fields (title/description/og image) per page
- Images (upload + alt text) and basic page ordering

Automation requirements:

- Every merge to main triggers an automated production deploy
- Every PR triggers a deploy preview

Quality requirements:

- Accessibility baseline met for navigation, headings, contrast, and forms
- Site can be run locally in <5 minutes from a fresh clone

## Non-Goals

- No user accounts, dashboards, or personalized content
- No "anything goes" WYSIWYG page building
- No multi-CMS architecture or runtime database

## Tech Stack

**SSG**: Eleventy (11ty)

**CMS**: TinaCMS (Git-backed)

**Content Format**: Markdown/MDX (if needed) + frontmatter; JSON/YAML for
structured data where appropriate

**Hosting**: Static host with preview builds (implementation decision;
constitution assumes previews exist)

**Forms**: Hosted form provider or serverless endpoint with validation + rate
limiting

## Content Model

The CMS schema MUST provide these collections (minimum):

### Global Settings

- siteName
- primaryDomain
- defaultSEO: title, description, ogImage
- navigation: header items, footer columns, legal links
- social: linkedin/github/etc
- contact: email/phone/address, optional map link

### Pages

- Home (single doc)
- Standard Pages (About, Contact, Privacy, Terms)
- Fields: title, slug, hero (optional), sections[], SEO overrides

### Services

- Index page + service detail pages
- Fields: title, slug, summary, icon (optional), body/sections, featured flag

### Work / Case Studies

- Fields: title, slug, client (optional), summary, industries[], servicesUsed[],
  heroImage, body/sections, featured flag

### News/Blog (Optional)

- Fields: title, slug, date, summary, tags[], body, SEO overrides

**Rule**: All collections MUST include a stable slug and support
draft/unpublished content (via branch/PR workflow or explicit draft field).

## Page Composition Rules

Pages are built from approved section types (examples):

- Hero
- Feature list
- Logos/clients strip
- Testimonials
- Two-column content
- CTA banner
- FAQ
- Gallery
- Stats

**Constraints**:

- Sections expose only safe, intentional controls (text, images, ordering)
- No custom HTML injection by default
- Rich text is allowed only where necessary and MUST be sanitized/limited

## URL & SEO Rules

- URLs are lowercase, kebab-case, and stable
- Canonical URLs set to the primary domain
- Every page MUST have:
  - meta title + meta description (defaultable)
  - Open Graph image (defaultable)
- Generate: sitemap.xml and robots.txt
- 301 redirect strategy documented for slug changes

## Asset & Media Rules

- Images MUST include alt text or be explicitly marked decorative
- All images are optimized at build time (resize/compress) and served
  responsively where possible
- Keep original uploads in repo only if size is reasonable; otherwise use a
  compatible media strategy (documented)

## Repository Structure (Expected)

- `src/` — 11ty templates/layouts/components
- `content/` — Markdown/JSON/YAML content collections
- `public/` (or `assets/`) — static assets copied as-is
- `tina/` (or `.tina/`) — Tina schema/config
- `docs/` — runbooks (editor + developer)
- `_site/` — build output (not committed)

## Branching, Reviews, and Publishing

**Default branches**: main (production), feature branches for changes

**Content changes** go through PRs (or a controlled direct-commit workflow only
if required).

**Review requirements**:

- Content-only PR: 1 reviewer (content lead or dev)
- Template/schema changes: 1 dev reviewer minimum
- Global settings/nav changes: 1 reviewer who owns brand + 1 dev (if possible)

## Environments & Deployments

- **PR Preview**: built from PR branch; shareable preview URL
- **Production**: built from main
- **Optional Staging**: built from staging branch if needed

## Definition of Done (DoD)

### Content DoD

- No placeholder copy
- SEO present (or sensible default inherited)
- Images have alt/decorative set
- Internal links validated

### Accessibility DoD

- Keyboard navigable menus and focus states
- Correct heading order
- Form fields have labels and errors are readable

### Performance DoD

- No unnecessary client-side frameworks
- Avoid shipping large JS bundles
- Images optimized and lazy-loaded where appropriate

### Security DoD

- No secrets in repository
- Form endpoints validate + rate limit
- CMS auth restricted to approved users/org
- Dependabot (or equivalent) enabled for deps

## Change Management

**Content model changes** require:

- migration plan (existing content)
- backwards compatibility where feasible

**Template changes** MUST be previewed with representative content.

**Breaking changes** require a release note in `docs/CHANGELOG.md`.

## Documentation Requirements

MUST include:

- `docs/editor-guide.md` — how to edit each collection + do/don't
- `docs/dev-setup.md` — local setup, commands, env vars
- `docs/deploy.md` — preview/prod deploy process and rollback
- `docs/content-model.md` — schema reference + section catalog

## Ownership

- **Code Owner**: Web platform/dev team
- **Content Owner**: Marketing/Comms (or designated editor group)
- **Release Owner**: Developer on duty (or designated maintainer)

## Governance

This constitution supersedes all other practices and decisions. All PRs and
reviews MUST verify compliance with these principles and rules.

**Amendment Procedure**:

- Amendments require documentation of rationale and impact
- Version increments follow semantic versioning:
  - **MAJOR**: Backward incompatible governance/principle removals or
    redefinitions
  - **MINOR**: New principle/section added or materially expanded guidance
  - **PATCH**: Clarifications, wording, typo fixes, non-semantic refinements
- Breaking changes require migration plan and release notes
- All amendments must be reflected in dependent templates and documentation

**Compliance Review**:

- Constitution Check gates in implementation plans must verify alignment
- Template/schema changes require explicit constitution compliance review
- Performance, accessibility, and security DoD must be validated before merge

**Version**: 1.0.0 | **Ratified**: 2026-01-26 | **Last Amended**: 2026-01-26
