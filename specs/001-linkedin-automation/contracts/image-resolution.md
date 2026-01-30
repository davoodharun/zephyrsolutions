# Contract: Image-to-Post Resolution

**Feature**: 001-linkedin-automation

## Input

- Post file path under `content/linkedin/`, e.g. `content/linkedin/2026-01-29-cybersecurity-basics-educational.md`.

## Steps

1. Parse filename to extract **date** and **slug**:
   - Filename pattern: `YYYY-MM-DD-<slug>-<variant>.md` (variant = educational | story | checklist).
   - Split basename (no .md) on `-`: parts = [YYYY, MM, DD, ...slug..., variant].
   - Date = parts[0]-parts[1]-parts[2] (e.g. 2026-01-29).
   - Variant = last part (educational | story | checklist).
   - Slug = join(parts[3..-2], '-') (e.g. `cybersecurity-basics-for-nonprofits` for `2026-01-29-cybersecurity-basics-for-nonprofits-educational.md`).
2. Build image base path: `public/images/content-flywheel/YYYY-MM-DD-<slug>-`.
3. Resolve image in order of preference: **social** (square for LinkedIn), then **hero**, then **inline**:
   - Try `public/images/content-flywheel/YYYY-MM-DD-<slug>-social.png`; if exists, use it.
   - Else try `-hero.png`; if exists, use it.
   - Else try `-inline.png`; if exists, use it.
4. If none exist, post is published without an image (FR-006).

## Output

- Path to image file (or empty if no image found).
