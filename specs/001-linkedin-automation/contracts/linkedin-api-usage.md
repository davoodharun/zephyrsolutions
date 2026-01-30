# Contract: LinkedIn API Usage (Publish Flow)

**Feature**: 001-linkedin-automation

## Authentication

- **Method**: OAuth 2.0; member token (post on behalf of a person).
- **Secrets** (stored in GitHub Secrets, not in repo):
  - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` (LinkedIn app credentials).
  - `LINKEDIN_REFRESH_TOKEN` (or long-lived access token) for the member account that will post.
- **Scopes**: `w_member_social`; plus any scope required for Assets API (image upload) per LinkedIn docs.

## Flow (per post)

1. **Resolve image**: From post file path/frontmatter, derive date and slug; look for image at `public/images/content-flywheel/YYYY-MM-DD-<slug>-social.png` (fallback: hero, then inline). If none, publish without image (FR-006).
2. **Obtain access token**: Use refresh token to get a valid access token (if using refresh flow).
3. **Upload image** (when image present): Use LinkedIn Assets API — register upload (recipe `urn:li:digitalmediaRecipe:feedshare-image`), upload image binary (JPEG/PNG), obtain asset URN.
4. **Create UGC post**: POST to UGC Post API with:
   - `author`: person URN
   - `lifecycleState`: `PUBLISHED`
   - `visibility`: `PUBLIC` or `CONNECTIONS` (configurable)
   - `specificContent.shareCommentary`: post text (from markdown body, stripped/sanitized)
   - `specificContent.shareMediaCategory`: `IMAGE` when image present
   - `specificContent.media`: array with uploaded asset reference when image present
5. **Record success**: Update publish state (e.g. mark post file as published at this commit) so re-runs skip.

## Error handling

- **Auth failure**: Fail workflow; log “LinkedIn auth failed”; do not expose tokens in logs.
- **Rate limit (429)**: Retry with backoff or fail with clear message; report in workflow status.
- **Content rejection (4xx)**: Fail the post; log response; continue with other posts if multiple.
- **Network/5xx**: Retry once or fail; report in workflow status (FR-007).

## Idempotency

- Before creating a post, check publish state (or LinkedIn) to avoid duplicate. Prefer repo-based state (post path + commit or content hash) to avoid extra API calls.
