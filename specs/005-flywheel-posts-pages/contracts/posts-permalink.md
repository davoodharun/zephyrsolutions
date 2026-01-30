# Contract: Posts URL and Permalink

**Feature**: 005-flywheel-posts-pages  
**Date**: 2026-01-28

## Purpose

Define the URL pattern and permalink rules for post pages so that flywheel-generated posts are published at stable, unique URLs under /posts.

## URL pattern

- **Path**: `/posts/{{ fileSlug }}/`
- **fileSlug**: Eleventy’s page.fileSlug for the source file (filename without extension). For `content/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits.md`, fileSlug is `2026-01-30-harnessing-cloud-solutions-for-nonprofits`, so URL is `/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/`.
- **Trailing slash**: Use trailing slash for consistency with other site pages (e.g. /health-check/, /skills/).

## Permalink configuration

- **Where**: Directory data file `content/posts/posts.json` (or equivalent) so all files in `content/posts/` get the same permalink pattern without editing each file.
- **Content**: Set `permalink: "/posts/{{ page.fileSlug }}/"` and `layout: "layouts/post"` (or `layouts/base`) so that:
  1. Every markdown file under `content/posts/` is rendered at `/posts/<fileSlug>/`.
  2. The same layout is used for all posts (post layout or base).

## Uniqueness and conflicts

- **Unique URLs**: Each post file has a unique filename (YYYY-MM-DD-slug.md). The flywheel uses date and slug in the filename; duplicate date+slug would overwrite the file in the same run. If the flywheel or a human adds a file with the same filename as an existing post, the build will produce two outputs with the same permalink (last write wins in Eleventy). Avoid duplicate filenames; document in flywheel/content-flywheel that each post file must have a unique name.
- **Draft posts**: Posts with `draft: true` in frontmatter are excluded from the posts collection and are not rendered; no URL is generated for them.
- **Slug changes**: If a post’s filename (or slug) is changed, the old URL will 404 unless a redirect is added. Document 301 redirect strategy for slug changes per constitution if needed.

## Canonical and SEO

- **Canonical**: Post pages use the same base layout as the rest of the site; canonical URL is primary domain + page URL (e.g. `https://zephyrsolutions.com/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/`).
- **Sitemap**: Non-draft posts are included in the indexable collection (004-site-discovery-seo) and appear in sitemap.xml.
- **Meta**: Title and description from post frontmatter or layout default; noindex applied when post has `noindex: true` in frontmatter.

## Flywheel alignment

- **No change to flywheel output path**: The content flywheel continues to write post files to `content/posts/YYYY-MM-DD-<slug>.md`. This contract only defines how the site build interprets those files (permalink and layout). No workflow or API change is required for the flywheel to “publish to /posts”—the site build does that when it includes the posts collection and permalink.
