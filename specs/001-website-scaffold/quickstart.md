# Quickstart Guide: Basic Website Scaffolding

**Feature**: Basic Website Scaffolding and Proof of Concept  
**Date**: 2026-01-26  
**Target**: Get the site running locally in under 5 minutes

## Prerequisites

- **Node.js**: LTS version (18.x or 20.x recommended)
  - Check version: `node --version`
  - Download: https://nodejs.org/
- **npm**: Comes with Node.js
  - Check version: `npm --version`
- **Git**: For cloning repository (if not already cloned)
  - Check version: `git --version`

## Setup Steps

### 1. Clone Repository (if needed)

```bash
git clone <repository-url>
cd zephyrsolutions
```

### 2. Install Dependencies

```bash
npm install
```

This installs Eleventy and other dependencies defined in `package.json`.

**Expected time**: 30-60 seconds

### 3. Start Development Server

```bash
npm run dev
```

This command:
- Builds the site using Eleventy
- Starts a local development server
- Watches for file changes and auto-rebuilds
- Opens browser automatically (if configured)

**Expected output**:
```
[11ty] Writing _site/index.html
[11ty] Wrote 4 files in 0.12 seconds (v2.0.0)
[11ty] Server at http://localhost:8080/
[11ty] Watching…
```

**Expected time**: 2-5 seconds

### 4. Verify Setup

1. Open browser to: http://localhost:8080
2. You should see:
   - Home page with "Zephyr Solutions" as site name
   - Navigation menu (Home, About, Services, Contact)
   - Basic styling and readable content

### 5. Test Navigation

Click through navigation links to verify:
- Home page loads
- About page loads
- Services page loads
- Contact page loads
- Navigation highlights current page

## Verification Checklist

- [ ] Development server starts without errors
- [ ] Home page displays "Zephyr Solutions"
- [ ] Navigation menu is visible and functional
- [ ] All pages (Home, About, Services, Contact) are accessible
- [ ] Content is readable with basic styling
- [ ] File changes trigger auto-rebuild (edit a Markdown file and save)

## Troubleshooting

### Port Already in Use

If port 8080 is already in use:

```bash
npx @11ty/eleventy --serve --port 3000
```

Or update `package.json` scripts to use a different port.

### Node Version Issues

If you see Node version errors:

1. Check Node version: `node --version`
2. Use Node Version Manager (nvm) to switch versions:
   ```bash
   nvm install 20
   nvm use 20
   ```

### Dependencies Not Installing

If `npm install` fails:

1. Clear npm cache: `npm cache clean --force`
2. Delete `node_modules` and `package-lock.json`
3. Run `npm install` again

### Build Errors

If Eleventy build fails:

1. Check `.eleventy.js` configuration exists
2. Verify `content/pages/` directory has Markdown files
3. Check template files exist in `src/_includes/layouts/`
4. Review error messages for specific file issues

## Next Steps

After successful setup:

1. **Edit Content**: Modify Markdown files in `content/pages/` to see changes
2. **Edit Templates**: Update templates in `src/_includes/` to change layout
3. **Add Styling**: Modify `public/css/style.css` to customize appearance
4. **Add Pages**: Create new `.md` files in `content/pages/` and add to navigation

## Development Workflow

1. **Make Changes**: Edit files in `content/`, `src/`, or `public/`
2. **Auto-Rebuild**: Eleventy watches for changes and rebuilds automatically
3. **Refresh Browser**: Changes appear after rebuild (may auto-refresh)
4. **Verify**: Check that changes appear correctly in browser

## Project Structure Reference

```
zephyrsolutions/
├── src/
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk      # Base layout template
│   │   └── components/        # Reusable components
│   └── _data/
│       ├── site.json          # Site configuration
│       └── navigation.json    # Navigation structure
├── content/
│   └── pages/
│       ├── index.md           # Home page
│       ├── about.md           # About page
│       ├── services.md        # Services page
│       └── contact.md         # Contact page
├── public/
│   ├── css/
│   │   └── style.css          # Site styles
│   └── images/               # Image assets
├── .eleventy.js               # Eleventy configuration
├── package.json               # Dependencies and scripts
└── _site/                     # Build output (auto-generated)
```

## Commands Reference

- `npm run dev` - Start development server with watch mode
- `npm run build` - Build site for production (outputs to `_site/`)
- `npm run serve` - Serve built site (requires build first)

## Success Criteria Met

✅ Developer can start local server in <5 minutes  
✅ Site is viewable in browser  
✅ All pages are accessible  
✅ Navigation works correctly  
✅ Content changes are reflected after save
