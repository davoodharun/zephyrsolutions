# Zephyr Solutions Website

Company brochure website for Zephyr Solutions - an IT consulting firm focusing on smaller organizations and non-profits.

## Prerequisites

- **Node.js**: LTS version (18.x or 20.x recommended)
- **npm**: Comes with Node.js

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**: Navigate to http://localhost:8080

## Project Structure

```
src/
├── _includes/          # Eleventy layout templates and components
│   ├── layouts/        # Page layouts
│   └── components/     # Reusable components
├── _data/              # Global site data
content/                 # Markdown content files
├── pages/              # Page content
public/                  # Static assets (CSS, images)
├── css/
└── images/
_site/                   # Build output (not committed)
```

## Commands

- `npm run dev` - Start development server with watch mode
- `npm run build` - Build site for production (outputs to `_site/`)

## Development

This is a proof of concept (POC) built with Eleventy static site generator. Content is managed through Markdown files in the `content/` directory.

For detailed setup instructions, see `specs/001-website-scaffold/quickstart.md`.
