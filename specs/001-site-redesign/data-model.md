# Data Model: Site Redesign with Warm Material Design

**Date**: 2026-01-26  
**Feature**: Site Redesign with Warm Material Design  
**Phase**: Phase 1 - Design

## Entities

### Color Palette

Represents the warm color scheme system used throughout the site.

**Attributes**:
- `primary` (string, required): Primary warm color (e.g., "#ff6b35" - warm orange)
- `secondary` (string, required): Secondary warm color (e.g., "#ffc107" - warm yellow)
- `accent` (string, required): Accent color (e.g., "#e57373" - soft red)
- `surface` (string, required): Surface/background color (e.g., "#fff8f5" - warm white)
- `surfaceVariant` (string, optional): Alternate surface color (e.g., "#f5ebe0" - warm beige)
- `textPrimary` (string, required): Primary text color (e.g., "#3e2723" - warm dark brown)
- `textSecondary` (string, required): Secondary text color (e.g., "#6d4c41" - warm medium brown)
- `textMuted` (string, optional): Muted text color (e.g., "#8d6e63" - warm gray)
- `link` (string, required): Link color (e.g., "#f7931e" - warm orange)
- `linkHover` (string, required): Link hover color (e.g., "#ff6b35" - brighter orange)
- `border` (string, optional): Border color (e.g., "#d7ccc8" - warm light gray)

**Relationships**:
- Used by: All CSS components, Material Design elements
- Stored in: CSS custom properties (CSS variables)

**Validation Rules**:
- All colors must be valid hex codes
- Color combinations must meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Primary, secondary, and accent colors should be warm tones (oranges, yellows, warm grays, soft reds)

**State Transitions**: N/A (static configuration)

**Example** (CSS custom properties):
```css
:root {
  --color-primary: #ff6b35;
  --color-secondary: #ffc107;
  --color-accent: #e57373;
  --color-surface: #fff8f5;
  --color-text-primary: #3e2723;
  --color-text-secondary: #6d4c41;
  --color-link: #f7931e;
  --color-link-hover: #ff6b35;
}
```

### Parallax Configuration

Represents settings for parallax scrolling effects.

**Attributes**:
- `enabled` (boolean, required): Whether parallax is enabled (default: true)
- `speedRatio` (number, required): Speed ratio for background elements (e.g., 0.5 means background moves at half scroll speed)
- `elements` (array, required): Array of element selectors with parallax configuration
  - Each element: `selector` (string), `speed` (number), `offset` (number, optional)
- `performanceThreshold` (number, optional): FPS threshold below which parallax disables (default: 30)
- `respectReducedMotion` (boolean, required): Whether to respect prefers-reduced-motion (default: true)
- `mobileEnabled` (boolean, optional): Whether to enable parallax on mobile (default: false)

**Relationships**:
- Applied to: HTML elements via JavaScript
- Configured in: JavaScript configuration object

**Validation Rules**:
- Speed ratios should be between 0 and 1 (0 = no movement, 1 = same as scroll)
- Performance threshold should be reasonable (20-30 fps minimum)
- Element selectors must be valid CSS selectors

**State Transitions**: N/A (static configuration)

**Example** (JavaScript configuration):
```javascript
const parallaxConfig = {
  enabled: true,
  speedRatio: 0.5,
  elements: [
    { selector: '.parallax-bg', speed: 0.3 },
    { selector: '.parallax-mid', speed: 0.6 },
    { selector: '.parallax-fg', speed: 0.9 }
  ],
  performanceThreshold: 30,
  respectReducedMotion: true,
  mobileEnabled: false
};
```

### Material Design Elevation

Represents elevation levels for Material Design 3 components.

**Attributes**:
- `level` (number, required): Elevation level (0-5, per Material Design 3)
- `shadow` (string, required): CSS box-shadow value for this elevation
- `useCase` (string, optional): Typical use case (e.g., "card", "button", "modal")

**Relationships**:
- Applied to: CSS classes for components
- Defined in: CSS custom properties or utility classes

**Validation Rules**:
- Elevation levels must be 0-5 (Material Design 3 specification)
- Shadow values must be valid CSS box-shadow syntax
- Higher levels indicate more elevation (closer to user)

**State Transitions**: N/A (static configuration)

**Example** (CSS):
```css
:root {
  --elevation-0: none;
  --elevation-1: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 1px 3px 1px rgba(0,0,0,0.15);
  --elevation-2: 0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15);
  --elevation-3: 0px 1px 3px 0px rgba(0,0,0,0.3), 0px 4px 8px 3px rgba(0,0,0,0.15);
  /* ... elevation 4, 5 ... */
}
```

### Content Tone Guidelines

Represents guidelines for writing style and tone.

**Attributes**:
- `targetReadability` (string, required): Target readability level (e.g., "8th grade" or "Flesch-Kincaid score")
- `avoidTerms` (array, optional): List of technical terms to avoid or explain
- `preferredTerms` (array, optional): List of preferred plain language alternatives
- `tone` (string, required): Tone description (e.g., "friendly but professional")
- `voice` (string, required): Voice description (e.g., "conversational, approachable")
- `examples` (array, optional): Example phrases or sentences demonstrating tone

**Relationships**:
- Applied to: All site content (pages, portfolio, services)
- Documented in: Content style guide

**Validation Rules**:
- Readability target must be measurable (grade level or score)
- Tone must balance fun/engaging with professional
- Examples should demonstrate desired tone

**State Transitions**: N/A (guidelines, not data)

**Example** (Style guide):
```markdown
# Content Tone Guidelines

**Target Readability**: 8th grade level or below
**Tone**: Friendly but professional
**Voice**: Conversational, approachable

**Avoid**: "Leverage our infrastructure solutions"
**Prefer**: "Use our technology to help your business run smoothly"

**Avoid**: "Implement cloud migration"
**Prefer**: "Move your files and systems to the cloud"
```

## Data Sources

### CSS Custom Properties

Color palette and design tokens stored as CSS variables in `public/css/style.css`:

```css
:root {
  /* Color palette */
  --color-primary: #ff6b35;
  --color-secondary: #ffc107;
  /* ... */
  
  /* Material Design elevation */
  --elevation-1: /* shadow value */;
  /* ... */
}
```

### JavaScript Configuration

Parallax configuration stored in JavaScript object in `public/js/parallax.js`:

```javascript
const parallaxConfig = { /* ... */ };
```

### Content Style Guide

Content tone guidelines documented in markdown file (e.g., `docs/content-style-guide.md`).

## Data Flow

1. **CSS Variables**: Loaded on page load, applied to all elements via CSS cascade
2. **Parallax Config**: JavaScript reads config, applies to elements on scroll
3. **Content Guidelines**: Content creators reference guidelines when writing/editing
4. **Material Design**: Elevation and shadows applied via CSS classes

## Relationships Diagram

```
Color Palette
    │
    └─── Used by ───> All CSS Components
         └─── Applied to ───> Material Design Elements

Parallax Configuration
    │
    └─── Applied to ───> HTML Elements (via JavaScript)

Material Design Elevation
    │
    └─── Applied to ───> Components (via CSS classes)

Content Tone Guidelines
    │
    └─── Applied to ───> All Site Content
```

## Future Considerations

- Dark mode support (warm dark palette)
- Additional parallax effects (horizontal scrolling, 3D transforms)
- Advanced Material Design components (ripple effects, more complex animations)
- Content A/B testing for tone effectiveness
- Performance monitoring and optimization
