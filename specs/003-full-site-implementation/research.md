# Research: Full Site Implementation with CMS Integration

**Date**: 2026-01-26  
**Feature**: Full Site Implementation with CMS Integration  
**Phase**: Phase 0 - Research

## Research Questions

### 1. TinaCMS Integration with Eleventy

**Question**: How to integrate TinaCMS with Eleventy to enable Git-backed content editing?

**Decision**: Use TinaCMS Cloud or self-hosted TinaCMS with Eleventy. Configure TinaCMS schema to match Eleventy content collections. Use TinaCMS admin interface for content editing, with changes committed to Git automatically. Integrate TinaCMS admin route in Eleventy dev server.

**Rationale**: 
- TinaCMS is specified in constitution as the CMS solution
- Git-backed workflow aligns with constitution Principle III
- Visual editing interface enables non-developer content management (Principle I)
- Eleventy + TinaCMS is a proven combination for static sites

**Alternatives Considered**:
- **Netlify CMS**: Less active development, fewer features
- **Forestry CMS**: Discontinued
- **Strapi/Headless CMS**: Requires backend, violates static site principle
- **Direct file editing**: Doesn't meet non-developer requirement

**References**:
- TinaCMS documentation: https://tina.io/docs/
- Eleventy + TinaCMS integration: https://tina.io/docs/integrations/eleventy/
- Git-backed CMS patterns: Industry best practices

### 2. Portfolio/Work Section Implementation

**Question**: How to structure portfolio case studies in Eleventy with proper collections and detail pages?

**Decision**: Create `content/portfolio/` directory with Markdown files for each case study. Use Eleventy collections for portfolio items. Create portfolio index page and individual detail pages using permalinks. Support filtering by industry, service type, and featured status through collection filtering.

**Rationale**:
- Markdown files align with Git versioning requirement
- Eleventy collections provide automatic discovery and organization
- Permalinks enable clean URLs for detail pages
- Collection filtering supports categorization without complex logic

**Alternatives Considered**:
- **JSON/YAML only**: Less readable for content authors
- **Database**: Violates Git versioning principle
- **Single portfolio page**: Doesn't support detail views
- **External portfolio service**: Adds dependency, breaks Git workflow

**References**:
- Eleventy collections: https://www.11ty.dev/docs/collections/
- Portfolio patterns: Web design industry standards

### 3. Image Management and Optimization

**Question**: How to handle image uploads, optimization, and responsive delivery in a Git-backed workflow?

**Decision**: Store images in `public/images/` organized by purpose (portfolio, services, general). Use image optimization at build time with Eleventy image plugin or sharp. Support responsive images with srcset. Implement lazy loading for performance. CMS uploads save to repository, optimized during build.

**Rationale**:
- Repository storage aligns with Git versioning
- Build-time optimization ensures performance
- Responsive images improve mobile experience
- Lazy loading reduces initial page load
- Organized structure supports maintainability

**Alternatives Considered**:
- **CDN for images**: Adds external dependency, complicates Git workflow
- **Runtime optimization**: Requires server, violates static site principle
- **No optimization**: Poor performance, large file sizes
- **External image service**: Adds cost and dependency

**References**:
- Eleventy Image plugin: https://www.11ty.dev/docs/plugins/image/
- Image optimization best practices: Web performance standards
- Responsive images: https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images

### 4. Section-Based Page Composition

**Question**: How to implement reusable section types (Hero, Feature List, etc.) that editors can assemble in CMS?

**Decision**: Create section components in `src/_includes/components/sections/`. Each section is a Nunjucks template with defined fields. TinaCMS schema defines section types with field configurations. Pages use frontmatter array of sections. Template renders sections in order.

**Rationale**:
- Component-based approach enables reusability
- CMS schema enforces structure (Principle II)
- Template system provides flexibility within constraints
- Frontmatter array is simple and Git-friendly

**Alternatives Considered**:
- **Single template per page**: Not flexible, hard to maintain
- **WYSIWYG editor**: Violates structured content principle
- **JSON configuration**: Less readable than frontmatter
- **Database-driven sections**: Violates Git versioning

**References**:
- Component patterns: Eleventy best practices
- Section-based CMS: Content management industry standards

### 5. Enhanced Styling Approach

**Question**: How to enhance styling beyond current modern minimal design while maintaining professional aesthetic?

**Decision**: Build upon existing design system (CSS variables, 8px spacing, professional colors). Add visual enhancements: improved typography scale, better image layouts, section-specific styling, enhanced spacing for content sections, subtle animations/transitions for interactivity. Maintain minimal aesthetic with strategic visual interest.

**Rationale**:
- Building on existing system ensures consistency
- Enhanced styling improves engagement without clutter
- Section-specific styles support content variety
- Subtle animations add polish without distraction

**Alternatives Considered**:
- **Complete redesign**: Too disruptive, loses existing work
- **No enhancements**: Misses opportunity for improvement
- **Heavy visual effects**: Conflicts with minimal aesthetic
- **Framework-based styling**: Adds dependency, violates minimal JS

**References**:
- Design system evolution: Industry best practices
- Minimal design enhancement: UX research

### 6. Documentation Structure and Content

**Question**: What documentation is needed and how should it be organized for editors and developers?

**Decision**: Create comprehensive documentation in `docs/` directory:
- `editor-guide.md`: Step-by-step guide for content editors using CMS
- `dev-setup.md`: Developer setup, local development, CMS access
- `deploy.md`: Deployment process, preview builds, rollback procedures
- `content-model.md`: Complete schema reference, section catalog, field descriptions

All documentation in Markdown, with screenshots/examples where helpful.

**Rationale**:
- Separate docs for different audiences (editors vs developers)
- Markdown is readable and version-controlled
- Comprehensive coverage ensures project sustainability
- Aligns with constitution documentation requirements

**Alternatives Considered**:
- **Single documentation file**: Too long, hard to navigate
- **Wiki/external docs**: Not version-controlled, harder to maintain
- **Code comments only**: Not accessible to non-developers
- **Video tutorials**: Not searchable, harder to update

**References**:
- Documentation best practices: Technical writing standards
- Project documentation patterns: Open source standards

### 7. Image Optimization Strategy

**Question**: What image formats and optimization approach to use for web performance?

**Decision**: Support modern formats (WebP with fallback to JPEG/PNG). Optimize images at build time using Eleventy Image plugin or sharp. Generate multiple sizes for responsive images (srcset). Compress images to balance quality and file size. Lazy load images below the fold.

**Rationale**:
- Modern formats improve performance
- Build-time optimization ensures consistency
- Responsive images adapt to device capabilities
- Lazy loading improves initial page load

**Alternatives Considered**:
- **Single image size**: Poor mobile performance
- **No optimization**: Large file sizes, slow loading
- **Runtime optimization**: Requires server infrastructure
- **External optimization service**: Adds dependency and cost

**References**:
- WebP format: https://developers.google.com/speed/webp
- Image optimization: Web performance best practices
- Responsive images: HTML5 standards

## Technology Choices Summary

| Technology | Choice | Rationale |
|------------|--------|-----------|
| CMS | TinaCMS (Git-backed) | Constitution requirement, Git workflow, visual editing |
| Portfolio Structure | Eleventy Collections | Git-friendly, automatic discovery, filtering support |
| Image Storage | Repository (public/images/) | Git versioning, no external dependencies |
| Image Optimization | Build-time (Eleventy Image/sharp) | Performance, static site compatible |
| Section Components | Nunjucks templates | Reusable, CMS-configurable, Git-friendly |
| Documentation | Markdown in docs/ | Version-controlled, readable, maintainable |
| Enhanced Styling | CSS enhancements | Builds on existing design system |

## Resolved Clarifications

All technical decisions have been made based on:
- Constitution requirements (TinaCMS, Git versioning, structured content)
- Feature specification requirements (portfolio, images, CMS, documentation)
- Existing site structure and constraints
- Industry best practices for static sites with CMS

No outstanding NEEDS CLARIFICATION items remain.
