# Implementation Plan: Flywheel Posts as Site Pages

**Branch**: `005-flywheel-posts-pages` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/005-flywheel-posts-pages/spec.md`

## Summary

Publish flywheel-generated post content as site pages at /posts so visitors can read them. Technical approach: add an Eleventy posts collection from `content/posts/`, assign a post layout and permalink `/posts/{{ fileSlug }}/`, include posts in the sitemap indexable set, and optionally add a posts index page at /posts. No change to the flywheel workflow file paths—posts continue to be written to `content/posts/YYYY-MM-DD-slug.md`; the site build is updated so those files are rendered as pages under /posts with stable URLs and metadata.

## Technical Context

**Language/Version**: JavaScript (Node) — existing Eleventy 11ty project  
**Primary Dependencies**: Eleventy (existing); content flywheel already writes to content/posts/  
**Storage**: N/A (static content in repo; build output in _site)  
**Testing**: Manual verification (build, open /posts/… URLs, check index); optional smoke test in CI  
**Target Platform**: Static host (existing; e.g. Cloudflare Pages, GitHub Pages)  
**Project Type**: Web — single static site; existing structure under src/, content/, .github/  
**Performance Goals**: No new runtime; post pages are static HTML  
**Constraints**: URL pattern must be stable and unique; posts must have meta title and description per constitution  
**Scale/Scope**: Low volume (flywheel cadence); single posts collection; optional index page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Requirement | This Feature |
|------------------|-------------|--------------|
| **Content Model — News/Blog (Optional)** | title, slug, date, summary, tags[], body, SEO overrides; stable slug; draft support | Posts use title, date, slug (from file/frontmatter), body; add description/summary where needed; optional draft in frontmatter. |
| **URL & SEO Rules** | URLs lowercase, kebab-case, stable; meta title + meta description (defaultable) | Post permalink /posts/{{ fileSlug }}/ (e.g. /posts/2026-01-30-slug/); layout supplies title and description (page or default). |
| **Everything is Versioned in Git** | Content in repo; rollback by revert | Post files remain in content/posts/; no runtime DB. |
| **Preview Before Publish** | PR previews mandatory | Flywheel opens PR; merge triggers deploy; post pages appear after merge. |
| **Minimize JavaScript** | Static HTML, minimal JS | Post pages are static HTML from layout. |

**Result**: No violations. This feature implements the optional News/Blog collection and aligns with URL & SEO rules.

## Project Structure

### Documentation (this feature)

```text
specs/005-flywheel-posts-pages/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── posts-permalink.md
│   └── posts-layout.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created by plan)
```

### Source Code (repository root)

No new top-level apps. Changes confined to existing Eleventy site and optional docs:

```text
.eleventy.js                    # Add posts collection; add posts to indexable (sitemap)
content/posts/                  # Existing; flywheel writes here (no change)
content/posts/posts.json        # Optional: directory data for layout + permalink
src/_includes/layouts/base.njk  # Already has title, description; reuse for posts
src/_includes/layouts/post.njk  # New: post layout (or use base with permalink from dir data)
_site/posts/                    # Build output: /posts/YYYY-MM-DD-slug/ per post
docs/content-flywheel.md        # Optional: note that posts are published at /posts
```

**Structure Decision**: Single static site. Posts collection and permalink are configured in Eleventy; post layout reuses base or extends it. Flywheel continues to write to content/posts/; no workflow file changes required for URL path—only site build configuration.

## Complexity Tracking

> Not used — no constitution violations to justify.
