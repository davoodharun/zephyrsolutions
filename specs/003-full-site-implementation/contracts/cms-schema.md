# CMS Schema Contract: Full Site Implementation with CMS Integration

**Date**: 2026-01-26  
**Feature**: Full Site Implementation with CMS Integration  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contract" for TinaCMS schema configuration. It specifies the content model, field types, validation rules, and editing interface structure that enables non-developer content management.

## Schema Structure

### Global Settings Collection

**Collection Name**: `global`

**Fields**:
- `siteName` (text, required): Site name "Zephyr Solutions"
- `primaryDomain` (text, optional): Production domain URL
- `defaultSEO` (group):
  - `title` (text): Default title template
  - `description` (textarea): Default meta description
  - `ogImage` (image): Default Open Graph image
- `navigation` (object):
  - `header` (list): Array of navigation items
    - Each item: `label` (text), `url` (text), `order` (number)
  - `footer` (object, optional): Footer navigation structure
- `social` (object, optional):
  - `linkedin` (text, optional)
  - `github` (text, optional)
  - `twitter` (text, optional)
- `contact` (object, optional):
  - `email` (text)
  - `phone` (text)
  - `address` (textarea)
  - `mapLink` (text, optional)

**File Location**: `content/global/settings.json`

**CMS Interface**: Single document editor for global settings

### Pages Collection

**Collection Name**: `pages`

**Fields**:
- `title` (text, required): Page title
- `slug` (text, required): URL slug (auto-generated from title, editable)
- `description` (textarea, optional): Meta description
- `hero` (object, optional): Hero section
  - `title` (text)
  - `subtitle` (text, optional)
  - `image` (image, optional)
  - `ctaButton` (object, optional): CTA button config
- `sections` (list): Array of section objects
  - Each section: `type` (select), `config` (object based on type)
- `seo` (object, optional): SEO overrides
  - `title` (text, optional)
  - `description` (textarea, optional)
  - `ogImage` (image, optional)
- `draft` (toggle, optional): Draft flag

**File Location**: `content/pages/*.md`

**CMS Interface**: List view with individual page editors

### Portfolio Collection

**Collection Name**: `portfolio`

**Fields**:
- `title` (text, required): Case study title
- `slug` (text, required): URL slug (auto-generated, editable)
- `client` (text, optional): Client name
- `summary` (textarea, required): Brief summary for listings
- `heroImage` (image, required): Featured/hero image with alt text
- `industries` (list, optional): Array of industry tags (text)
- `servicesUsed` (list, optional): Array of service tags (text)
- `featured` (toggle, optional): Featured flag
- `body` (rich-text or markdown, required): Detailed content
- `sections` (list, optional): Additional content sections
- `date` (datetime, optional): Project date
- `draft` (toggle, optional): Draft flag

**File Location**: `content/portfolio/*.md`

**CMS Interface**: List view with filtering, individual case study editors

### Services Collection

**Collection Name**: `services`

**Fields**:
- `title` (text, required): Service name
- `slug` (text, required): URL slug
- `summary` (textarea, required): Service summary
- `icon` (image, optional): Service icon/image
- `body` (rich-text or markdown, required): Detailed service description
- `sections` (list, optional): Additional content sections
- `featured` (toggle, optional): Featured flag
- `draft` (toggle, optional): Draft flag

**File Location**: `content/services/*.md`

**CMS Interface**: List view, individual service editors

## Section Type Schemas

### Hero Section

**Type**: `hero`

**Config Fields**:
- `title` (text, required): Hero title
- `subtitle` (text, optional): Hero subtitle
- `image` (image, optional): Hero background/image
- `ctaButton` (object, optional):
  - `text` (text): Button label
  - `link` (text): Button URL

### Feature List Section

**Type**: `feature-list`

**Config Fields**:
- `title` (text, optional): Section title
- `items` (list, required): Array of feature items
  - Each item: `title` (text), `description` (textarea), `icon` (image, optional)
- `layout` (select, optional): Layout option (grid, list)

### Testimonials Section

**Type**: `testimonials`

**Config Fields**:
- `title` (text, optional): Section title
- `testimonials` (list, required): Array of testimonials
  - Each testimonial: `quote` (textarea), `author` (text), `role` (text, optional), `company` (text, optional)

### Two-Column Section

**Type**: `two-column`

**Config Fields**:
- `leftContent` (rich-text or markdown, required): Left column content
- `rightContent` (rich-text or markdown, required): Right column content
- `layout` (select, optional): Layout option (50/50, 60/40, etc.)

### CTA Banner Section

**Type**: `cta`

**Config Fields**:
- `text` (textarea, required): CTA text
- `buttonText` (text, required): Button label
- `buttonLink` (text, required): Button URL
- `style` (select, optional): Style variant (primary, secondary)

### FAQ Section

**Type**: `faq`

**Config Fields**:
- `title` (text, optional): Section title
- `questions` (list, required): Array of FAQ items
  - Each item: `question` (text), `answer` (textarea)

### Gallery Section

**Type**: `gallery`

**Config Fields**:
- `title` (text, optional): Section title
- `images` (list, required): Array of images
  - Each image: `image` (image with alt text), `caption` (text, optional)
- `layout` (select, optional): Layout (grid, masonry, carousel)

### Stats Section

**Type**: `stats`

**Config Fields**:
- `title` (text, optional): Section title
- `stats` (list, required): Array of stat items
  - Each stat: `value` (text), `label` (text), `description` (text, optional)

## Image Field Requirements

All image fields MUST include:
- **Image upload**: File picker or drag-and-drop
- **Alt text field**: Required (unless decorative flag)
- **Decorative toggle**: Option to mark image as decorative
- **Preview**: Thumbnail preview in CMS
- **File validation**: Format (JPEG, PNG, WebP, SVG), size limits

## Validation Rules

1. **Slugs**: Must be unique within collection, lowercase, kebab-case
2. **Required Fields**: Must be filled before saving
3. **Image Alt Text**: Required unless decorative flag is set
4. **URLs**: Must be valid URL format
5. **Section Types**: Must be from approved list
6. **Section Config**: Must match section type requirements

## CMS Interface Requirements

1. **List Views**: Show collection items with title, status, last modified
2. **Filtering**: Support filtering by featured, draft status, tags
3. **Search**: Basic search across collections
4. **Preview**: Preview changes before committing
5. **Git Integration**: Automatic commits with descriptive messages
6. **Authentication**: Restricted to approved users/organization

## Future Enhancements

- Advanced filtering and search
- Bulk operations
- Content relationships/links
- Media library organization
- Content scheduling (draft/publish dates)
