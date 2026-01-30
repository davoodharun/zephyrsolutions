# Research: LinkedIn Post Automation

**Feature**: 001-linkedin-automation | **Date**: 2026-01-29

## 1. LinkedIn API for posting with image

**Decision**: Use LinkedIn **UGC Post API** to create a post and **Assets API** (register upload → upload binary → reference asset) for the image. OAuth 2.0 with `w_member_social` (and required marketing scopes if using Assets API) via a LinkedIn developer app.

**Rationale**:
- UGC Post API is the supported way to create shares with image content.
- Image must be uploaded first via Assets API (or Vector Asset API); then the UGC post references the asset URN.
- Flow: obtain access token (client credentials or member token) → register upload (recipe `urn:li:digitalmediaRecipe:feedshare-image`) → upload image (JPEG/PNG) → create UGC post with `shareMediaCategory: IMAGE` and `media` array containing the asset.

**Alternatives considered**:
- Share URL (no image): Simpler but does not meet “post with image” requirement.
- Posts API (newer): May replace UGC in future; for now UGC Post + Assets is the documented path for image posts.

**References**: Microsoft Learn – UGC Post API, Vector Assets API / Assets API for image upload; LinkedIn developer app setup (OAuth, scopes).

---

## 2. Image path convention (topic/post association)

**Decision**: Use **existing naming convention** for association: flywheel images remain in `public/images/content-flywheel/` with names `YYYY-MM-DD-<slug>-hero.png`, `-social.png`, `-inline.png`. LinkedIn posts in `content/linkedin/` use the same date and slug in filenames (e.g. `YYYY-MM-DD-<slug>-educational.md`). Association is by matching date + slug. Prefer **social** image for LinkedIn (square) when publishing. Document this convention in `docs/content-flywheel.md` and `docs/linkedin-automation.md` so “images for post X” is resolvable in &lt;1 minute (SC-001).

**Rationale**:
- Avoids large refactor of content-flywheel workflow and keeps a single source of truth for generated images.
- Date + slug already uniquely ties flywheel output (posts + images) to a topic run; no new folder structure required.
- If we later want topic-scoped folders (e.g. `content/flywheel/YYYY-MM-DD-slug/images/`), that can be a separate change; current convention satisfies FR-001 and FR-002.

**Alternatives considered**:
- Topic-scoped folder under `content/` (e.g. `content/flywheel/<date>-<slug>/images/`): Clearer for “content that belongs together” but requires changing content-flywheel workflow and possibly Eleventy/public paths; deferred.
- Separate “registry” file mapping post → image paths: Adds maintenance and sync; naming convention is sufficient.

---

## 3. Idempotency / duplicate posts

**Decision**: Track published posts (e.g. by storing post identifier + commit or “published at” in a small state file in repo, or using LinkedIn API to list recent posts and skip if same content already exists). Prefer **lightweight state in repo** (e.g. `content/linkedin/.published.json` or a branch/file listing last published commit per path) so re-runs of the workflow do not create duplicate LinkedIn posts.

**Rationale**:
- Re-running the publish workflow (e.g. after fix) must not post the same content again (SC-004, FR-008).
- Storing “this file was published at commit X” allows skip when file unchanged or already published; alternatively check LinkedIn for recent post with same commentary (fragile). Repo-based state is simple and auditable.

**Alternatives considered**:
- No state, always post: Would create duplicates on re-run.
- LinkedIn-only check: Possible but depends on API (list posts, compare); more complex and rate-limited.

---

## 4. Workflow trigger and scope

**Decision**: Trigger the LinkedIn publish workflow on **push to main** when the push includes changes under `content/linkedin/`. Use `paths` filter so the workflow runs only when LinkedIn content (or optionally the chosen image path) changes. Publish **each new or updated** markdown file under `content/linkedin/` (one LinkedIn post per file); for each, resolve image by date+slug and attach when available (FR-006: publish without image or fallback if none).

**Rationale**:
- Merge to main = approved content; publishing only on merge aligns with “preview before publish” (PR is preview).
- Path filter avoids unnecessary runs. One post per file keeps mapping simple and supports multiple posts per PR.

---

## 5. Authentication (LinkedIn app)

**Decision**: Use **OAuth 2.0** with a LinkedIn developer app. Prefer **member token** (post on behalf of a person) stored as a long-lived or refresh token in GitHub Secrets, so the workflow can act as “the organization’s LinkedIn account” without interactive login on each run. Store client ID, client secret, and refresh token (or access token) in GitHub Secrets; document app creation and scope requirements in `docs/linkedin-automation.md`.

**Rationale**:
- UGC Post API requires an author (person URN); that implies member-level token for “post as this user.”
- Client credentials alone are not sufficient for creating member UGC posts; a user must authorize the app once; then refresh token can be used in CI.

**Alternatives considered**:
- Service account: LinkedIn does not offer service accounts for posting as a company page in the same way; member token is the standard approach for “post as person.”
