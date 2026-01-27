# CSS Architecture Contract: Modern Minimal Professional Styling

**Date**: 2026-01-26  
**Feature**: Modern Minimal Professional Styling  
**Phase**: Phase 1 - Design

## Overview

This document defines the "contract" for CSS organization and structure. It specifies how CSS should be organized, named, and structured to ensure maintainability and consistency.

## CSS File Organization

### Structure Order (Required)

The `public/css/style.css` file MUST follow this order:

1. **CSS Variables (Design Tokens)**
   - Location: `:root` selector at top of file
   - Contains: Colors, spacing, typography, shadows, etc.
   - Format: `--category-name: value;`

2. **Reset/Normalize**
   - Location: Universal selector and base elements
   - Purpose: Consistent cross-browser defaults

3. **Base Styles**
   - Location: Typography, body, links
   - Purpose: Foundation styles for all content

4. **Layout**
   - Location: Container, grid, spacing utilities
   - Purpose: Structural layout patterns

5. **Components**
   - Location: Header, navigation, footer, content sections
   - Purpose: Reusable component styles
   - Organization: Grouped by component

6. **Utilities** (if needed)
   - Location: Helper classes
   - Purpose: Single-purpose utility classes

7. **Responsive**
   - Location: Media queries at end
   - Purpose: Responsive adjustments
   - Organization: Mobile-first approach

## Naming Conventions

### CSS Variables (Design Tokens)

**Format**: `--category-descriptor-modifier`

**Examples**:
- `--color-primary`
- `--color-text-primary`
- `--spacing-sm`
- `--spacing-md`
- `--font-size-base`
- `--font-weight-medium`

**Rules**:
- Use kebab-case
- Be descriptive but concise
- Group by category (color, spacing, typography)

### CSS Classes (BEM-like)

**Format**: `block__element--modifier` or `block-element-modifier`

**Examples**:
- `.nav-list` (block)
- `.nav-list__item` (block__element)
- `.nav-list__item--active` (block__element--modifier)
- `.site-header` (block)
- `.site-header__title` (block__element)

**Rules**:
- Use kebab-case for simplicity
- Keep specificity low (avoid nesting more than 2 levels)
- Use descriptive names that indicate purpose

## CSS Variable Categories

### Colors

**Required Variables**:
- `--color-primary`: Primary brand color (deep blue)
- `--color-secondary`: Secondary accent color (medium blue)
- `--color-text-primary`: Primary text color (dark gray/black)
- `--color-text-secondary`: Secondary text color (medium gray)
- `--color-background`: Background color (white)
- `--color-background-alt`: Alternate background (light gray)
- `--color-border`: Border color (light gray)

**Validation**: All text/background combinations must meet WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)

### Spacing

**Required Variables**:
- `--spacing-xs`: 0.25rem (4px)
- `--spacing-sm`: 0.5rem (8px)
- `--spacing-md`: 1rem (16px)
- `--spacing-lg`: 2rem (32px)
- `--spacing-xl`: 3rem (48px)
- `--spacing-xxl`: 4rem (64px)

**Rules**: All spacing must use these variables or multiples of 8px base unit

### Typography

**Required Variables**:
- `--font-family-base`: System font stack
- `--font-size-base`: Base font size (1rem / 16px)
- `--font-size-sm`: Small text (0.875rem)
- `--font-size-lg`: Large text (1.125rem)
- `--font-size-xl`: Extra large (1.25rem)
- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--line-height-base`: 1.6
- `--line-height-heading`: 1.2

## Component Structure

### Header Component

**Selector**: `.site-header` or `header`

**Required Styles**:
- Background color (from design tokens)
- Padding (from spacing tokens)
- Typography for site name
- Border (if applicable)

**Example Structure**:
```css
.site-header {
  background-color: var(--color-background-alt);
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border);
}
```

### Navigation Component

**Selector**: `.nav-list`, `.nav-list__item`, `.nav-list__link`

**Required Styles**:
- List reset (no bullets)
- Flexbox layout
- Spacing between items
- Hover states
- Active state indicator

### Footer Component

**Selector**: `footer` or `.site-footer`

**Required Styles**:
- Background color
- Padding
- Text alignment
- Typography (smaller text)

## Responsive Breakpoints

**Required Breakpoints**:
- Mobile: Base styles (no media query)
- Tablet: `@media (min-width: 768px)`
- Desktop: `@media (min-width: 1024px)`
- Large Desktop: `@media (min-width: 1440px)`

**Rules**:
- Mobile-first approach (base styles for mobile)
- Media queries only for larger screens
- Maintain minimal aesthetic at all sizes

## Validation Rules

1. **No Inline Styles**: All styles must be in external CSS file
2. **Design Token Usage**: Colors, spacing, typography must use CSS variables
3. **Specificity**: Avoid selectors with specificity > 0,1,0 (prefer classes over IDs)
4. **Organization**: Follow required structure order
5. **Naming**: Follow BEM-like naming conventions
6. **Accessibility**: All interactive elements must have focus states
7. **Contrast**: All text must meet WCAG AA contrast requirements

## Future Enhancements

- CSS preprocessor (Sass/PostCSS) if complexity grows
- Component-specific CSS files if file becomes too large
- Design token documentation generation
- CSS linting rules enforcement
