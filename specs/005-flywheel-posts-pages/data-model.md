# Data Model: Flywheel Posts as Site Pages

**Feature**: 005-flywheel-posts-pages  
**Date**: 2026-01-28

## Entities

### Post (content)

The flywheel-generated post asset: a markdown file under `content/posts/` with frontmatter and body. Used as the source for a post page on the site.

**Fields** (from frontmatter and file):

- **title** (string, required): Post title; used in `<title>` and display.
- **date** (string or date, required): Publication or creation date; used for display and ordering.
- **slug** (string, optional): URL slug; if absent, derived from filename (e.g. filename without extension).
- **description** (string, optional): Short summary for meta description and listing; if absent, layout uses default.
- **draft** (boolean, optional): If true, post is excluded from the posts collection and not rendered at /posts.
- **noindex** (boolean, optional): If true, layout outputs noindex meta; post may still appear at /posts.
- **body** (markdown): Post body; rendered as HTML in the post page.

**Source**: Flywheel writes files to `content/posts/YYYY-MM-DD-<slug>.md`; frontmatter includes title, date, slug. Directory data (e.g. `content/posts/posts.json`) sets layout and permalink for all files in that folder.

**Validation rules**:

- Each post file must have a unique filename (and thus a unique fileSlug) to avoid URL collisions.
- Title and date must be present for display; description is optional (layout fallback applies).
- Draft posts are excluded from the posts collection and from the indexable set.

**State**: Static; content is in the repo; build-time only (no runtime state).

---

### Post page

The site page that displays one post, available at a stable URL under /posts (e.g. `/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/`), with rendered content and metadata.

**Fields** (derived from Post + layout):

- **URL**: Stable, unique; pattern `/posts/{{ fileSlug }}/` (e.g. /posts/2026-01-30-slug/).
- **title**: From post frontmatter; used in `<title>` and display.
- **description**: From post frontmatter or global default; used in `<meta name="description">`.
- **date**: From post frontmatter; displayed as needed.
- **body**: Rendered markdown from post.

**Validation rules**:

- URL must be unique among post pages (enforced by unique filenames).
- Meta title and description must be non-empty (layout fallback ensures this).
- Canonical URL follows primary domain + page URL (base layout).

**State**: Build output; generated from Post entity at build time.

---

### Posts listing (optional)

An index or listing page at /posts that links to individual post pages for discovery.

**Fields** (logical):

- **URL**: `/posts/` (or equivalent).
- **Entries**: List of post pages (title, date, URL) in reverse chronological order (or defined order).

**Source**: A template (e.g. `content/posts/index.md` or a dedicated template) that iterates over the posts collection and outputs links.

**Validation rules**:

- Only non-draft posts appear in the listing.
- Links must point to the correct post page URLs.

**State**: Build output; optional for MVP.

---

## Relationships

- **Post** (content file) → rendered as **Post page** (one-to-one) when not draft.
- **Posts listing** → references **Post pages** (one-to-many).
- **Indexable set** (from 004-site-discovery-seo) → includes **Post pages** (non-draft, non-noindex) so they appear in sitemap.

---

## File paths (implementation reference)

| Item | Path (relative to repo root) |
|------|-------------------------------|
| Post content | `content/posts/YYYY-MM-DD-<slug>.md` (flywheel output; no change) |
| Directory data | `content/posts/posts.json` (layout, permalink) |
| Post layout | `src/_includes/layouts/post.njk` (or reuse base) |
| Post page URL | `/posts/{{ fileSlug }}/` (e.g. /posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/) |
| Posts index (optional) | `/posts/` (template permalink) |
