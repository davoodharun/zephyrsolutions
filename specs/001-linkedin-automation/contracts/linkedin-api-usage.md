# Contract: LinkedIn API Usage (Publish Flow)

**Feature**: 001-linkedin-automation

## Authentication

- **Method**: OAuth 2.0; member token (post on behalf of a person or organization).
- **Secrets** (stored in GitHub Secrets, not in repo):
  - `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET` (LinkedIn app credentials).
  - `LINKEDIN_REFRESH_TOKEN` (or long-lived access token) for the member account that will post.
  - **Company page** (optional): `LINKEDIN_ORGANIZATION_ID` (numeric) or `LINKEDIN_ORGANIZATION_URN` (`urn:li:organization:{id}`). When set, posts publish to the organization; otherwise to the member’s personal profile.
- **Scopes**: `w_member_social` (personal); `w_organization_social` (company page; requires Advertising API product). Images API used for image upload with same token.

## Flow (per post)

1. **Resolve author**: If `LINKEDIN_ORGANIZATION_ID` or `LINKEDIN_ORGANIZATION_URN` is set, use organization URN as author; else get person URN from userinfo/me.
2. **Resolve image**: From post file path/frontmatter, derive date and slug; look for image at `public/images/content-flywheel/YYYY-MM-DD-<slug>-social.png` (fallback: hero, then inline). If none, publish without image (FR-006).
3. **Obtain access token**: Use refresh token to get a valid access token (if using refresh flow).
4. **Upload image** (when image present): Use LinkedIn Images API — initializeUpload with author as owner, upload image binary (PNG), obtain image URN.
5. **Create post**: POST to rest/posts (Posts API) with:
   - `author`: person URN or organization URN
   - `lifecycleState`: `PUBLISHED`
   - `visibility`: `PUBLIC`
   - `commentary`: post text (from markdown body, stripped/sanitized)
   - `content.media`: when image present, image URN from Images API
6. **Record success**: Update publish state (e.g. mark post file as published at this commit) so re-runs skip.

## Error handling

- **Auth failure**: Fail workflow; log “LinkedIn auth failed”; do not expose tokens in logs.
- **Rate limit (429)**: Retry with backoff or fail with clear message; report in workflow status.
- **Content rejection (4xx)**: Fail the post; log response; continue with other posts if multiple.
- **Network/5xx**: Retry once or fail; report in workflow status (FR-007).

## Idempotency

- Before creating a post, check publish state (or LinkedIn) to avoid duplicate. Prefer repo-based state (post path + commit or content hash) to avoid extra API calls.
