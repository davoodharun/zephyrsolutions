# Feature Specification: Flywheel Posts as Site Pages

**Feature Branch**: `005-flywheel-posts-pages`  
**Created**: 2026-01-28  
**Status**: Draft  
**Input**: User description: "update flywheel workflow to generate an additional content for a post that will also be published to /posts as pages on the site"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generated Posts Appear as Site Pages (Priority: P1)

As the consultant, when I generate content for a post via the flywheel workflow, I want that post to be published as a page on the site (e.g. under /posts) so that visitors can find and read it without any extra manual step.

**Why this priority**: The main value is that flywheel-generated post content becomes visible on the site; without it, posts stay as drafts or internal files only.

**Independent Test**: Run the flywheel workflow for a topic that includes the post (blog) asset type; after the generated content is merged and deployed, open the site and confirm the post is available at the designated /posts URL and displays the full content with correct title and metadata.

**Acceptance Scenarios**:

1. **Given** the flywheel workflow has generated a post for a topic, **When** the generated content is merged and the site is built/deployed, **Then** the post is available as a page on the site at a stable URL under /posts (or the site’s designated post path).
2. **Given** a visitor navigates to the post page, **When** they view it, **Then** they see the full post content (title, body, and any metadata such as date) in the same style as other site pages.
3. **Given** multiple posts have been generated and merged, **When** a visitor browses the site, **Then** each post has its own page at a distinct, stable URL so they can be linked and indexed.

---

### User Story 2 - Post Pages Are Findable and Consistent (Priority: P2)

As the consultant and as a visitor, I want post pages to have consistent URLs, metadata (e.g. title, description, date), and optional listing (e.g. a posts index) so that posts are findable and fit the rest of the site.

**Why this priority**: Findability and consistency improve trust and SEO; listing is optional but improves discovery.

**Independent Test**: Confirm that each post page has a unique, human-readable URL (e.g. /posts/YYYY-MM-DD-slug or /posts/slug), that metadata (title, description where applicable) is present for display and search, and that a posts index page exists and links to post pages if the site design includes one.

**Acceptance Scenarios**:

1. **Given** a generated post, **When** it is published as a site page, **Then** its URL follows a consistent pattern (e.g. date and slug) and does not conflict with other posts.
2. **Given** a post page, **When** it is rendered, **Then** it has the necessary metadata (at least title and date) for display and for search engines (e.g. meta title and description).
3. **Given** the site includes a posts index or listing, **When** a visitor opens it, **Then** it lists generated posts (and any existing posts) with links to their pages so visitors can discover them.

---

### Edge Cases

- What happens when the flywheel generates a post with the same slug or date as an existing post? The system should avoid overwriting arbitrarily; use a unique URL (e.g. disambiguate by slug or timestamp) or define a single source of truth (e.g. last write wins) and document it.
- What happens when a post is generated but the site build or deploy fails? The workflow should treat “write post file” and “site build/deploy” consistently (e.g. post file is written in the same run that opens the PR; deploy happens on merge); failures are visible in the normal CI/deploy pipeline.
- What if the consultant does not want a particular post to appear on the site? The system should support excluding a post from publication (e.g. draft flag or omit from /posts) while still keeping the file for other uses; document the rule.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The flywheel workflow MUST produce post content (e.g. blog/post asset type) that is suitable for publication as a page on the site, with at least title, body, and date (or equivalent metadata).
- **FR-002**: Each generated post that is intended for publication MUST be published as a page on the site at a URL under /posts (or the site’s designated path for posts), so that visitors can open it and read the full content.
- **FR-003**: Each post page MUST have a stable, unique URL that follows a defined pattern (e.g. /posts/YYYY-MM-DD-slug or /posts/slug) and MUST not conflict with other post URLs.
- **FR-004**: Each post page MUST expose at least title and date (and, where the site supports it, a short description) for display and for search engines (e.g. meta title and meta description).
- **FR-005**: The workflow MUST NOT require a separate manual step to “publish” the post to the site; generating the post content and making it available as a page MUST be part of the same flow (e.g. writing the post file in the repo and building the site from that file so the page appears after merge and deploy).
- **FR-006**: If the site provides a posts index or listing page, it MUST include generated posts (and any other posts in the same source) so visitors can discover them; if no index exists, this requirement is satisfied by having each post reachable at its own URL.

### Key Entities

- **Post (content)**: The flywheel-generated post asset: title, body, date, slug (or equivalent identifiers), and optional metadata (e.g. description, topic).
- **Post page**: The site page that displays one post, available at a stable URL under /posts (or the site’s post path), with rendered content and metadata.
- **Posts listing**: Optional index or listing page that links to individual post pages for discovery.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of posts generated by the flywheel workflow (and merged) are available as site pages at a URL under /posts (or the designated path) within one build/deploy cycle after merge.
- **SC-002**: A visitor can open a post URL and see the full post content (title and body, and date where shown) without errors or missing data.
- **SC-003**: Post URLs are unique and stable (no duplicate URLs for different posts); URL pattern is consistent and documented.
- **SC-004**: If a posts index exists, it lists all published posts (including flywheel-generated ones) with correct links; if no index exists, success is measured by individual post URLs being reachable.

## Assumptions

- “Post” means the blog/post content type produced by the existing content flywheel (e.g. the asset type written to content/posts/ or equivalent). The update extends the flywheel/site behavior so that this content is published as pages at /posts.
- The site is built from the same repository that the flywheel writes to; “publish” means the post file is in the repo and the site build includes it so that the page appears after merge and deploy.
- The site may or may not already have a posts collection or /posts URL structure; this feature specifies that generated posts are published as pages at /posts (or the site’s chosen path) and have stable URLs and metadata.
- No change to the flywheel’s topic suggestion or other asset types (LinkedIn, email, one-pager, etc.) is required for this feature; only the post/blog output and its publication as site pages are in scope.
- Optional: A post may be marked as draft or excluded from publication; the exact mechanism (e.g. frontmatter flag) can be defined in the technical plan.
