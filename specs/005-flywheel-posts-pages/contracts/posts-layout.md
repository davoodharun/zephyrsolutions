# Contract: Post Page Layout and Metadata

**Feature**: 005-flywheel-posts-pages  
**Date**: 2026-01-28

## Purpose

Define how post pages are rendered (layout, metadata, and optional structure) so that they meet constitution requirements (meta title, meta description) and present post content consistently.

## Layout

- **Primary**: Use the existing **base layout** for post pages so they have the same header, footer, navigation, and meta behavior (title, description, canonical, noindex when set).
- **Optional wrapper**: A **post layout** (e.g. `src/_includes/layouts/post.njk`) that sets `layout: layouts/base` and wraps the main content in an `<article>` (or equivalent) with optional date display and “Back to posts” link. If omitted, posts can use `layout: layouts/base` directly from directory data; add post.njk only if post-specific structure (article, date, back link) is desired.

## Metadata (HTML head)

- **Title**: `<title>` must be non-empty. Use post frontmatter `title`; if missing, use a fallback (e.g. site name or “Post”). Prefer format “Post Title - Site Name” for consistency with other pages.
- **Description**: `<meta name="description" content="...">` must be non-empty for indexable posts. Use post frontmatter `description`; if missing, use `globalSettings.defaultSEO.description` or `site.defaultDescription` (same fallback as base layout).
- **Canonical**: `<link rel="canonical" href="...">` from base layout (primary domain + page URL).
- **Robots**: If post has `noindex: true` in frontmatter, output `<meta name="robots" content="noindex, nofollow">`; otherwise omit (indexable).
- **Open Graph**: Optional; base layout or post layout can add OG tags using title/description; defaultable per constitution.

## Content display

- **Title**: Display the post title (e.g. `<h1>`) at the top of the main content.
- **Date**: Display the post date when available (e.g. formatted via Eleventy date filter).
- **Body**: Render the post body (markdown) as HTML in the main content area; use the same sanitization/rendering as other content pages.

## Draft and noindex

- **Draft**: Posts with `draft: true` in frontmatter are excluded from the **posts** collection in Eleventy config, so they are not rendered and have no URL. Do not include draft in the collection used for post pages or for the posts index.
- **Noindex**: Posts with `noindex: true` are still rendered and have a URL; the layout outputs the noindex meta tag so search engines are asked not to index them. Use when a post is public but should not appear in search results.

## Data sources

- **Post frontmatter**: title, date, slug, description (optional), draft (optional), noindex (optional).
- **Global**: `globalSettings.defaultSEO.description`, `site.defaultDescription`, `globalSettings.siteName` (for title fallback and “ - Site Name” suffix).
- **Layout**: Reuse base.njk for header, footer, meta; optional post.njk for article/date wrapper.
