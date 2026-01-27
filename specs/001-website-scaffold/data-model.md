# Data Model: Basic Website Scaffolding and Proof of Concept

**Date**: 2026-01-26  
**Feature**: Basic Website Scaffolding and Proof of Concept  
**Phase**: Phase 1 - Design

## Entities

### Page

Represents a single page of the website.

**Attributes**:
- `title` (string, required): Page title displayed in browser tab and page heading
- `slug` (string, required): URL-friendly identifier (e.g., "about", "services")
- `description` (string, optional): Meta description for SEO
- `layout` (string, required): Template layout to use (default: "base.njk")
- `content` (markdown, required): Main page content in Markdown format
- `navOrder` (number, optional): Order in navigation menu (lower numbers appear first)

**Relationships**:
- Belongs to: Site (via site configuration)
- Referenced by: Navigation Item

**Validation Rules**:
- Slug must be lowercase, kebab-case, and unique across all pages
- Title must be non-empty
- Slug must match filename pattern (e.g., `about.md` → slug: "about")

**State Transitions**: N/A (static content)

**Example**:
```yaml
---
title: About Us
slug: about
description: Learn about Zephyr Solutions and our mission
layout: base
navOrder: 2
---
# About Us

Zephyr Solutions is an IT consulting firm...
```

### Navigation Item

Represents a link in the site navigation menu.

**Attributes**:
- `label` (string, required): Display text for the navigation link
- `url` (string, required): Target URL path (e.g., "/", "/about", "/services")
- `order` (number, required): Display order in navigation (lower numbers appear first)

**Relationships**:
- References: Page (via url matching page slug)

**Validation Rules**:
- URL must start with "/"
- Label must be non-empty
- Order must be unique within navigation context (header vs footer)

**State Transitions**: N/A (static configuration)

**Example** (from `_data/navigation.json`):
```json
{
  "header": [
    { "label": "Home", "url": "/", "order": 1 },
    { "label": "About", "url": "/about", "order": 2 },
    { "label": "Services", "url": "/services", "order": 3 },
    { "label": "Contact", "url": "/contact", "order": 4 }
  ]
}
```

### Site Configuration

Represents global site settings and metadata.

**Attributes**:
- `siteName` (string, required): Site name "Zephyr Solutions"
- `tagline` (string, optional): Site tagline or description
- `defaultDescription` (string, optional): Default meta description for pages without one
- `baseUrl` (string, optional): Base URL for production (for POC, can be localhost)

**Relationships**:
- Contains: Navigation Items (via navigation data)
- Referenced by: All Pages (for consistent branding)

**Validation Rules**:
- siteName must be "Zephyr Solutions" (per spec requirement)
- baseUrl must be valid URL format if provided

**State Transitions**: N/A (static configuration)

**Example** (from `_data/site.json`):
```json
{
  "siteName": "Zephyr Solutions",
  "tagline": "IT Consulting for Smaller Organizations and Non-Profits",
  "defaultDescription": "Zephyr Solutions provides IT consulting services tailored for smaller organizations and non-profits.",
  "baseUrl": "http://localhost:8080"
}
```

## Data Sources

### File-Based Storage

All entities are stored as files in the repository:

- **Pages**: `content/pages/*.md` (Markdown files with frontmatter)
- **Navigation**: `_data/navigation.json` (JSON data file)
- **Site Config**: `_data/site.json` (JSON data file)

### Eleventy Collections

Pages are automatically collected by Eleventy based on file location and frontmatter. The `pages` collection is defined in `.eleventy.js`:

```javascript
eleventyConfig.addCollection("pages", function(collectionApi) {
  return collectionApi.getFilteredByGlob("content/pages/*.md");
});
```

## Data Flow

1. **Content Author** edits Markdown files in `content/pages/`
2. **Eleventy** reads Markdown files and frontmatter during build
3. **Eleventy** processes templates using page data + global data files
4. **Eleventy** outputs static HTML to `_site/`
5. **Development Server** serves `_site/` directory

## Relationships Diagram

```
Site Configuration
    │
    ├─── Contains ───> Navigation Items
    │                      │
    │                      └─── References ───> Pages
    │
    └─── Referenced by ───> All Pages
```

## Future Considerations

For TinaCMS integration (post-POC):
- Pages will be editable via CMS interface
- Navigation will be managed through CMS schema
- Site configuration will be editable through CMS global settings
- All changes will still be committed to Git (constitution Principle III)
