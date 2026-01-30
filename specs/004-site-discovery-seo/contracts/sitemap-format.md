# Contract: Sitemap Format

**Feature**: 004-site-discovery-seo  
**Date**: 2026-01-28

## Purpose

Define the structure and rules for the generated `sitemap.xml` so it is valid and accepted by Google and other major search engines.

## Format

- **Protocol**: [Sitemaps.org XML protocol](https://www.sitemaps.org/protocol.html).
- **Encoding**: UTF-8.
- **Content-type**: `application/xml` (or `text/xml`).

## Schema (conceptual)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/page-path/</loc>
    <lastmod>2026-01-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- more url entries -->
</urlset>
```

- **`<loc>`**: Required. Absolute URL of the page. Must use the primary domain (e.g. from `globalSettings.primaryDomain`). No query strings or fragments unless required for the page.
- **`<lastmod>`**: Optional. Date in W3C Datetime or date-only (YYYY-MM-DD). Prefer date of last content change when available.
- **`<changefreq>`**: Optional. Hint only. Values: `always`, `hourly`, `daily`, `weekly`, `monthly`, `yearly`, `never`.
- **`<priority>`**: Optional. Hint only. Value 0.0–1.0; default 0.5. Homepage often 1.0; key entry pages higher.

## Inclusion rules

- **Include**: All public, indexable pages (e.g. pages collection, portfolio items, standalone pages like `/health-check/`, `/skills/`). Only pages that should appear in search.
- **Exclude**: Draft content (e.g. `draft: true`), pages with `noindex` or equivalent, thank-you or internal-only pages, assets (images/CSS/JS), and duplicate URLs.
- **URL form**: Lowercase, stable, canonical URLs. Trailing slash policy must be consistent (match how the site serves pages).

## Limits

- **Single sitemap**: Maximum 50,000 URLs.
- **Single sitemap file size**: Maximum 50 MB (uncompressed).
- **If limits exceeded**: Use a sitemap index file that references multiple sitemaps; document in this contract when the threshold is approached.

## Location and discovery

- **File path**: Emitted at site root as `sitemap.xml` (build output: e.g. `_site/sitemap.xml`).
- **Canonical URL**: `{primaryDomain}/sitemap.xml` (e.g. `https://zephyrsolutions.com/sitemap.xml`).
- **Discovery**: Declared in `robots.txt` via `Sitemap: {absolute URL}`. Submitted to Google Search Console as the sitemap URL.

## Validation

- Validate with a sitemap validator (e.g. [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)) or Google Search Console after submission.
- All `<loc>` URLs must return 200 (or 3xx redirect to canonical) when requested by a crawler; no 4xx/5xx for indexable pages.
