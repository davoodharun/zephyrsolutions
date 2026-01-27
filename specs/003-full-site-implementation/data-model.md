# Data Model: Full Site Implementation with CMS Integration

**Date**: 2026-01-26  
**Feature**: Full Site Implementation with CMS Integration  
**Phase**: Phase 1 - Design

## Entities

### Portfolio Item / Case Study

Represents a work example, project, or case study showcasing Zephyr Solutions' capabilities.

**Attributes**:
- `title` (string, required): Case study title
- `slug` (string, required): URL-friendly identifier (kebab-case, unique)
- `client` (string, optional): Client name (if permitted to disclose)
- `summary` (string, required): Brief description for listings
- `heroImage` (string, required): Path to hero/featured image
- `industries` (array of strings, optional): Industry tags (e.g., ["non-profit", "healthcare", "education"])
- `servicesUsed` (array of strings, optional): Services applied (e.g., ["IT Strategy", "System Integration"])
- `featured` (boolean, optional): Featured flag for homepage/priority display
- `body` (markdown, required): Detailed case study content
- `sections` (array of section objects, optional): Additional content sections
- `date` (date, optional): Project completion or publication date
- `draft` (boolean, optional): Draft/unpublished flag

**Relationships**:
- Contains: Image Assets (via heroImage and body images)
- Uses: Content Sections (via sections array)
- Belongs to: Site (via site configuration)

**Validation Rules**:
- Slug must be unique across all portfolio items
- Slug must be lowercase, kebab-case
- Hero image must exist and have alt text
- Industries and servicesUsed must use predefined values (if taxonomy enforced)
- Featured items should be limited (e.g., max 3-5)

**State Transitions**:
- Draft → Published (via draft flag or branch workflow)
- Published → Archived (optional, via featured flag or removal)

**Example** (Markdown frontmatter):
```yaml
---
title: "Non-Profit Organization IT Modernization"
slug: "nonprofit-it-modernization"
client: "Community Health Alliance"
summary: "Helped a mid-size non-profit modernize their IT infrastructure and improve operational efficiency."
heroImage: "/images/portfolio/nonprofit-modernization-hero.jpg"
industries: ["non-profit", "healthcare"]
servicesUsed: ["IT Strategy", "System Integration", "Technical Support"]
featured: true
date: 2025-06-15
draft: false
---
Case study content in Markdown...
```

### Image Asset

Represents an uploaded or referenced image file used throughout the site.

**Attributes**:
- `filename` (string, required): Image file name
- `path` (string, required): Relative path from public/ or content/
- `altText` (string, required): Alt text for accessibility (empty string if decorative)
- `isDecorative` (boolean, optional): Flag indicating decorative image (no alt text needed)
- `width` (number, optional): Original image width in pixels
- `height` (number, optional): Original image height in pixels
- `optimized` (boolean, optional): Flag indicating optimization status
- `category` (string, optional): Image category (portfolio, service, general, hero)

**Relationships**:
- Referenced by: Portfolio Items, Pages, Content Sections
- Stored in: Repository (public/images/ or content/images/)

**Validation Rules**:
- Alt text required unless isDecorative is true
- Path must be valid relative path
- File must exist in repository
- Supported formats: JPEG, PNG, WebP, SVG

**State Transitions**: N/A (static assets)

**Example**:
```json
{
  "filename": "portfolio-hero-01.jpg",
  "path": "/images/portfolio/portfolio-hero-01.jpg",
  "altText": "Dashboard showing improved system performance metrics",
  "isDecorative": false,
  "width": 1920,
  "height": 1080,
  "category": "portfolio"
}
```

### Content Section

Represents a reusable page section component that editors can assemble into pages.

**Attributes**:
- `type` (string, required): Section type (hero, feature-list, testimonials, two-column, cta, faq, gallery, stats)
- `config` (object, required): Section-specific configuration
  - Hero: title, subtitle, image, ctaButton (optional)
  - Feature List: items[], title, layout
  - Testimonials: testimonials[], title
  - Two-column: leftContent, rightContent, layout
  - CTA: text, buttonText, buttonLink, style
  - FAQ: questions[], title
  - Gallery: images[], title, layout
  - Stats: stats[], title
- `order` (number, optional): Display order within page

**Relationships**:
- Used by: Pages (via sections array)
- Contains: Image Assets (via section configs)

**Validation Rules**:
- Type must be from approved list
- Config must match section type requirements
- Images referenced must exist and have alt text

**State Transitions**: N/A (static configuration)

**Example** (in page frontmatter):
```yaml
sections:
  - type: hero
    config:
      title: "Welcome to Zephyr Solutions"
      subtitle: "IT Consulting for Smaller Organizations"
      image: "/images/hero-home.jpg"
      ctaButton:
        text: "Learn More"
        link: "/about"
  - type: feature-list
    config:
      title: "Our Services"
      items:
        - title: "IT Strategy"
          description: "Strategic planning for technology"
          icon: "/images/icons/strategy.svg"
```

### CMS User

Represents an authenticated editor with permissions to edit content through TinaCMS.

**Attributes**:
- `email` (string, required): User email (authentication identifier)
- `name` (string, optional): Display name
- `role` (string, optional): User role (editor, admin)
- `permissions` (array of strings, optional): Content type permissions (pages, portfolio, services, settings)

**Relationships**:
- Authenticated via: TinaCMS authentication (GitHub, GitLab, or custom)
- Can edit: Content types based on permissions

**Validation Rules**:
- Email must be valid format
- User must be approved/whitelisted
- Permissions must align with role

**State Transitions**:
- Pending → Approved (admin approval)
- Approved → Revoked (access removal)

**Example** (TinaCMS config):
```typescript
// TinaCMS handles user authentication
// Users are typically managed through GitHub/GitLab OAuth
// or organization-based access control
```

### Global Settings

Represents site-wide configuration editable through CMS.

**Attributes**:
- `siteName` (string, required): "Zephyr Solutions"
- `primaryDomain` (string, optional): Production domain
- `defaultSEO` (object, optional): Default SEO settings
  - `title` (string): Default page title template
  - `description` (string): Default meta description
  - `ogImage` (string): Default Open Graph image
- `navigation` (object, required): Site navigation structure
  - `header` (array): Header navigation items
  - `footer` (object, optional): Footer navigation structure
- `social` (object, optional): Social media links
  - `linkedin` (string, optional)
  - `github` (string, optional)
  - `twitter` (string, optional)
- `contact` (object, optional): Contact information
  - `email` (string)
  - `phone` (string)
  - `address` (string)
  - `mapLink` (string, optional)

**Relationships**:
- Referenced by: All Pages (for consistent branding)
- Contains: Navigation Items

**Validation Rules**:
- siteName must be "Zephyr Solutions" (per spec)
- Navigation items must have valid URLs
- Social links must be valid URLs if provided

**State Transitions**: N/A (static configuration)

**Example** (from `content/global/settings.json`):
```json
{
  "siteName": "Zephyr Solutions",
  "primaryDomain": "https://zephyrsolutions.com",
  "defaultSEO": {
    "title": "{{title}} - Zephyr Solutions",
    "description": "IT Consulting for Smaller Organizations and Non-Profits",
    "ogImage": "/images/og-default.jpg"
  },
  "navigation": {
    "header": [
      { "label": "Home", "url": "/", "order": 1 },
      { "label": "About", "url": "/about", "order": 2 },
      { "label": "Services", "url": "/services", "order": 3 },
      { "label": "Work", "url": "/work", "order": 4 },
      { "label": "Contact", "url": "/contact", "order": 5 }
    ]
  },
  "social": {
    "linkedin": "https://linkedin.com/company/zephyr-solutions"
  },
  "contact": {
    "email": "info@zephyrsolutions.com",
    "phone": "+1-555-0123"
  }
}
```

## Data Sources

### File-Based Storage

All entities stored as files in repository:

- **Portfolio Items**: `content/portfolio/*.md` (Markdown with frontmatter)
- **Images**: `public/images/**/*.{jpg,png,webp,svg}` (Image files)
- **Content Sections**: Embedded in page frontmatter or separate section files
- **Global Settings**: `content/global/settings.json` (JSON)
- **Pages**: `content/pages/*.md` (Markdown with frontmatter)

### Eleventy Collections

Portfolio items automatically collected:

```javascript
eleventyConfig.addCollection("portfolio", function(collectionApi) {
  return collectionApi.getFilteredByGlob("content/portfolio/*.md")
    .filter(item => !item.data.draft);
});
```

### TinaCMS Schema

CMS schema defines editable fields and structure for all content types, stored in `tina/config.ts`.

## Data Flow

1. **Content Editor** uses TinaCMS interface to edit content
2. **TinaCMS** validates and saves changes to content files
3. **TinaCMS** commits changes to Git automatically
4. **Eleventy** reads content files during build
5. **Eleventy** processes templates and generates static HTML
6. **Build Output** includes optimized images and static site
7. **Preview/Production** serves static site

## Relationships Diagram

```
Global Settings
    │
    ├─── Contains ───> Navigation Items
    │
    └─── Referenced by ───> All Pages

Portfolio Items
    │
    ├─── Contains ───> Image Assets (heroImage)
    ├─── Uses ───> Content Sections (sections[])
    └─── Belongs to ───> Site (via collections)

Content Sections
    │
    └─── Contains ───> Image Assets (via config)

CMS Users
    │
    └─── Can Edit ───> All Content Types (based on permissions)
```

## Future Considerations

- Image CDN integration (if repository size becomes issue)
- Advanced portfolio filtering (search, tags, date ranges)
- Content versioning/history (beyond Git)
- Multi-language support (if needed)
- Advanced section types (custom components)
