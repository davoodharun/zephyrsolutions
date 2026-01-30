# Research: Site Discovery & SEO

**Date**: 2026-01-28  
**Feature**: Site Discovery & SEO  
**Phase**: Phase 0 — Research

## Research Questions

### 1. Sitemap generation for Eleventy

**Question**: How to generate a standards-compliant sitemap.xml for an Eleventy static site that lists all public, indexable pages and is discoverable at a fixed URL?

**Decision**: Generate `sitemap.xml` at build time from Eleventy collections. Use a dedicated template (e.g. `sitemap.njk` or `sitemap.xml.njk`) that iterates over a filtered list of URLs (all pages, portfolio, key standalone pages), outputs XML in [sitemaps.org](https://www.sitemaps.org/protocol.html) format with `<loc>`, optional `<lastmod>`, and `<changefreq>`/`<priority>` if desired. Exclude draft content, non-public paths (e.g. `/health-check/report/` if those are noindex), and assets. Emit the file at site root (e.g. `_site/sitemap.xml`) so the canonical URL is `{primaryDomain}/sitemap.xml`. If the site grows beyond 50,000 URLs, split into multiple sitemaps and add a sitemap index; for current scope a single sitemap is sufficient.

**Rationale**:
- Build-time generation keeps the site static and avoids runtime dependencies.
- Sitemaps.org format is accepted by Google and other major search engines.
- Using Eleventy collections ensures only intended content is included and draft/private content can be filtered out.
- Single file is simpler to maintain and submit; index only when needed.

**Alternatives considered**:
- **Third-party Eleventy plugin**: Reduces custom code but adds a dependency; many plugins do the same thing with a config object. A simple template + collection is sufficient for small-to-medium sites.
- **Runtime sitemap**: Not applicable; site is static.
- **Manual sitemap**: Error-prone and doesn’t stay in sync with new pages.

**References**:
- Sitemaps.org protocol: https://www.sitemaps.org/protocol.html  
- Google: Sitemap guidelines: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build  

---

### 2. Google submission and discovery

**Question**: What are the recommended ways to submit the site to Google so it can discover and index the site?

**Decision**: (1) **Sitemap submission**: Add the sitemap URL to Google Search Console (GSC) after verifying the property (e.g. domain or URL prefix). (2) **robots.txt**: Publish a `robots.txt` at site root that allows crawlers and includes `Sitemap: {absolute URL to sitemap}` so discovery is automatic once the root URL is known. (3) **URL inspection / Submit URL**: Use GSC “URL inspection” or “Submit URL” for critical URLs if immediate crawling is desired; sitemap submission remains the primary mechanism. Do not rely on “Google will find it eventually” for a new or low-authority site; explicit submission is required for predictable indexing.

**Rationale**:
- Search Console is the standard, free way to submit sitemaps and monitor indexing.
- Listing the sitemap in robots.txt helps any crawler that reads robots.txt to find the sitemap without extra configuration.
- Documenting these steps in a runbook (e.g. `docs/google-submission.md` or section in `docs/deploy.md`) satisfies FR-001 and supports repeatable submission after domain or host changes.

**Alternatives considered**:
- **Indexing API**: Appropriate for programmatic or high-volume URL submission; overkill for a brochure site. Can be added later if needed.
- **Ping services**: Pinging Google’s sitemap ping endpoint on deploy is optional; GSC sitemap submission is the main requirement.
- **No robots.txt**: Possible but not recommended; robots.txt is expected by crawlers and is the standard place to declare the sitemap URL.

**References**:
- Google Search Console: https://search.google.com/search-console  
- Submit a sitemap: https://support.google.com/webmasters/answer/7451001  
- robots.txt and Sitemap: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt  

---

### 3. robots.txt content and placement

**Question**: What should robots.txt contain and where should it be served?

**Decision**: Serve `robots.txt` at the site root (e.g. `_site/robots.txt`), so the canonical URL is `{primaryDomain}/robots.txt`. Content: (1) `User-agent: *` with `Allow: /` (or no Disallow for public site). (2) `Sitemap: {absolute URL to sitemap}` (e.g. `https://zephyrsolutions.com/sitemap.xml`). Do not disallow public HTML pages. If certain paths must be excluded from indexing (e.g. thank-you or internal-only pages), add specific `Disallow:` lines for those paths only; document exclusions in the contracts. Generate the file at build time (e.g. from a template or a small Eleventy config that writes the file) using `primaryDomain` from global settings so it works across environments (preview vs production) when built with the correct env.

**Rationale**:
- Root placement is required by the robots.txt standard.
- Allowing crawlers by default aligns with a public brochure site; explicit Allow is clear.
- Single Sitemap line is enough for one sitemap; sitemap index URL if we later use multiple sitemaps.

**Alternatives considered**:
- **No robots.txt**: Crawlers would still crawl; but we would miss the chance to point to the sitemap and to document any Disallow rules.
- **Dynamic robots.txt**: Not needed for a static site; build-time generation is sufficient.

**References**:
- robots.txt specification: https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt  
- RFC 9309 (robots.txt): https://www.rfc-editor.org/rfc/rfc9309  

---

### 4. Meta description fallback when page has none

**Question**: When a page does not set an explicit meta description, what fallback should be used so every indexable page has a snippet (FR-004)?

**Decision**: Use a two-level fallback: (1) **Page-level**: If the page has a `description` in frontmatter, use it. (2) **Site-level**: If not, use the global default from `globalSettings.defaultSEO.description` (or `site.defaultDescription` if that is the single source of truth). Do not auto-generate from first paragraph of body for the initial implementation (noise and duplication risk); prefer explicit frontmatter or the global default. Ensure the base layout reads the default from the same source as the rest of the site (e.g. consolidate on `globalSettings.defaultSEO` if that is the canonical config).

**Rationale**:
- Global default satisfies “sensible default” and keeps messaging consistent for pages that don’t need a custom description.
- Avoiding body extraction keeps implementation simple and avoids duplicate or awkward snippets.
- Aligning layout with global settings avoids conflicting defaults (e.g. site.json vs settings.json).

**Alternatives considered**:
- **First paragraph as description**: Possible but requires stripping HTML and length limits; deferred.
- **Required description per page**: Would force every page to have frontmatter description; global default is more maintainable for small sites.
- **No default**: Would leave some pages without a meta description and fail FR-004.

**References**:
- Google: Meta description: https://developers.google.com/search/docs/appearance/snippet  
- Constitution: defaultSEO in Content Model  

---

## Summary Table

| Topic | Decision | Rationale |
|-------|----------|------------|
| Sitemap | Build-time XML from Eleventy collections; single file at root; sitemap index only if >50k URLs | Static, standards-compliant, no extra runtime |
| Google submission | Search Console sitemap submission + robots.txt with Sitemap line; document in docs/ | Standard, free, repeatable |
| robots.txt | Root file; Allow /; Sitemap URL; optional Disallow only for non-index paths | Discovery + optional exclusions |
| Meta fallback | Page description → global defaultSEO.description (or site.defaultDescription) | Every page has a snippet; simple |
