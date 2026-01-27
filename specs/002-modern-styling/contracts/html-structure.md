# HTML Structure Contract: Modern Minimal Professional Styling

**Date**: 2026-01-26  
**Feature**: Modern Minimal Professional Styling  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contract" for semantic HTML structure. It specifies how HTML elements should be used to ensure accessibility, SEO, and maintainability.

## Semantic Element Requirements

### Document Structure

**Required Elements**:
- `<html lang="en">` - Document root with language attribute
- `<head>` - Document metadata
- `<body>` - Document body

### Header Section

**Element**: `<header>`

**Location**: Top of body, contains site branding and navigation

**Required Content**:
- Site name (h1 or appropriate heading)
- Tagline (optional, p element)
- Navigation (nav element)

**ARIA**: No additional ARIA required (header is implicit landmark)

**Example**:
```html
<header>
  <div class="container">
    <h1 class="site-name">{{ site.siteName }}</h1>
    <nav aria-label="Main navigation">
      <!-- navigation content -->
    </nav>
  </div>
</header>
```

### Navigation Section

**Element**: `<nav>`

**Location**: Within header (main navigation) or footer (footer navigation)

**Required Attributes**:
- `aria-label`: Descriptive label for screen readers (e.g., "Main navigation")

**Required Structure**:
- `<ul>` for navigation list
- `<li>` for each navigation item
- `<a>` for navigation links

**Accessibility**:
- Keyboard navigable
- Focus indicators visible
- Active state clearly indicated

**Example**:
```html
<nav aria-label="Main navigation">
  <ul class="nav-list">
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

### Main Content Section

**Element**: `<main>`

**Location**: After header, before footer

**Required Content**:
- Page-specific content
- Only one `<main>` per page

**ARIA**: No additional ARIA required (main is implicit landmark)

**Example**:
```html
<main>
  <div class="container">
    <h1>{{ title }}</h1>
    {{ content | safe }}
  </div>
</main>
```

### Content Sections

**Element**: `<section>` (optional, for major content divisions)

**Location**: Within `<main>`

**Usage**: Group related content within a page

**Rules**:
- Should have a heading (h2, h3, etc.)
- Use when content has distinct purpose
- Don't overuse (not every div needs to be a section)

**Example**:
```html
<section>
  <h2>Our Services</h2>
  <p>Content about services...</p>
</section>
```

### Footer Section

**Element**: `<footer>`

**Location**: Bottom of body, after main content

**Required Content**:
- Copyright information
- Optional: Additional links, contact info

**ARIA**: No additional ARIA required (footer is implicit landmark)

**Example**:
```html
<footer>
  <div class="container">
    <p>&copy; {{ year }} {{ site.siteName }}. All rights reserved.</p>
  </div>
</footer>
```

## Heading Hierarchy

### Rules

1. **One H1 per page**: Page title or main heading
2. **Sequential hierarchy**: Don't skip levels (h1 → h2 → h3, not h1 → h3)
3. **Semantic meaning**: Headings describe content structure, not visual appearance
4. **Proper nesting**: Subheadings must be within appropriate parent sections

### Structure Example

```html
<main>
  <h1>Page Title</h1>
  <section>
    <h2>Section Title</h2>
    <h3>Subsection Title</h3>
  </section>
  <section>
    <h2>Another Section</h2>
  </section>
</main>
```

## Meta Tags and Accessibility

### Required Meta Tags

**Location**: `<head>` section

**Required**:
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>` - Page title
- `<meta name="description">` - Page description

**Example**:
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% if title %}{{ title }} - {% endif %}{{ site.siteName }}</title>
  <meta name="description" content="{{ description }}">
</head>
```

### Accessibility Attributes

**ARIA Labels**: Use when semantic HTML isn't sufficient
- Navigation: `aria-label="Main navigation"`
- Skip links: `aria-label="Skip to main content"` (if implemented)

**ARIA Roles**: Only use when necessary (semantic HTML usually sufficient)

**Focus Management**: 
- All interactive elements must be keyboard accessible
- Focus indicators must be visible
- Tab order should be logical

## Validation Rules

1. **Semantic Elements**: Use appropriate semantic elements (header, nav, main, footer, section)
2. **Heading Hierarchy**: Sequential, one h1 per page
3. **ARIA**: Use only when semantic HTML isn't sufficient
4. **Accessibility**: All interactive elements keyboard accessible
5. **Meta Tags**: Required meta tags present
6. **Language**: HTML lang attribute set correctly

## Template Structure Contract

### Base Template (base.njk)

**Required Structure**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- meta tags -->
  <!-- title -->
  <!-- stylesheet link -->
</head>
<body>
  <header>
    <!-- site name, navigation -->
  </header>
  <main>
    <!-- page content -->
  </main>
  <footer>
    <!-- footer content -->
  </footer>
</body>
</html>
```

## Future Enhancements

- Skip links for keyboard navigation
- Landmark regions if page structure becomes complex
- Schema.org markup for SEO (defer to SEO enhancement)
- Microdata if structured data needed
