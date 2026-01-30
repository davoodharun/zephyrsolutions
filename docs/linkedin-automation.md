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

**Option A – Access token (recommended when LinkedIn does not return a refresh token)**  
Many LinkedIn apps only return an access token (no refresh token). Use the access token directly:

| Secret | Description |
|--------|-------------|
| `LINKEDIN_ACCESS_TOKEN` | OAuth 2.0 access token from the get-token script. Valid ~60 days; then re-run `npm run linkedin:get-token` and update this secret. |

**Option B – Refresh token**  
If your app returns a refresh token when you run the get-token script:

| Secret | Description |
|--------|-------------|
| `LINKEDIN_CLIENT_ID` | LinkedIn app Client ID |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn app Client Secret |
| `LINKEDIN_REFRESH_TOKEN` | OAuth 2.0 refresh token for the member account that will post |

The workflow uses **Option A** when `LINKEDIN_ACCESS_TOKEN` is set; otherwise it uses **Option B**. The script never logs token values (FR-007).

## LinkedIn app setup

1. **Create an app** in the [LinkedIn Developer Portal](https://www.linkedin.com/developers/apps).
2. **Auth**: In the app’s **Auth** tab, add a **Redirect URL**: `http://localhost:8080/callback`.
3. **Products**: Under Products, add **Sign In with LinkedIn using OpenID Connect** (or the product that grants `w_member_social`).
4. **Scopes**: Request `w_member_social` for posting on behalf of a member. For image uploads, ensure any scope required by the Assets API is included per [LinkedIn’s docs](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/vector-asset-api).
5. **Get a refresh token** (one-time): Run the helper script so LinkedIn redirects back to your machine and the script prints the refresh token:
   ```bash
   export LINKEDIN_CLIENT_ID="your_client_id"
   export LINKEDIN_CLIENT_SECRET="your_client_secret"
   npm run linkedin:get-token
   ```
   Or: `node scripts/get-linkedin-refresh-token.mjs` with those env vars set. The script opens a browser; you sign in and approve; it prints **LINKEDIN_REFRESH_TOKEN** for you to copy into GitHub Secrets.
6. **Tokens**: Store the printed refresh token in GitHub Secret `LINKEDIN_REFRESH_TOKEN`. Access tokens typically last 60 days; the workflow uses the refresh token to get new access tokens when needed.

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
