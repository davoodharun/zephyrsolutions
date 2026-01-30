# Data Model: LinkedIn Post Automation

**Feature**: 001-linkedin-automation

No new database or storage backend. Entities are file-based (content and images in Git).

## Entities

### LinkedIn post (content file)

- **Location**: `content/linkedin/<filename>.md`
- **Identity**: Filename encodes date and slug (e.g. `YYYY-MM-DD-<slug>-<variant>.md`); same date+slug as flywheel run.
- **Attributes** (from frontmatter + body):
  - `title`, `date`, `slug`, optional `variant` (educational, story, checklist)
  - Body: markdown used as the LinkedIn post text (after optional stripping of frontmatter / formatting).
- **Relationship**: Associated images are resolved by same `date` + `slug` in `public/images/content-flywheel/` (see Post image).

### Post image

- **Location**: `public/images/content-flywheel/YYYY-MM-DD-<slug>-hero.png`, `-social.png`, `-inline.png`
- **Identity**: Filename encodes date, slug, and format (hero | social | inline).
- **Relationship**: Belongs to the same topic/post as any `content/linkedin/` file with matching date and slug. For LinkedIn publish, prefer **social** (square) when available.

### Topic/post identifier

- **Logical key**: `(date, slug)` — e.g. `2026-01-29`, `cybersecurity-basics-for-nonprofits`.
- **Usage**: Links a LinkedIn post file to its images. Resolved by parsing filenames (post: `content/linkedin/YYYY-MM-DD-<slug>-*.md`; images: `public/images/content-flywheel/YYYY-MM-DD-<slug>-*.png`).

### Publish state (optional, for idempotency)

- **Location**: e.g. `content/linkedin/.published.json` or a small state file in repo.
- **Purpose**: Record which post file (path or commit) was already published so re-runs skip duplicate posts.
- **Attributes**: Map from post file path (or content hash) to “published at” commit or timestamp; optional LinkedIn post URN.

## Validation rules

- Post file must have parseable date and slug from filename (or frontmatter) for image resolution.
- Image resolution: given post filename `YYYY-MM-DD-<slug>-<variant>.md`, look for `public/images/content-flywheel/YYYY-MM-DD-<slug>-social.png` (then hero, then inline) for attachment.
- Publish state: if using state file, update only after successful LinkedIn API response.
