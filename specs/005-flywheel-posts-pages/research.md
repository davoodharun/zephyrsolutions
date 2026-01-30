# Research: Flywheel Posts as Site Pages

**Date**: 2026-01-28  
**Feature**: Flywheel Posts as Site Pages  
**Phase**: Phase 0 — Research

## Research Questions

### 1. Eleventy permalink for posts at /posts without moving files

**Question**: How can content in `content/posts/YYYY-MM-DD-slug.md` be served at URL `/posts/YYYY-MM-DD-slug/` (or `/posts/slug/`) without changing where the flywheel writes files?

**Decision**: Use Eleventy directory data or frontmatter to set permalink. **Option A (recommended)**: Add a directory data file `content/posts/posts.json` with `permalink: "/posts/{{ page.fileSlug }}/"` and `layout: "layouts/post"`. Eleventy’s `page.fileSlug` for a file `2026-01-30-harnessing-cloud-solutions-for-nonprofits.md` is `2026-01-30-harnessing-cloud-solutions-for-nonprofits`, so the URL becomes `/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/`. No change to flywheel output path. **Option B**: Have the flywheel write `permalink: /posts/{{ slug }}/` or a literal permalink in each post’s frontmatter; works but duplicates logic and requires flywheel to know the pattern. Prefer directory data so all posts under `content/posts/` automatically get the /posts/ URL.

**Rationale**:
- Directory data applies to all files in that folder without editing each file; flywheel does not need to write permalink.
- fileSlug is unique per file (filename without extension) and matches the existing YYYY-MM-DD-slug naming.
- Keeps URLs lowercase, kebab-case, and stable per constitution.

**Alternatives considered**:
- **Move files to a different input path**: Would require flywheel or a build step to move files; more complex and breaks “flywheel writes to content/posts/”.
- **Eleventy redirects or rewrites**: Unnecessary when we can set permalink at build time.
- **Frontmatter permalink in each post**: Flywheel would need to emit it; directory data is simpler and single source of truth.

**References**:
- Eleventy directory data: https://www.11ty.dev/docs/data-template-dir/
- Eleventy permalink: https://www.11ty.dev/docs/permalinks/

---

### 2. Layout for post pages (reuse base vs dedicated post layout)

**Question**: Should post pages use the same base layout as the rest of the site or a dedicated post layout?

**Decision**: Use the existing **base layout** for post pages so they have the same header, footer, and meta behavior (title, description, canonical). Create a thin **post layout** that extends or wraps base and provides any post-specific structure (e.g. article wrapper, date display, optional back link to /posts). If the site’s base layout already supports “single content” pages (e.g. title + content), posts can use `layout: layouts/base` with no new layout file and only directory data setting layout to base; then add a post-specific layout only if we want different structure (e.g. article, date, reading time). Prefer **reuse base** with optional **post.njk** that sets `layout: layouts/base` and adds article/date wrapper so posts look consistent but can evolve (e.g. “Back to posts”, date formatting) without touching base.

**Rationale**:
- Same header/footer and meta (title, description, canonical) as rest of site; constitution requires meta title and description.
- A dedicated post layout (even if it only wraps base) gives a single place to add post-specific markup (article, date, optional index link) later.
- Reduces duplication and keeps base layout unchanged for non-post pages.

**Alternatives considered**:
- **Posts use base only, no post.njk**: Works; we lose a single place for post-specific structure. Acceptable if we don’t need article/date wrapper; can add post.njk later.
- **Fully custom post layout**: Unnecessary for MVP; base already provides meta and chrome.

**References**:
- Constitution: meta title + meta description (defaultable); URL & SEO rules.
- Existing base.njk: title, description fallback, canonical.

---

### 3. Posts index page at /posts

**Question**: Should the site have a posts index page at /posts that lists all posts?

**Decision**: **Optional for MVP**; include in scope as a simple index page. If implemented: add a template (e.g. `content/posts/index.md` or `posts.njk`) with permalink `/posts/` that iterates over the posts collection (reverse chronological) and outputs a list of links (title, date, URL). Enables discovery and satisfies FR-006 (“If the site provides a posts index … it MUST include generated posts”). If not implemented in the first iteration, success is still met by each post being reachable at its own URL; add the index in a follow-up task.

**Rationale**:
- Spec says “If the site provides a posts index” — so index is conditional; individual post URLs are required.
- A simple index improves findability and aligns with “list generated posts” in the spec.
- Can be a single template + collection; low effort.

**Alternatives considered**:
- **No index**: Valid; spec allows “each post reachable at its own URL” without an index.
- **Index required in v1**: Adds scope; we can ship posts-as-pages first and add index next.

**References**:
- Spec FR-006, SC-004.

---

### 4. Draft and noindex for posts

**Question**: How should posts be excluded from publication (draft) or from search (noindex)?

**Decision**: Support optional **draft** in frontmatter (e.g. `draft: true`). Draft posts are **excluded from the posts collection** used for rendering and for the index (filter in Eleventy: `collectionApi.getFilteredByGlob("content/posts/*.md").filter(p => !p.data.draft)`). Do not render draft posts as pages at /posts. Optionally support **noindex** in frontmatter so a published post can ask search engines not to index it (layout already supports noindex meta from 004-site-discovery-seo). Flywheel does not need to set draft by default; consultant can add `draft: true` when editing before merge if they don’t want a post published yet.

**Rationale**:
- Constitution: “support draft/unpublished content (via branch/PR workflow or explicit draft field)”.
- Excluding draft from the collection is the simplest approach; no URL is generated for drafts.
- noindex is already in base layout; posts using base get it for free when frontmatter has noindex.

**Alternatives considered**:
- **Separate “drafts” folder**: Would require flywheel or workflow to move files; more complex.
- **Publish all, hide with noindex**: Doesn’t satisfy “exclude from publication”; draft should not appear at /posts at all.

**References**:
- Constitution: draft/unpublished support.
- Spec edge case: “consultant does not want a particular post to appear on the site”.

---

### 5. Sitemap and indexable set inclusion for posts

**Question**: Should post pages be included in the sitemap and in the indexable set used for SEO?

**Decision**: **Yes.** Add posts (non-draft) to the **indexable** collection used for sitemap generation (see 004-site-discovery-seo). So in `.eleventy.js`, extend the indexable collection to include `content/posts/*.md` filtered by `!draft`. Post pages then get stable URLs under /posts, meta title/description from layout, and appear in sitemap.xml so search engines can discover them. No separate contract needed beyond “posts are indexable unless draft or noindex”.

**Rationale**:
- Spec FR-004: post pages must expose title and description for search engines; sitemap inclusion supports discovery.
- 004-site-discovery-seo already defines indexable; adding posts is a one-line change in the collection.
- Aligns with URL & SEO rules (canonical, meta, sitemap).

**Alternatives considered**:
- **Exclude posts from sitemap**: Would reduce discoverability; no reason to exclude public posts.
- **Separate sitemap for posts**: Unnecessary; single sitemap with all indexable pages is sufficient.

**References**:
- Spec FR-004, SC-001–SC-004.
- 004-site-discovery-seo: indexable collection, sitemap-format.md.

---

## Summary Table

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Permalink | Directory data `content/posts/posts.json` with `permalink: "/posts/{{ page.fileSlug }}/"` | No flywheel change; all posts under content/posts/ get /posts/ URL |
| Layout | Reuse base; optional post.njk wrapper for article/date | Same chrome and meta; one place for post-specific markup |
| Posts index | Optional for MVP; simple list at /posts/ | Improves discovery; can add after posts-as-pages ship |
| Draft | Frontmatter `draft: true`; exclude from posts collection and index | No URL for drafts; aligns with constitution |
| Sitemap | Include non-draft posts in indexable collection | Post pages discoverable; aligns with SEO rules |
