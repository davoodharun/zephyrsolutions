# Template Contracts: Basic Website Scaffolding and Proof of Concept

**Date**: 2026-01-26  
**Feature**: Basic Website Scaffolding and Proof of Concept  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contracts" between templates, layouts, and data in the Eleventy static site. Unlike API contracts, these define the data structure expectations for template rendering.

## Layout Contracts

### base.njk

**Location**: `src/_includes/layouts/base.njk`

**Purpose**: Base layout template that wraps all page content.

**Expected Data** (from page frontmatter + global data):
- `title` (string): Page title
- `description` (string, optional): Page meta description
- `site` (object): Site configuration from `_data/site.json`
  - `siteName` (string): "Zephyr Solutions"
  - `tagline` (string, optional)
  - `defaultDescription` (string, optional)
- `navigation` (object): Navigation data from `_data/navigation.json`
  - `header` (array): Array of navigation items
    - Each item: `{ label: string, url: string, order: number }`
- `content` (string): Rendered Markdown content from page body

**Provides**:
- HTML document structure (`<html>`, `<head>`, `<body>`)
- `<head>` section with:
  - `<title>` tag (page title + site name)
  - `<meta name="description">` tag
- Header with site name and navigation
- Main content area where page content is rendered
- Footer (basic structure)

**Usage**:
```njk
---
layout: base
title: About Us
---
Page content here...
```

## Page Template Contracts

### index.njk (Home Page)

**Location**: `content/pages/index.md` or `src/pages/index.njk`

**Expected Data**:
- All base layout data
- Page-specific content in Markdown

**Renders**: Home page with welcome content, company overview

### about.njk (About Page)

**Location**: `content/pages/about.md`

**Expected Data**:
- All base layout data
- Page-specific content about the company

**Renders**: About page with company information

### services.njk (Services Page)

**Location**: `content/pages/services.md`

**Expected Data**:
- All base layout data
- Page-specific content about services
- Focus on smaller organizations and non-profits (per spec)

**Renders**: Services page with IT consulting service information

### contact.njk (Contact Page)

**Location**: `content/pages/contact.md`

**Expected Data**:
- All base layout data
- Page-specific contact information

**Renders**: Contact page with contact details

## Component Contracts

### Navigation Component

**Location**: `src/_includes/components/navigation.njk` (if extracted)

**Expected Data**:
- `navigation.header` (array): Array of navigation items
- `page.url` (string): Current page URL for active state detection

**Provides**:
- Rendered navigation menu (`<nav>` element)
- Active state highlighting for current page
- Accessible navigation structure

**Usage**:
```njk
{% include "components/navigation.njk" %}
```

## Data File Contracts

### _data/site.json

**Structure**:
```json
{
  "siteName": "Zephyr Solutions",
  "tagline": "string (optional)",
  "defaultDescription": "string (optional)",
  "baseUrl": "string (optional)"
}
```

**Available As**: `site` in all templates

### _data/navigation.json

**Structure**:
```json
{
  "header": [
    {
      "label": "string (required)",
      "url": "string (required, starts with /)",
      "order": "number (required)"
    }
  ]
}
```

**Available As**: `navigation` in all templates

## Content File Contracts

### content/pages/*.md

**Structure** (frontmatter + content):
```yaml
---
title: string (required)
slug: string (required, matches filename)
description: string (optional)
layout: string (required, default: "base")
navOrder: number (optional)
---
Markdown content here...
```

**Available As**: Page data in template context

## Validation Rules

1. **Page Slug**: Must match filename (e.g., `about.md` → slug: "about")
2. **Navigation URLs**: Must start with "/" and match page slugs or "/"
3. **Required Fields**: `title`, `slug`, `layout` must be present in page frontmatter
4. **Site Name**: Must be "Zephyr Solutions" in site.json
5. **Navigation Order**: Must be unique within header array

## Error Handling

- **Missing Layout**: Eleventy will error if layout specified in frontmatter doesn't exist
- **Missing Data**: Template variables will be undefined if data file is missing (handle with default values)
- **Invalid Navigation URL**: Link will be broken; validate in template or during build

## Future Enhancements (Post-POC)

- TinaCMS schema will enforce these contracts at edit time
- Validation can be added to build process
- TypeScript types could be generated for type safety
