# Contract: Page Metadata and robots.txt

**Feature**: 004-site-discovery-seo  
**Date**: 2026-01-28

## Purpose

Define how page metadata (title, description, canonical, noindex) is exposed in HTML and how `robots.txt` is generated so the site is crawlable and indexable as intended.

---

## 1. Page metadata (HTML head)

### Title

- **Element**: `<title>{content}</title>`
- **Source**: Page frontmatter `title`; if missing, use a site-wide default (e.g. site name only or `globalSettings.defaultSEO.title` template with fallback).
- **Requirement**: Every public page must have a non-empty effective title. Should be unique per page where possible; descriptive for search result display (e.g. “Home - Zephyr Solutions”, “Free IT & Web Assessment - Zephyr Solutions”).

### Meta description

- **Element**: `<meta name="description" content="{content}">`
- **Source**: Page frontmatter `description`; if missing, use `globalSettings.defaultSEO.description` or `site.defaultDescription`.
- **Requirement**: Every public page intended for search must have an effective description (no empty content). Recommended length under 160 characters for snippet display.
- **Fallback**: No auto-extraction from body for initial implementation; explicit frontmatter or global default only.

### Canonical URL

- **Element**: `<link rel="canonical" href="{absolute URL}">`
- **Source**: `globalSettings.primaryDomain` + normalized `page.url` (e.g. strip `/index.html` to trailing slash for consistency).
- **Requirement**: Present on every public page so the preferred URL is unambiguous.

### Robots (noindex when needed)

- **Element**: `<meta name="robots" content="noindex, nofollow">` (or equivalent)
- **When**: Only for pages that must not be indexed (e.g. thank-you, internal-only, duplicate content). Omit for normal public pages.
- **Requirement**: Pages excluded from the sitemap should either be noindex or not linked from indexable pages; document exclusions in this contract and implement in layout when a page has `noindex: true` (or equivalent) in frontmatter.

### Open Graph (optional per page)

- **Per constitution**: OG image is defaultable. Use `globalSettings.defaultSEO.ogImage` when page does not override. Title/description can mirror meta title/description for OG tags if desired; not required by this feature.

---

## 2. robots.txt

### Location

- **File path**: Site root (e.g. `_site/robots.txt`).
- **Canonical URL**: `{primaryDomain}/robots.txt`.

### Content rules

- **User-agent**: `User-agent: *` (all crawlers).
- **Allow**: Public site — allow crawling of public HTML. Either omit Disallow or use `Allow: /` as needed. Do not disallow `/` or public page paths.
- **Disallow** (optional): Only specific paths that must not be crawled (e.g. `/api/`, `/health-check/report/` if those are noindex and should not be crawled). Document each Disallow in this contract.
- **Sitemap**: One line: `Sitemap: {absolute URL of sitemap}` (e.g. `Sitemap: https://zephyrsolutions.com/sitemap.xml`). Required so crawlers can discover the sitemap.

### Example

```text
User-agent: *
Allow: /

Sitemap: https://zephyrsolutions.com/sitemap.xml
```

If exclusions are added later:

```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /health-check/report/

Sitemap: https://zephyrsolutions.com/sitemap.xml
```

### Generation

- **Build-time**: Generate from template or Eleventy config using `primaryDomain` from global settings so the same build can target preview vs production by env.
- **Encoding**: Plain text; UTF-8.

---

## 3. Data sources (implementation reference)

- **Global**: `content/global/settings.json` — `primaryDomain`, `defaultSEO.title`, `defaultSEO.description`, `defaultSEO.ogImage`.
- **Site fallback**: `src/_data/site.json` — `defaultDescription`, `siteName` (align with defaultSEO where used).
- **Per page**: Frontmatter `title`, `description`, optional `noindex`, optional `ogImage`.

Layout must resolve description in order: page `description` → `globalSettings.defaultSEO.description` → `site.defaultDescription` so that every public page has a non-empty meta description.

---

## 4. Exclusions (implementation note)

No Disallow or noindex exclusions as of 2026-01-28. If non-public paths are added (e.g. `/api/`, report-only pages like `/health-check/report/`), add them here and update robots.txt template with corresponding `Disallow:` lines; add `noindex: true` in frontmatter for pages that must not be indexed.
