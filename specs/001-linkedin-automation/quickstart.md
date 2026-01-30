# Quickstart: LinkedIn Post Automation

**Feature**: 001-linkedin-automation

## Prerequisites

- LinkedIn developer app with OAuth 2.0 (client ID, client secret).
- Member token (refresh token or long-lived access token) for the account that will post, with `w_member_social` (and any Assets API scopes).
- GitHub repo with Content Flywheel already producing `content/linkedin/*.md` and `public/images/content-flywheel/YYYY-MM-DD-<slug>-*.png`.

## Setup

1. **Secrets**: In repo **Settings → Secrets and variables → Actions**, add:
   - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REFRESH_TOKEN` (or access token).
2. **Workflow**: Ensure `.github/workflows/linkedin-publish.yml` exists and is triggered on push to main with `paths: ['content/linkedin/**']`.
3. **Docs**: See `docs/linkedin-automation.md` for app creation, scopes, and token refresh (when implemented).

## Happy path

1. Run Content Flywheel; merge the PR. That adds/updates files under `content/linkedin/` and `public/images/content-flywheel/`.
2. Push to main triggers the LinkedIn publish workflow.
3. Workflow detects new/updated posts under `content/linkedin/`, resolves image per post (date+slug → `-social.png`), uploads image (if present), creates UGC post on LinkedIn.
4. Success: post visible on LinkedIn with image (or text-only if no image). Failure: workflow logs and status show which post failed and why.

## Resolving “which image for this post?”

- Post file: `content/linkedin/2026-01-29-cybersecurity-basics-educational.md` → date `2026-01-29`, slug `cybersecurity-basics` (from filename or frontmatter).
- Image: `public/images/content-flywheel/2026-01-29-cybersecurity-basics-social.png` (prefer social; else hero or inline).
- Same date+slug in both = same topic/post.

## Idempotency

- Re-running the workflow (e.g. after fixing a script) must not post the same content again. State file (e.g. `content/linkedin/.published.json`) records which post path + commit was published; skip if already published.

## Validation

To confirm the publish flow:

1. Add the three GitHub Secrets (LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, LINKEDIN_REFRESH_TOKEN) per Setup above.
2. Run Content Flywheel and merge the PR so that `content/linkedin/*.md` (and optionally `public/images/content-flywheel/*.png`) exist.
3. After merge to main, the LinkedIn Publish workflow runs. Check **Actions → LinkedIn Publish** for success; the post (with image when present) should appear on LinkedIn.
4. Re-run the workflow manually; it should skip already-published posts (no duplicate posts).
5. See `docs/linkedin-automation.md` for troubleshooting (auth, rate limits, re-running).
