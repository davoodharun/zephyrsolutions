# Research: Site Redesign with Warm Material Design

**Date**: 2026-01-26  
**Feature**: Site Redesign with Warm Material Design  
**Phase**: Phase 0 - Research

## Research Questions

### 1. Parallax Scrolling Implementation Approach

**Question**: How to implement performant parallax scrolling that maintains 60fps while respecting accessibility preferences?

**Decision**: Use CSS transforms with JavaScript for scroll position tracking. Implement with requestAnimationFrame for smooth animations, Intersection Observer for performance optimization, and respect prefers-reduced-motion media query. Use transform: translateY() instead of changing top/left positions for better performance.

**Rationale**: 
- CSS transforms are GPU-accelerated and perform better than position changes
- requestAnimationFrame ensures smooth 60fps animations
- Intersection Observer prevents unnecessary calculations for off-screen elements
- prefers-reduced-motion ensures accessibility compliance
- Progressive enhancement: works without JavaScript, enhanced with it

**Alternatives Considered**:
- **Pure CSS parallax**: Limited control, difficult to achieve smooth multi-layer effects
- **Heavy JavaScript libraries**: Adds unnecessary bundle size, violates minimal JS principle
- **CSS-only with transform3d**: Better than pure CSS but still limited for complex parallax
- **WebGL/Canvas**: Overkill for this use case, adds complexity and bundle size

**References**:
- MDN: CSS transforms performance - https://developer.mozilla.org/en-US/docs/Web/CSS/transform
- Web.dev: Prefers-reduced-motion - https://web.dev/prefers-reduced-motion/
- CSS-Tricks: Parallax scrolling - Industry best practices

### 2. Warm Color Palette Selection

**Question**: What warm color palette provides friendly, approachable feeling while maintaining accessibility and professional credibility?

**Decision**: Use Material Design 3 warm color tokens as foundation: warm oranges (#ff6b35, #f7931e), warm yellows (#ffc107, #ffb300), warm grays (#8d6e63, #a1887f), soft reds (#e57373, #ef5350). Create color system with primary, secondary, accent, surface, and text colors. Ensure all combinations meet WCAG AA contrast ratios.

**Rationale**:
- Material Design 3 provides tested color systems that work well together
- Warm colors (oranges, yellows) create friendly, approachable feeling
- Warm grays provide neutral balance
- Soft reds add warmth without being aggressive
- Material Design tokens ensure consistency and accessibility

**Alternatives Considered**:
- **Custom color palette**: Requires more testing and validation
- **Cool colors**: Don't achieve the warm, friendly feeling requirement
- **High saturation colors**: May feel unprofessional or overwhelming
- **Monochromatic warm**: Lacks visual interest and variety

**References**:
- Material Design 3 Color System: https://m3.material.io/styles/color/the-color-system
- WCAG Contrast Guidelines: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
- Color psychology for web design: Industry research

### 3. Material Design 3 Implementation

**Question**: How to apply Material Design 3 principles (elevation, shadows, animations) to existing Eleventy static site?

**Decision**: Implement Material Design 3 elevation system using CSS box-shadow with multiple layers. Use CSS transitions for animations. Apply elevation levels (0-5) to components based on Material Design 3 specifications. Use CSS custom properties for consistent spacing and elevation values.

**Rationale**:
- Material Design 3 provides clear elevation and shadow specifications
- CSS-only implementation maintains minimal JavaScript principle
- CSS custom properties enable easy theme customization
- Elevation system creates depth and visual hierarchy
- Transitions provide smooth animations without JavaScript

**Alternatives Considered**:
- **Material Design 2**: Older version, less refined
- **Custom design system**: Requires more design work and validation
- **JavaScript-based Material Design**: Adds unnecessary complexity and bundle size
- **Material UI framework**: Overkill for static site, adds large dependencies

**References**:
- Material Design 3 Elevation: https://m3.material.io/styles/elevation/overview
- Material Design 3 Motion: https://m3.material.io/styles/motion/overview
- CSS Box Shadow for elevation: Web standards

### 4. Full-Page View Layout

**Question**: How to implement full-page view where content flows continuously without traditional page breaks?

**Decision**: Use single-page layout with sections that flow continuously. Implement smooth scroll behavior. Use CSS for full-height sections. Add parallax effects to create depth. Maintain navigation that allows jumping to sections. Ensure mobile responsiveness with appropriate section heights.

**Rationale**:
- Single-page layout creates immersive, modern experience
- Continuous flow eliminates jarring page breaks
- Smooth scroll enhances user experience
- Section-based navigation maintains usability
- Responsive design ensures mobile compatibility

**Alternatives Considered**:
- **Multi-page with transitions**: More complex, requires routing
- **Infinite scroll**: Not appropriate for brochure site
- **Fixed sections**: Less flexible, harder to maintain
- **JavaScript framework**: Violates minimal JS principle

**References**:
- Full-page design patterns: Modern web design trends
- Smooth scroll behavior: CSS scroll-behavior property
- Section-based navigation: UX best practices

### 5. Content Tone for Non-Technical Audiences

**Question**: How to rewrite technical IT consulting content to be fun, engaging, and understandable for non-technical audiences while maintaining professionalism?

**Decision**: Use plain language principles: avoid jargon, use analogies, focus on benefits over features, use active voice, keep sentences short. Maintain professional credibility by being accurate and trustworthy. Add personality through friendly tone, relatable examples, and conversational language. Test readability at 8th grade level or below.

**Rationale**:
- Plain language improves comprehension for all audiences
- Analogies help explain technical concepts
- Benefit-focused language resonates with business decision-makers
- Friendly tone creates approachable feeling
- Professional accuracy maintains credibility

**Alternatives Considered**:
- **Overly casual tone**: May undermine professional credibility
- **Technical jargon**: Excludes non-technical audience
- **Corporate speak**: Feels cold and unapproachable
- **Oversimplification**: May lose important information

**References**:
- Plain Language Guidelines: https://www.plainlanguage.gov/
- Readability formulas: Flesch-Kincaid, SMOG index
- Content strategy for non-technical audiences: UX writing best practices

### 6. Performance Optimization for Parallax

**Question**: How to ensure parallax scrolling maintains 60fps performance on various devices?

**Decision**: Use hardware-accelerated CSS transforms, debounce scroll events, use Intersection Observer to disable parallax for off-screen elements, implement performance budgets, test on low-end devices, provide fallback for very low-performance devices.

**Rationale**:
- Hardware acceleration improves performance significantly
- Debouncing prevents excessive calculations
- Intersection Observer optimizes by only animating visible elements
- Performance budgets ensure maintainable performance
- Testing on low-end devices ensures real-world performance
- Fallbacks ensure graceful degradation

**Alternatives Considered**:
- **No optimization**: Poor performance on low-end devices
- **Disable on mobile**: Reduces feature value
- **Heavy optimization libraries**: Adds bundle size
- **Server-side rendering**: Not applicable for static site

**References**:
- Web Performance Best Practices: https://web.dev/performance/
- requestAnimationFrame optimization: MDN documentation
- Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

## Technology Choices Summary

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Parallax Implementation | CSS transforms + vanilla JS | Performance, minimal bundle, progressive enhancement |
| Color System | Material Design 3 warm tokens | Tested, accessible, consistent |
| Design System | Material Design 3 | Clear specifications, elevation, motion guidelines |
| Layout Approach | Full-page with sections | Modern, immersive, maintainable |
| Content Strategy | Plain language, 8th grade level | Accessible to non-technical audiences |
| Performance | Hardware acceleration, Intersection Observer | Maintains 60fps, optimizes calculations |

## Resolved Clarifications

All technical decisions have been made based on:
- Feature specification requirements (parallax, warm colors, Material Design, fun content)
- Constitution constraints (minimal JS, static HTML, accessibility)
- Performance requirements (60fps, <3s load time)
- Target audience needs (non-technical, approachable)

No outstanding NEEDS CLARIFICATION items remain.
