# LinkedIn Post Automation

When content under `content/linkedin/` is merged to `main`, a GitHub Action publishes each new or updated post to LinkedIn (with an image when available). This doc covers how images are found and how to set up the LinkedIn app and secrets.

## Finding images for a post

Posts and images are associated by **date and slug** in filenames. For a post file like `content/linkedin/2026-01-29-cybersecurity-basics-educational.md`:

- **Date**: `2026-01-29` (from the first three filename segments).
- **Slug**: `cybersecurity-basics` (the middle part before the variant, e.g. `educational`).
- **Image path**: `public/images/content-flywheel/2026-01-29-cybersecurity-basics-social.png` (prefer **social**; fallback: hero, then inline).

Same date+slug in both = same topic/post. See **File path conventions** and **Image and post association** in [Content Flywheel](content-flywheel.md) for the full convention.

## Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `LINKEDIN_CLIENT_ID` | LinkedIn app Client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn app Client Secret |
| `LINKEDIN_REFRESH_TOKEN` | OAuth 2.0 refresh token for the member account that will post (or a long-lived access token) |

The workflow passes these as environment variables to the publish script. The script never logs token values (FR-007).

## LinkedIn app setup

1. **Create an app** in the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
2. **OAuth 2.0**: Use the Authorization Code flow to get an access token and (if available) a refresh token for the member who will post.
3. **Scopes**: Request `w_member_social` for posting on behalf of a member. For image uploads, ensure any scope required by the Assets API (e.g. for feed share images) is included per [LinkedIn’s docs](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/vector-asset-api).
4. **Tokens**: Store the refresh token (or long-lived access token) in `LINKEDIN_REFRESH_TOKEN`. Access tokens typically last 60 days; refresh when needed via the OAuth refresh endpoint.

See [Quickstart: LinkedIn Post Automation](../specs/001-linkedin-automation/quickstart.md) for the happy path and [contracts/linkedin-api-usage.md](../specs/001-linkedin-automation/contracts/linkedin-api-usage.md) for the publish flow.

## Idempotency

Publishing is **idempotent**: re-running the workflow does not create duplicate LinkedIn posts.

- **State file**: `content/linkedin/.published.json` records which post file path was published and at which commit.
- **Skip rule**: If a post path is already in the state for the current (or previous) commit, that post is skipped.
- The workflow only considers `content/linkedin/*.md` files as posts; changes to `.published.json` alone do not trigger a new publish run for “posts,” and the workflow does not commit when only the state file changed in the push.

## Re-running the workflow

- **Manual re-run**: In the Actions tab, re-run the “LinkedIn Publish” workflow. Already-published posts (present in `.published.json`) are skipped; only new or previously failed posts are published.
- **After fixing the script**: Re-run the job; idempotency ensures no duplicate posts.
- **Token refresh**: If LinkedIn auth fails, refresh the member’s token and update `LINKEDIN_REFRESH_TOKEN`, then re-run.
