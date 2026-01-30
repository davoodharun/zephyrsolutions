# Implementation Plan: Site Discovery & SEO

**Branch**: `004-site-discovery-seo` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-site-discovery-seo/spec.md`

## Summary

Implement site discovery and search-engine optimization so the site can be submitted to Google, is indexable via a valid sitemap, and presents consistent meta title and description on every public page. Technical approach: generate `sitemap.xml` and `robots.txt` at build time with Eleventy; ensure base layout uses per-page or global default metadata; document Google Search Console submission and optional indexing APIs.

## Technical Context

**Language/Version**: JavaScript (Node) — existing Eleventy 11ty project  
**Primary Dependencies**: Eleventy (existing), no new runtime dependencies required for sitemap/robots generation  
**Storage**: N/A (static build output; submission state is external in Google Search Console)  
**Testing**: Manual validation (sitemap validators, Search Console URL inspection); optional smoke test that sitemap and robots are present and valid after build  
**Target Platform**: Static host (existing; e.g. Cloudflare Pages, GitHub Pages)  
**Project Type**: Web — single static site; existing structure under `src/`, `content/`, `public/`  
**Performance Goals**: Sitemap and robots are static files; no runtime impact  
**Constraints**: Sitemap must conform to standard XML format (e.g. 50k URLs per sitemap, 50k sitemaps per index); metadata must be in HTML head for crawlers  
**Scale/Scope**: Single primary domain; finite public pages (pages, portfolio, health-check, skills, etc.); sitemap index only if page count exceeds single-sitemap limits

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle / Rule | Requirement | This Feature |
|------------------|-------------|--------------|
| **URL & SEO Rules** | URLs lowercase, kebab-case, stable; canonical to primary domain | No URL changes; canonical already in base layout; this feature adds sitemap + robots and reinforces metadata. |
| **URL & SEO Rules** | Every page: meta title + meta description (defaultable), Open Graph image (defaultable) | FR-003, FR-004: ensure every public page has title + description (page or global default); OG image remains defaultable per constitution. |
| **URL & SEO Rules** | Generate sitemap.xml and robots.txt | FR-002: generate sitemap listing public indexable pages; add robots.txt that references sitemap and allows crawlers for public content. |
| **Minimize JavaScript** | Default static HTML, minimal JS | No new client-side JS; sitemap/robots are build-time outputs. |
| **Content model** | defaultSEO: title, description, ogImage | Use existing `content/global/settings.json` defaultSEO (or equivalent) for fallback title/description. |

**Result**: No violations. This feature implements and reinforces constitution URL & SEO rules.

## Project Structure

### Documentation (this feature)

```text
specs/004-site-discovery-seo/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── sitemap-format.md
│   └── metadata-robots.md
└── tasks.md             # Phase 2 output (/speckit.tasks — not created by plan)
```

### Source Code (repository root)

No new top-level apps or packages. Changes are confined to existing Eleventy site:

```text
.eleventy.js                    # Add sitemap + robots generation (or use plugin/config)
content/global/settings.json    # Already has primaryDomain, defaultSEO
src/_includes/layouts/base.njk  # Already has title, description, canonical; ensure default from globalSettings.defaultSEO
src/_data/site.json             # Already has defaultDescription; align with defaultSEO if needed
_site/                          # Build output: sitemap.xml, robots.txt at root
docs/                           # Add or update: Google submission runbook (sitemap URL, Search Console)
```

**Structure Decision**: Single static site. Sitemap and robots are generated at build time into `_site/`. Metadata is supplied by layout from page frontmatter or global defaults. Submission is documented in `docs/` and performed manually or via Search Console/API outside the repo.

## Complexity Tracking

> Not used — no constitution violations to justify.
