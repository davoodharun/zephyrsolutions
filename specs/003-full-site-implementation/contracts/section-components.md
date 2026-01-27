# Section Component Contracts: Full Site Implementation with CMS Integration

**Date**: 2026-01-26  
**Feature**: Full Site Implementation with CMS Integration  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contracts" for section components - reusable page sections that editors can assemble in the CMS. Each section type has specific data requirements and rendering behavior.

## Section Component Structure

### Component Location

All section components located in: `src/_includes/components/sections/`

**Naming Convention**: `[section-type].njk` (e.g., `hero.njk`, `feature-list.njk`)

## Section Type Contracts

### Hero Section

**Component**: `src/_includes/components/sections/hero.njk`

**Expected Data**:
```javascript
{
  type: "hero",
  config: {
    title: "string (required)",
    subtitle: "string (optional)",
    image: "string (optional, image path)",
    ctaButton: {
      text: "string (optional)",
      link: "string (optional, URL)"
    }
  }
}
```

**Provides**:
- Large hero section with title, optional subtitle
- Optional background/hero image
- Optional call-to-action button
- Responsive layout

**Usage**:
```njk
{% include "components/sections/hero.njk", config: section.config %}
```

### Feature List Section

**Component**: `src/_includes/components/sections/feature-list.njk`

**Expected Data**:
```javascript
{
  type: "feature-list",
  config: {
    title: "string (optional)",
    items: [
      {
        title: "string (required)",
        description: "string (required)",
        icon: "string (optional, image path)"
      }
    ],
    layout: "string (optional, 'grid' or 'list')"
  }
}
```

**Provides**:
- Grid or list layout of feature items
- Each item with title, description, optional icon
- Responsive grid that adapts to screen size

### Testimonials Section

**Component**: `src/_includes/components/sections/testimonials.njk`

**Expected Data**:
```javascript
{
  type: "testimonials",
  config: {
    title: "string (optional)",
    testimonials: [
      {
        quote: "string (required)",
        author: "string (required)",
        role: "string (optional)",
        company: "string (optional)"
      }
    ]
  }
}
```

**Provides**:
- Display of customer testimonials
- Author attribution with optional role/company
- Professional testimonial styling

### Two-Column Section

**Component**: `src/_includes/components/sections/two-column.njk`

**Expected Data**:
```javascript
{
  type: "two-column",
  config: {
    leftContent: "string (required, markdown/HTML)",
    rightContent: "string (required, markdown/HTML)",
    layout: "string (optional, '50-50', '60-40', '40-60')"
  }
}
```

**Provides**:
- Two-column layout with configurable proportions
- Responsive: stacks on mobile
- Content rendered as markdown/HTML

### CTA Banner Section

**Component**: `src/_includes/components/sections/cta.njk`

**Expected Data**:
```javascript
{
  type: "cta",
  config: {
    text: "string (required)",
    buttonText: "string (required)",
    buttonLink: "string (required, URL)",
    style: "string (optional, 'primary' or 'secondary')"
  }
}
```

**Provides**:
- Call-to-action banner with text and button
- Styled button with hover states
- Optional style variants

### FAQ Section

**Component**: `src/_includes/components/sections/faq.njk`

**Expected Data**:
```javascript
{
  type: "faq",
  config: {
    title: "string (optional)",
    questions: [
      {
        question: "string (required)",
        answer: "string (required, markdown/HTML)"
      }
    ]
  }
}
```

**Provides**:
- FAQ accordion or list
- Expandable/collapsible questions (if JS enabled)
- Accessible keyboard navigation

### Gallery Section

**Component**: `src/_includes/components/sections/gallery.njk`

**Expected Data**:
```javascript
{
  type: "gallery",
  config: {
    title: "string (optional)",
    images: [
      {
        image: "string (required, image path)",
        caption: "string (optional)"
      }
    ],
    layout: "string (optional, 'grid', 'masonry', 'carousel')"
  }
```

**Provides**:
- Image gallery with responsive grid
- Optional captions
- Lightbox functionality (if JS enabled, progressive enhancement)
- Lazy loading for performance

### Stats Section

**Component**: `src/_includes/components/sections/stats.njk`

**Expected Data**:
```javascript
{
  type: "stats",
  config: {
    title: "string (optional)",
    stats: [
      {
        value: "string (required)",
        label: "string (required)",
        description: "string (optional)"
      }
    ]
  }
}
```

**Provides**:
- Statistics/metrics display
- Visual emphasis on numbers
- Optional descriptions

## Section Rendering Pattern

### Template Usage

Pages include sections via loop:

```njk
{% for section in sections %}
  {% if section.type == "hero" %}
    {% include "components/sections/hero.njk", config: section.config %}
  {% elif section.type == "feature-list" %}
    {% include "components/sections/feature-list.njk", config: section.config %}
  {% elif section.type == "testimonials" %}
    {% include "components/sections/testimonials.njk", config: section.config %}
  {# ... other section types ... #}
  {% endif %}
{% endfor %}
```

### Alternative: Dynamic Include

Use Eleventy's dynamic include pattern:

```njk
{% for section in sections %}
  {% set sectionPath = "components/sections/" + section.type + ".njk" %}
  {% include sectionPath, config: section.config %}
{% endfor %}
```

## Validation Rules

1. **Section Type**: Must be from approved list
2. **Config Structure**: Must match section type requirements
3. **Required Fields**: Must be present in config
4. **Images**: Must exist and have alt text
5. **URLs**: Must be valid format

## Styling Requirements

Each section component:
- Uses design tokens (CSS variables) for consistency
- Maintains responsive design
- Follows minimal, professional aesthetic
- Includes proper semantic HTML
- Supports accessibility (keyboard navigation, screen readers)

## Future Enhancements

- Custom section types (if needed)
- Section preview in CMS
- Section templates/presets
- Section reordering interface
- Section duplication
