# Quickstart Guide: Full Site Implementation with CMS Integration

**Feature**: Full Site Implementation with CMS Integration  
**Date**: 2026-01-26  
**Target**: Set up site locally, access CMS, and validate full implementation

## Prerequisites

- **Node.js**: LTS version (18.x or 20.x recommended)
- **npm**: Comes with Node.js
- **Git**: For repository access
- **GitHub/GitLab account**: For TinaCMS authentication (if using OAuth)

## Setup Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd zephyrsolutions
```

### 2. Install Dependencies

```bash
npm install
```

This installs Eleventy, TinaCMS, and other dependencies.

**Expected time**: 1-2 minutes

### 3. Configure TinaCMS (if needed)

If using TinaCMS Cloud or custom authentication, configure in `tina/config.ts`:

- Set up authentication provider (GitHub, GitLab, or custom)
- Configure branch for CMS edits
- Set up API keys if using TinaCMS Cloud

### 4. Start Development Server

```bash
npm run dev
```

This command:
- Builds the site using Eleventy
- Starts local development server
- Enables TinaCMS admin interface (typically at `/admin`)
- Watches for file changes

**Expected output**:
```
[11ty] Writing _site/index.html
[11ty] Server at http://localhost:8080/
[11ty] TinaCMS admin at http://localhost:8080/admin
```

### 5. Access CMS Interface

1. Navigate to: http://localhost:8080/admin
2. Authenticate using configured provider (GitHub/GitLab)
3. You should see CMS interface with collections:
   - Pages
   - Portfolio
   - Services
   - Global Settings

### 6. Verify Site Functionality

1. **View Public Site**: http://localhost:8080
2. **Check Portfolio Section**: Navigate to `/work` or `/portfolio`
3. **Verify Images**: Check that images load correctly
4. **Test Navigation**: Verify all navigation links work
5. **Check Responsive**: Resize browser to test mobile view

## Validation Checklist

### CMS Functionality

- [ ] CMS admin interface accessible at `/admin`
- [ ] Authentication works (GitHub/GitLab login)
- [ ] Can view all collections (Pages, Portfolio, Services, Settings)
- [ ] Can edit a page through CMS interface
- [ ] Can upload an image through CMS
- [ ] Changes are saved and visible in preview
- [ ] Changes are committed to Git automatically

### Portfolio Section

- [ ] Portfolio section accessible (e.g., `/work` or `/portfolio`)
- [ ] Portfolio index page displays case studies
- [ ] Each portfolio item shows: image, title, summary
- [ ] Can click portfolio item to view detail page
- [ ] Portfolio detail page shows full case study content
- [ ] Images have alt text or are marked decorative
- [ ] Portfolio filtering/categorization works (if implemented)

### Enhanced Content

- [ ] Home page uses section components (Hero, Feature List, etc.)
- [ ] Section components render correctly
- [ ] Images display properly in sections
- [ ] Content sections are well-organized and readable
- [ ] Enhanced styling improves visual design

### Images

- [ ] Images load correctly on all pages
- [ ] Images are optimized (reasonable file sizes)
- [ ] Responsive images work (srcset if implemented)
- [ ] Images have alt text in HTML
- [ ] Image layout remains stable if images fail to load
- [ ] Images display correctly on mobile devices

### Documentation

- [ ] `docs/editor-guide.md` exists and is comprehensive
- [ ] `docs/dev-setup.md` exists and enables local setup
- [ ] `docs/deploy.md` exists and describes deployment process
- [ ] `docs/content-model.md` exists and documents all collections
- [ ] Documentation is clear and actionable

### Build and Performance

- [ ] Site builds successfully (`npm run build`)
- [ ] All pages generate correctly
- [ ] CSS and images are copied to output
- [ ] Build output size is reasonable
- [ ] Page load times are acceptable (<2 seconds)

## CMS Workflow Validation

### Content Editing Workflow

1. **Edit Content**:
   - [ ] Open CMS at `/admin`
   - [ ] Navigate to a collection (e.g., Pages)
   - [ ] Edit a page's content
   - [ ] Save changes

2. **Image Management**:
   - [ ] Upload an image through CMS
   - [ ] Add alt text to image
   - [ ] Use image in a page or portfolio item
   - [ ] Verify image appears in preview

3. **Preview Changes**:
   - [ ] Make changes in CMS
   - [ ] Preview changes before committing
   - [ ] Verify preview matches expectations

4. **Git Integration**:
   - [ ] Check Git status after CMS edit
   - [ ] Verify changes are committed automatically
   - [ ] Review commit message (should be descriptive)

### Portfolio Management Workflow

1. **Create Portfolio Item**:
   - [ ] Create new case study in CMS
   - [ ] Fill in required fields (title, summary, hero image)
   - [ ] Add industries and services used
   - [ ] Write case study content
   - [ ] Save and preview

2. **Edit Portfolio Item**:
   - [ ] Open existing portfolio item in CMS
   - [ ] Update content
   - [ ] Change featured status
   - [ ] Verify changes in preview

## Troubleshooting

### CMS Not Accessible

- Check TinaCMS configuration in `tina/config.ts`
- Verify authentication provider is configured
- Check browser console for errors
- Ensure dev server is running

### Images Not Loading

- Verify images are in `public/images/` directory
- Check image paths in content files
- Ensure Eleventy copies images correctly (check `.eleventy.js`)
- Check browser console for 404 errors

### Portfolio Section Not Showing

- Verify portfolio collection is configured in `.eleventy.js`
- Check that portfolio Markdown files exist in `content/portfolio/`
- Verify portfolio template exists
- Check Eleventy build output for errors

### CMS Changes Not Saving

- Check Git repository status
- Verify write permissions
- Check TinaCMS configuration for Git integration
- Review browser console for errors

### Build Errors

- Check Eleventy configuration
- Verify all required dependencies are installed
- Review build output for specific errors
- Check template syntax (Nunjucks)

## Success Criteria Checklist

- [ ] Site runs locally and CMS is accessible
- [ ] Portfolio section displays case studies with images
- [ ] Non-developer can edit content through CMS
- [ ] Images upload and display correctly
- [ ] Enhanced styling improves visual design
- [ ] All documentation is complete and helpful
- [ ] CMS changes are committed to Git
- [ ] Preview functionality works
- [ ] Site maintains responsive design
- [ ] All pages are accessible and functional

## Next Steps

After successful validation:

1. **Content Creation**: Add portfolio case studies, enhance page content
2. **Image Optimization**: Ensure all images are optimized
3. **Documentation Review**: Have team members test documentation
4. **CMS Training**: Train content editors on CMS usage
5. **Deployment**: Set up preview and production deployment workflows

## Additional Resources

- TinaCMS Documentation: https://tina.io/docs/
- Eleventy Documentation: https://www.11ty.dev/docs/
- Editor Guide: `docs/editor-guide.md`
- Developer Setup: `docs/dev-setup.md`
- Content Model: `docs/content-model.md`
