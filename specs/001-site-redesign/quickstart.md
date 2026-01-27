# Quickstart Guide: Site Redesign with Warm Material Design

**Feature**: Site Redesign with Warm Material Design  
**Date**: 2026-01-26  
**Target**: Validate redesigned site with warm colors, Material Design, and parallax scrolling

## Prerequisites

- **Node.js**: LTS version (18.x or 20.x recommended)
- **npm**: Comes with Node.js
- **Git**: For repository access
- **Modern browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Setup Steps

### 1. Ensure You're on the Feature Branch

```bash
git checkout 001-site-redesign
```

### 2. Install Dependencies (if any new ones added)

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

This command:
- Builds the site using Eleventy
- Starts local development server (typically http://localhost:8080)
- Watches for file changes

**Expected output**:
```
[11ty] Writing _site/index.html
[11ty] Server at http://localhost:8080/
```

### 4. View Redesigned Site

1. Navigate to: http://localhost:8080
2. You should see:
   - Warm color palette (oranges, yellows, warm grays)
   - Material Design elevation and shadows
   - Full-page layout with continuous scrolling
   - Parallax scrolling effects (on desktop)

## Validation Checklist

### Warm Color Palette

- [ ] Home page uses warm colors (oranges, yellows, warm grays) as primary theme
- [ ] All pages consistently use warm color palette
- [ ] Buttons and links use warm accent colors
- [ ] Text has sufficient contrast (WCAG AA - 4.5:1 for normal text)
- [ ] Color combinations are accessible (test with contrast checker)
- [ ] Warm colors create friendly, approachable feeling

### Material Design

- [ ] Cards and components use elevation (shadows)
- [ ] Interactive elements have elevation changes on hover
- [ ] Buttons show Material Design-style shadows
- [ ] Transitions are smooth and purposeful
- [ ] Components feel tactile and responsive
- [ ] Elevation levels are appropriate (not too flat, not too dramatic)

### Parallax Scrolling

- [ ] Parallax effects visible when scrolling (desktop)
- [ ] Background and foreground elements move at different speeds
- [ ] Scrolling remains smooth (60fps or close)
- [ ] Parallax effects respect reduced motion preferences
- [ ] Parallax works on desktop browsers
- [ ] Parallax gracefully degrades on mobile (or disabled appropriately)

### Full-Page View

- [ ] Content flows continuously without jarring page breaks
- [ ] Sections flow naturally from one to the next
- [ ] Navigation allows jumping to sections (if implemented)
- [ ] Smooth scroll behavior works
- [ ] Layout works on all screen sizes

### Content Tone

- [ ] Content uses friendly, approachable language
- [ ] Technical jargon is avoided or explained
- [ ] Content is understandable to non-technical readers
- [ ] Tone balances fun with professionalism
- [ ] Content feels human and relatable

### Performance

- [ ] Page loads within 3 seconds on 3G connection
- [ ] Parallax scrolling maintains smooth frame rate (60fps target)
- [ ] No janky scrolling or stuttering
- [ ] JavaScript bundle is minimal (<50KB)
- [ ] CSS is optimized and not bloated

### Accessibility

- [ ] Reduced motion preferences are respected
- [ ] Keyboard navigation works (Tab, arrow keys)
- [ ] Focus indicators are visible
- [ ] Screen readers can navigate content
- [ ] Color contrast meets WCAG AA standards
- [ ] Parallax doesn't interfere with accessibility tools

### Responsive Design

- [ ] Site works on mobile devices (320px+)
- [ ] Parallax effects adapt or disable on mobile appropriately
- [ ] Material Design elements work on touch devices
- [ ] Layout remains functional at all screen sizes
- [ ] Text is readable on small screens

## Testing Scenarios

### Scenario 1: First-Time Visitor Experience

1. **Open home page**: Should see warm, inviting colors immediately
2. **Scroll down**: Should experience smooth parallax effects
3. **Hover over buttons**: Should see Material Design elevation changes
4. **Read content**: Should find language friendly and approachable
5. **Navigate to other pages**: Should see consistent warm palette

**Expected**: Visitor feels welcomed and engaged, design feels modern and friendly

### Scenario 2: Performance Testing

1. **Open browser DevTools**: Performance tab
2. **Record performance**: While scrolling through site
3. **Check frame rate**: Should maintain 60fps or close
4. **Check load time**: Should be under 3 seconds
5. **Test on mobile device**: Should perform well

**Expected**: Smooth performance, no jank, fast load times

### Scenario 3: Accessibility Testing

1. **Enable reduced motion**: System preferences → Accessibility → Reduce motion
2. **Reload page**: Parallax should be disabled or minimized
3. **Test keyboard navigation**: Tab through interactive elements
4. **Check focus indicators**: Should be visible and clear
5. **Test with screen reader**: Content should be accessible

**Expected**: Site remains accessible, reduced motion respected, keyboard navigation works

### Scenario 4: Mobile Experience

1. **Open on mobile device**: Or use browser responsive mode
2. **Scroll through site**: Parallax may be disabled (expected)
3. **Test touch interactions**: Buttons and links should work
4. **Check readability**: Text should be readable
5. **Test navigation**: Should work on mobile

**Expected**: Mobile experience is functional, touch-friendly, readable

## Troubleshooting

### Parallax Not Working

- Check browser console for JavaScript errors
- Verify `public/js/parallax.js` exists and is loaded
- Check that elements have correct classes (`.parallax-bg`, etc.)
- Verify JavaScript is enabled in browser
- Check if reduced motion is enabled (will disable parallax)

### Colors Not Warm

- Verify CSS custom properties are defined in `public/css/style.css`
- Check that `:root` variables are using warm color values
- Ensure no conflicting styles overriding warm colors
- Check browser DevTools to see computed colors

### Material Design Not Visible

- Verify elevation CSS is defined (box-shadow values)
- Check that components have elevation classes applied
- Ensure transitions are defined in CSS
- Check browser support for box-shadow

### Performance Issues

- Check browser DevTools Performance tab
- Verify parallax is using transforms (not position changes)
- Check if too many parallax elements are active
- Consider disabling parallax on low-end devices
- Verify JavaScript is optimized (minified in production)

### Accessibility Issues

- Test with keyboard navigation
- Check contrast ratios with contrast checker tool
- Verify reduced motion is respected
- Test with screen reader
- Check focus indicators are visible

## Success Criteria Validation

- [ ] **SC-001**: Parallax maintains 60fps (check Performance tab)
- [ ] **SC-002**: 100% of pages use warm palette (visual inspection)
- [ ] **SC-003**: All colors meet WCAG AA contrast (use contrast checker)
- [ ] **SC-004**: Content understandable to non-technical users (user testing)
- [ ] **SC-005**: Site loads in <3 seconds (Network tab, 3G throttling)
- [ ] **SC-006**: Reduced motion respected (test with system setting)
- [ ] **SC-007**: 80%+ components use Material Design (visual inspection)
- [ ] **SC-008**: Content at 8th grade level (readability tool)
- [ ] **SC-009**: Responsive design works 320px-1920px (responsive mode)
- [ ] **SC-010**: Users find site friendly (user testing)
- [ ] **SC-011**: Interactive feedback <100ms (test interactions)
- [ ] **SC-012**: Professional credibility maintained (stakeholder review)

## Next Steps

After successful validation:

1. **User Testing**: Test with non-technical users from target audience
2. **Performance Optimization**: Fine-tune based on performance metrics
3. **Content Review**: Review all content for tone and readability
4. **Accessibility Audit**: Full accessibility audit with tools
5. **Browser Testing**: Test in all supported browsers
6. **Mobile Testing**: Test on actual mobile devices
7. **Stakeholder Review**: Get feedback on design and tone

## Additional Resources

- Material Design 3: https://m3.material.io/
- WCAG Contrast Checker: https://webaim.org/resources/contrastchecker/
- Readability Tools: Flesch-Kincaid, SMOG index calculators
- Performance Tools: Chrome DevTools, Lighthouse
- Accessibility Tools: axe DevTools, WAVE
