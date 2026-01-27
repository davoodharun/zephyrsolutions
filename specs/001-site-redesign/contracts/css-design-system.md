# CSS Design System Contract: Site Redesign with Warm Material Design

**Date**: 2026-01-26  
**Feature**: Site Redesign with Warm Material Design  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contract" for the CSS design system, including warm color palette, Material Design elevation, spacing, typography, and component styling patterns.

## Color System Contract

### Color Palette Structure

All colors defined as CSS custom properties in `:root`:

```css
:root {
  /* Primary Colors - Warm Oranges */
  --color-primary: #ff6b35;
  --color-primary-light: #ff8a65;
  --color-primary-dark: #e64a19;
  
  /* Secondary Colors - Warm Yellows */
  --color-secondary: #ffc107;
  --color-secondary-light: #ffd54f;
  --color-secondary-dark: #ffa000;
  
  /* Accent Colors - Soft Reds */
  --color-accent: #e57373;
  --color-accent-light: #ef9a9a;
  --color-accent-dark: #c62828;
  
  /* Surface Colors - Warm Backgrounds */
  --color-surface: #fff8f5;
  --color-surface-variant: #f5ebe0;
  --color-surface-elevated: #ffffff;
  
  /* Text Colors - Warm Grays/Browns */
  --color-text-primary: #3e2723;
  --color-text-secondary: #6d4c41;
  --color-text-muted: #8d6e63;
  --color-text-on-primary: #ffffff;
  --color-text-on-secondary: #3e2723;
  
  /* Interactive Colors */
  --color-link: #f7931e;
  --color-link-hover: #ff6b35;
  --color-link-visited: #e64a19;
  
  /* Border Colors */
  --color-border: #d7ccc8;
  --color-border-light: #efebe9;
  --color-border-dark: #bcaaa4;
}
```

### Contrast Requirements

- **Normal text** (body, paragraphs): Minimum 4.5:1 contrast ratio
- **Large text** (18pt+, 14pt+ bold): Minimum 3:1 contrast ratio
- **Interactive elements**: Minimum 3:1 contrast ratio
- All combinations validated against WCAG AA standards

## Material Design Elevation Contract

### Elevation Levels

Material Design 3 elevation system with 6 levels (0-5):

```css
:root {
  --elevation-0: none;
  --elevation-1: 0px 1px 2px 0px rgba(0,0,0,0.3), 
                 0px 1px 3px 1px rgba(0,0,0,0.15);
  --elevation-2: 0px 1px 2px 0px rgba(0,0,0,0.3), 
                 0px 2px 6px 2px rgba(0,0,0,0.15);
  --elevation-3: 0px 1px 3px 0px rgba(0,0,0,0.3), 
                 0px 4px 8px 3px rgba(0,0,0,0.15);
  --elevation-4: 0px 2px 3px 0px rgba(0,0,0,0.3), 
                 0px 6px 10px 4px rgba(0,0,0,0.15);
  --elevation-5: 0px 4px 4px 0px rgba(0,0,0,0.3), 
                 0px 8px 12px 6px rgba(0,0,0,0.15);
}
```

### Elevation Usage

- **Level 0**: Default surfaces, no elevation
- **Level 1**: Cards, buttons at rest
- **Level 2**: Cards on hover, raised buttons
- **Level 3**: Modals, dropdowns
- **Level 4**: Navigation drawers, side panels
- **Level 5**: Dialogs, popovers

## Spacing System Contract

### Spacing Scale

8px base unit system (Material Design aligned):

```css
:root {
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  --spacing-3xl: 4rem;     /* 64px */
}
```

## Typography Contract

### Font System

```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 2rem;      /* 32px */
  --font-size-4xl: 2.5rem;    /* 40px */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-base: 1.5;
  --line-height-relaxed: 1.75;
}
```

## Component Styling Patterns

### Cards

```css
.card {
  background: var(--color-surface-elevated);
  border-radius: 0.5rem;
  padding: var(--spacing-lg);
  box-shadow: var(--elevation-1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.card:hover {
  box-shadow: var(--elevation-2);
  transform: translateY(-2px);
}
```

### Buttons

```css
.button {
  background: var(--color-primary);
  color: var(--color-text-on-primary);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: 0.25rem;
  box-shadow: var(--elevation-1);
  transition: all 0.2s ease;
}

.button:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--elevation-2);
}

.button:active {
  box-shadow: var(--elevation-0);
  transform: translateY(1px);
}
```

### Full-Page Sections

```css
.section {
  min-height: 100vh;
  padding: var(--spacing-3xl) var(--spacing-lg);
  position: relative;
  overflow: hidden;
}
```

## Responsive Design Contract

### Breakpoints

```css
:root {
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}
```

### Mobile-First Approach

- Base styles target mobile (320px+)
- Media queries enhance for larger screens
- Parallax effects disabled on mobile by default
- Touch-friendly interactive elements (min 44x44px)

## Accessibility Contract

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .parallax-element {
    transform: none !important;
  }
}
```

### Focus States

All interactive elements must have visible focus indicators:

```css
.button:focus-visible,
.link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

## Performance Contract

### Optimization Rules

- CSS custom properties for theme switching
- Hardware-accelerated transforms (translateY, scale)
- Will-change property used sparingly and removed after animation
- Critical CSS inlined, non-critical loaded asynchronously
- CSS minified in production

## Future Enhancements

- Dark mode color variants
- Additional elevation levels if needed
- Custom animation timing functions
- Advanced Material Design components (ripple, fab)
