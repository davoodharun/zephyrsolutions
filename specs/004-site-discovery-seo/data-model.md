# Data Model: Site Discovery & SEO

**Feature**: 004-site-discovery-seo  
**Date**: 2026-01-28

## Entities

### Sitemap

A build-time artifact listing all public, indexable URLs for the site. Used by search engines to discover and prioritize pages for crawling.

**Fields** (logical; emitted as XML):

- **Entries** (array of URL entries): One entry per indexable page.
  - `loc` (string, required): Absolute URL of the page (e.g. `{primaryDomain}{path}`).
  - `lastmod` (string, optional): ISO 8601 date of last modification (e.g. from file or frontmatter).
  - `changefreq` (string, optional): Hint for crawlers (e.g. `weekly`, `monthly`); optional.
  - `priority` (number, optional): Hint 0.0–1.0; optional.
- **Source**: Derived from Eleventy collections (pages, portfolio, etc.) filtered to public, indexable content only. Draft or noindex pages are excluded.

**Validation rules**:

- Every `loc` must be an absolute URL and resolve to the primary domain.
- No duplicate URLs.
- Sitemap must conform to sitemaps.org XML schema; single sitemap ≤ 50,000 URLs; if larger, use sitemap index.

**State**: Generated at build time; no runtime state. File emitted to site root (e.g. `_site/sitemap.xml`).

---

### Page metadata

Per-page attributes exposed to search engines for result display and relevance. Rendered in HTML `<head>`.

**Fields** (per page; from frontmatter or global defaults):

- **title** (string, required for display): Page title; used in `<title>` and as fallback for snippets. Source: page frontmatter `title` or global default (e.g. site name only for generic pages).
- **description** (string, required for indexable pages): Short summary for meta description and search snippets. Source: page frontmatter `description` or `globalSettings.defaultSEO.description` (or `site.defaultDescription`).
- **canonical** (string, optional): Absolute URL of the preferred version of the page. Source: `globalSettings.primaryDomain` + `page.url` (already in base layout).
- **robots** (string, optional): Only when a page must not be indexed; e.g. `noindex, nofollow` for thank-you or internal-only pages. Omitted for normal public pages.
- **Open Graph image** (string, optional): Per constitution, defaultable; from page or `globalSettings.defaultSEO.ogImage`.

**Validation rules**:

- Every public page intended for search must have a non-empty effective title and description (after fallbacks).
- Meta description should be concise (e.g. under 160 characters) for snippet display; not enforced by schema but recommended in contracts.

**State**: Static; defined in frontmatter and global settings, rendered at build time in layout.

---

### Submission configuration

The mechanism by which the site is registered with Google for indexing. Not stored in the repo; external to the build.

**Fields** (conceptual; in Google Search Console and/or robots.txt):

- **Verified property**: Domain or URL-prefix property in Google Search Console (owner verifies via DNS or HTML file/meta tag).
- **Sitemap URL**: The URL of the sitemap submitted in GSC (e.g. `https://zephyrsolutions.com/sitemap.xml`). Also declared in `robots.txt` via `Sitemap:`.
- **Optional**: Indexing API or “Submit URL” for critical URLs; documented in runbook, not modeled as entity.

**Validation rules**:

- Sitemap URL must match the built sitemap location (root of primary domain).
- robots.txt must be at site root and include the Sitemap line when sitemap is available.

**State**: External (GSC); robots.txt is build output; runbook in `docs/` describes how to submit and re-submit after changes.

---

## Relationships

- **Sitemap** → lists URLs of pages that have **page metadata** (title, description, canonical).
- **Submission configuration** references the **sitemap** URL and is documented for operators; no foreign keys in repo.
- **Page metadata** is rendered by the base layout from page data + global settings; sitemap generation reads the same collections to determine which URLs to include.

---

## Exclusions (non-indexable)

Pages or paths that must not appear in search results (FR-006):

- Excluded from the sitemap (not listed), and/or
- Served with `noindex` (e.g. `<meta name="robots" content="noindex">`) if they are still linked from the site.

Examples: thank-you pages, internal-only or draft content, duplicate URLs. Exact list is defined in contracts and implemented in sitemap filter and optional meta in layout.
