# Quickstart: Site Discovery & SEO

**Feature**: 004-site-discovery-seo  
**Date**: 2026-01-28

## Overview

This guide describes how to implement and verify site discovery and SEO: sitemap and robots.txt generation, page metadata, and Google submission. No new runtime services; all outputs are build-time.

## 1. Generate sitemap.xml

**Goal**: Emit a valid `sitemap.xml` at site root listing all public, indexable URLs.

**Options**:

- **Option A — Eleventy template**: Add a template (e.g. `sitemap.xml.njk` or `sitemap.njk`) that uses the Nunjucks `xml` filter or raw XML. Set `permalink: "/sitemap.xml"`. Inside the template, iterate over a global data array or collection that supplies URL entries (e.g. from `collections.all` filtered to public pages). Each entry: `<loc>{primaryDomain}{url}</loc>`, optional `<lastmod>`, `<changefreq>`, `<priority>`. Output must be valid XML (escape ampersands, etc.).
- **Option B — Eleventy plugin**: Use a community plugin (e.g. `@quasibit/eleventy-plugin-sitemap`) configured with `primaryDomain` and inclusion/exclusion rules. Ensure it excludes draft and noindex pages.

**Inclusion**: Include all pages from `collections.pages`, `collections.portfolio` (non-draft), and any other public standalone pages (e.g. health-check, skills). Exclude draft, noindex, and non-HTML URLs.

**Verification**: After `npm run build` (or equivalent), open `_site/sitemap.xml` and validate with an XML sitemap validator. Confirm every `<loc>` uses the primary domain and returns 200 when requested.

## 2. Generate robots.txt

**Goal**: Emit `robots.txt` at site root with `User-agent: *`, allow public crawling, and `Sitemap: {absolute URL}`.

**Options**:

- **Option A — Static file**: Add `robots.txt` in a folder that is copied to root (e.g. `public/robots.txt`) with placeholder for the sitemap URL; replace at build time with a filter or script that injects `primaryDomain`, or keep a single production URL if preview robots are not required.
- **Option B — Template**: Add `robots.txt.njk` with `permalink: "/robots.txt"` and content like:
  - `User-agent: *`
  - `Allow: /`
  - `Sitemap: {{ globalSettings.primaryDomain }}/sitemap.xml`

**Verification**: After build, open `_site/robots.txt`. Confirm the Sitemap URL is absolute and correct for the primary domain.

## 3. Page metadata (title, description)

**Goal**: Every public page has a unique or appropriate title and a meta description (from frontmatter or global default).

**Layout**: In `src/_includes/layouts/base.njk` (or equivalent):

- **Title**: Use `title` from page data; if missing, use `globalSettings.defaultSEO.title` or `site.siteName`. Ensure no empty `<title>`.
- **Description**: Use `description` from page data; if missing, use `globalSettings.defaultSEO.description` or `site.defaultDescription`. Always output `<meta name="description" content="...">` with non-empty content for public pages.
- **Canonical**: Already present; keep `globalSettings.primaryDomain` + normalized `page.url`.
- **Noindex**: If page has `noindex: true` (or equivalent), output `<meta name="robots" content="noindex, nofollow">`; otherwise omit.

**Content**: Add or review frontmatter `title` and `description` for key entry points (home, health-check, skills, portfolio index). Other pages can rely on global default.

**Verification**: Build site; view source on homepage and 2–3 key pages. Confirm `<title>` and `<meta name="description">` are present and non-empty. Check canonical URL.

## 4. Google submission (runbook)

**Goal**: Site is submitted to Google so it can discover and index the site. Performed outside the build; document in `docs/`.

**Steps** (to document in e.g. `docs/google-submission.md` or a section in `docs/deploy.md`):

1. **Verify property**: In [Google Search Console](https://search.google.com/search-console), add property (domain or URL prefix). Verify via DNS TXT record or HTML file/meta tag as per GSC instructions.
2. **Submit sitemap**: In GSC, open “Sitemaps”, submit `https://{primaryDomain}/sitemap.xml`. Wait for processing.
3. **Optional — URL inspection**: Use “URL inspection” for the homepage or critical URLs and request indexing if immediate crawling is desired.
4. **After domain or host change**: Re-verify if needed; re-submit sitemap; update robots.txt if primary domain changed (rebuild with correct env).

**Verification**: In GSC, confirm sitemap status “Success” and that discovered/indexed counts increase over time (may take days). No critical coverage errors for intended public pages.

## 5. Optional checks

- **Sitemap in robots.txt**: Crawlers can discover the sitemap via `robots.txt`; confirm the Sitemap line is present.
- **Meta description length**: Keep under ~160 characters for snippet display; audit key pages if desired.
- **Noindex pages**: If any page is excluded from sitemap, ensure it has noindex or is not linked from indexable pages so it doesn’t compete in search.

## Summary

| Deliverable | Location | How |
|-------------|----------|-----|
| Sitemap | `_site/sitemap.xml` | Eleventy template or plugin; list public URLs |
| robots.txt | `_site/robots.txt` | Template or static file with Sitemap URL |
| Page metadata | Every HTML page | Layout: title, description (with fallback), canonical, optional noindex |
| Submission runbook | `docs/` | Document GSC verification and sitemap submission |
