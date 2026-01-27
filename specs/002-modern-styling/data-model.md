# Data Model: Modern Minimal Professional Styling

**Date**: 2026-01-26  
**Feature**: Modern Minimal Professional Styling  
**Phase**: Phase 1 - Design

## Entities

### Design Token

Represents a reusable design value (color, spacing, typography) that ensures consistency across the design system.

**Attributes**:
- `name` (string, required): Token identifier (e.g., "color-primary", "spacing-md")
- `value` (string/number, required): Actual CSS value (e.g., "#1e3a5f", "1.5rem")
- `category` (string, required): Token category (color, spacing, typography, shadow, etc.)
- `description` (string, optional): Human-readable description of token purpose

**Relationships**:
- Referenced by: CSS rules, HTML classes

**Validation Rules**:
- Name must follow naming convention (kebab-case, descriptive)
- Color values must meet WCAG AA contrast when used for text
- Spacing values must align with 8px base unit system

**State Transitions**: N/A (static design tokens)

**Example** (CSS Custom Properties):
```css
:root {
  --color-primary: #1e3a5f;
  --color-secondary: #2563eb;
  --spacing-sm: 0.5rem;  /* 8px */
  --spacing-md: 1rem;    /* 16px */
  --spacing-lg: 2rem;    /* 32px */
}
```

### CSS Rule Set

Represents a collection of CSS rules organized by component or section.

**Attributes**:
- `selector` (string, required): CSS selector (e.g., ".header", ".nav-list")
- `properties` (object, required): CSS properties and values
- `organization` (string, required): Section/category (variables, base, layout, components, utilities)
- `specificity` (number, required): CSS specificity score (lower is better for maintainability)

**Relationships**:
- Uses: Design Tokens (via CSS variables)
- Applies to: HTML elements via selectors

**Validation Rules**:
- Selector specificity should be minimized (avoid overly specific selectors)
- Properties should use design tokens where applicable
- Organization should follow established architecture

**State Transitions**: N/A (static CSS)

**Example**:
```css
/* Component: Navigation */
.nav-list {
  display: flex;
  gap: var(--spacing-md);
  list-style: none;
}
```

### Semantic HTML Element

Represents an HTML element that conveys meaning about content structure.

**Attributes**:
- `element` (string, required): HTML tag name (header, nav, main, section, article, footer)
- `purpose` (string, required): Semantic purpose (navigation, main content, section grouping)
- `ariaLabel` (string, optional): ARIA label for accessibility
- `role` (string, optional): ARIA role if needed
- `hierarchy` (number, optional): Heading level (1-6) if applicable

**Relationships**:
- Contains: Other semantic elements (nested structure)
- Styled by: CSS Rule Sets

**Validation Rules**:
- Element must be used appropriately for its semantic purpose
- Heading hierarchy must be sequential (no skipping levels)
- ARIA attributes should only be used when necessary

**State Transitions**: N/A (static markup)

**Example**:
```html
<header>
  <nav aria-label="Main navigation">
    <ul class="nav-list">
      <!-- navigation items -->
    </ul>
  </nav>
</header>
```

## Data Sources

### CSS File Structure

Design tokens and rules are stored in `public/css/style.css`:

**Organization**:
1. CSS Variables (Design Tokens)
2. Reset/Normalize
3. Base Styles (Typography, Body)
4. Layout (Container, Grid)
5. Components (Header, Navigation, Footer, etc.)
6. Utilities (if needed)
7. Responsive (Media Queries)

### HTML Template Structure

Semantic elements are defined in `src/_includes/layouts/base.njk`:

**Structure**:
- `<header>` - Site header with site name and navigation
- `<nav>` - Main navigation
- `<main>` - Primary page content
- `<section>` - Content sections (if needed within pages)
- `<footer>` - Site footer

## Data Flow

1. **Design Tokens** defined as CSS custom properties in `:root`
2. **CSS Rules** reference tokens via `var()` function
3. **HTML Templates** use semantic elements with appropriate classes
4. **Browser** applies CSS rules to HTML elements
5. **Result**: Styled, accessible, professional website

## Relationships Diagram

```
Design Tokens (CSS Variables)
    │
    └─── Referenced by ───> CSS Rule Sets
                                │
                                └─── Applied to ───> Semantic HTML Elements
```

## Future Considerations

For design system expansion:
- Additional design tokens (shadows, borders, animations)
- Component library documentation
- Theme variations (if dark mode is added)
- Design token export for other tools (if needed)
