# Quickstart: Flywheel Posts as Site Pages

**Feature**: 005-flywheel-posts-pages  
**Date**: 2026-01-28

## Overview

This guide describes how to implement and verify flywheel posts as site pages: posts collection, permalink /posts/, layout and metadata, optional index, and sitemap inclusion. No change to the flywheel workflow file paths; only the site build is updated.

## 1. Add posts collection and permalink

**Goal**: Content in `content/posts/*.md` is rendered as pages at `/posts/<fileSlug>/`.

**Steps**:

1. **Directory data**: Create `content/posts/posts.json` (or merge into existing directory data if present) with:
   - `layout`: `layouts/post` or `layouts/base`
   - `permalink`: `/posts/{{ page.fileSlug }}/`
   So every markdown file in `content/posts/` gets this layout and URL.

2. **Posts collection**: In `.eleventy.js`, add a collection for posts, e.g.:
   - `eleventyConfig.addCollection("posts", function(collectionApi) { return collectionApi.getFilteredByGlob("content/posts/*.md").filter(p => !p.data.draft); });`
   Use this collection for the optional posts index and for any listing; exclude draft so draft posts are not rendered and not listed.

3. **Verification**: Run build; open `_site/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/index.html` (or the fileSlug of an existing post). Confirm the URL in the browser is `/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/` (or with pathPrefix if applicable).

## 2. Post layout and metadata

**Goal**: Post pages use the base layout (or a thin post layout that extends base) and have non-empty title and meta description.

**Steps**:

1. **Layout**: Ensure posts use a layout that includes the base layout’s head (title, meta description, canonical). Either set `layout: layouts/base` in directory data for posts, or create `src/_includes/layouts/post.njk` that sets `layout: layouts/base` and wraps `{{ content | safe }}` in an `<article>` and optionally shows date and a “Back to posts” link.

2. **Title**: Base layout already uses `title` from page data; post frontmatter provides `title`. If a post has no title, add a fallback in the layout (e.g. site name only).

3. **Description**: Base layout already uses `description | default(globalSettings.defaultSEO.description) | default(site.defaultDescription)`. Ensure posts pass `description` from frontmatter (or leave empty to use default). Flywheel can optionally add a `description` field to post frontmatter for better snippets.

4. **Verification**: View source on a post page; confirm `<title>` and `<meta name="description">` are present and non-empty. Check canonical URL.

## 3. Include posts in sitemap (indexable)

**Goal**: Post pages appear in sitemap.xml so search engines can discover them.

**Steps**:

1. **Indexable collection**: In `.eleventy.js`, extend the **indexable** collection (from 004-site-discovery-seo) to include non-draft posts. For example, in the function that builds the indexable collection, add:
   - `const posts = (collectionApi.getFilteredByGlob("content/posts/*.md") || []).filter(p => !p.data.draft && !p.data.noindex);`
   - Include `posts` in the array that is returned (e.g. `return [...pages, ...portfolio, ...posts].filter(...).sort(...)`).

2. **Verification**: Run build; open `_site/sitemap.xml` and confirm post URLs appear (e.g. `https://zephyrsolutions.com/posts/2026-01-30-harnessing-cloud-solutions-for-nonprofits/`).

## 4. Optional: Posts index page at /posts

**Goal**: A page at /posts lists all posts with links to their pages.

**Steps**:

1. **Template**: Create a template for the posts index (e.g. `content/posts/posts-index.md` with permalink `/posts/` and a layout that iterates over `collections.posts`, or a dedicated `posts.njk` with permalink `/posts/`). List posts in reverse chronological order (e.g. sort by date descending); each item: title (link to post URL), date, optional summary.

2. **Conflict**: If the index is a markdown file inside `content/posts/`, ensure it does not get the same permalink as a post (e.g. use a different filename like `index.md` with permalink `/posts/` and ensure the collection used for listing excludes this file, or put the index template outside `content/posts/` and set permalink to `/posts/`). Eleventy directory data applies to all files in the folder; an `index.md` in `content/posts/` would get permalink `/posts/index/` unless overridden. Prefer a single `content/posts/index.md` with frontmatter `permalink: /posts/` and `layout: layouts/posts-index` (or similar) so the index is at /posts/ and individual posts remain at /posts/<fileSlug>/.

3. **Verification**: Open /posts/ in the browser; confirm the list shows all non-draft posts with correct links.

## 5. Draft and noindex

**Goal**: Draft posts are not rendered; noindex posts are rendered but carry noindex meta.

**Steps**:

1. **Draft**: In the posts collection, filter out items where `p.data.draft === true`. Do not add draft posts to the indexable collection. No further change needed; they simply have no URL.

2. **Noindex**: Base layout already outputs `<meta name="robots" content="noindex, nofollow">` when `noindex` or `page.data.noindex` is set. Ensure post pages use that layout so frontmatter `noindex: true` is respected. Optionally exclude noindex posts from the indexable collection so they do not appear in the sitemap (research recommends including them in indexable only if we want them in sitemap; for noindex, excluding from sitemap is also valid—decide in implementation).

3. **Verification**: Add `draft: true` to a post’s frontmatter; rebuild; confirm that post has no URL under _site/posts/. Remove draft and add `noindex: true`; confirm the post page exists and view source shows noindex meta.

## Summary

| Deliverable | Location | How |
|-------------|----------|-----|
| Posts collection | .eleventy.js | addCollection("posts", …) from content/posts/*.md, filter draft |
| Permalink /posts/ | content/posts/posts.json | permalink: "/posts/{{ page.fileSlug }}/", layout |
| Post layout | src/_includes/layouts/post.njk (optional) | Extend base; article + date + content |
| Indexable includes posts | .eleventy.js | Add non-draft posts to indexable collection |
| Posts index (optional) | content/posts/index.md or template | permalink /posts/, list collections.posts |
