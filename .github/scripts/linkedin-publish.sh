#!/usr/bin/env bash
# Publish LinkedIn posts from content/linkedin/*.md to LinkedIn (Images API + Posts API).
# Usage: linkedin-publish.sh <posts_json_array> <commit_sha>
# Example: linkedin-publish.sh '["content/linkedin/2026-01-29-slug-educational.md"]' abc123
# Target: company page if LINKEDIN_ORGANIZATION_ID or LINKEDIN_ORGANIZATION_URN is set; otherwise personal profile.
# Requires: either LINKEDIN_ACCESS_TOKEN (use directly) or LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET + LINKEDIN_REFRESH_TOKEN (exchange for token).
# Company page: app needs Advertising API (w_organization_social). Set LINKEDIN_ORGANIZATION_ID (numeric) or LINKEDIN_ORGANIZATION_URN (urn:li:organization:123).
# On auth or API failure exits non-zero; does not log tokens (FR-007).

set -euo pipefail
REPO_ROOT="${GITHUB_WORKSPACE:-.}"
STATE_FILE="$REPO_ROOT/content/linkedin/.published.json"
LINKEDIN_TOKEN_URL="https://www.linkedin.com/oauth/v2/accessToken"
LINKEDIN_API_BASE="https://api.linkedin.com"
LINKEDIN_VERSION="202601"  # YYYYMM for rest/images and rest/posts

# --- Helpers ---
log() { echo "[linkedin-publish] $*" >&2; }
err() { echo "[linkedin-publish] ERROR: $*" >&2; }

# Require jq
if ! command -v jq &>/dev/null; then
  err "jq is required"
  exit 1
fi

# Parse args
POSTS_JSON="${1:-[]}"
COMMIT_SHA="${2:-}"
if [ -z "$COMMIT_SHA" ]; then
  err "Usage: $0 <posts_json_array> <commit_sha>"
  exit 1
fi

# Require either access token (use directly) or refresh token + client credentials (exchange for token)
if [ -n "${LINKEDIN_ACCESS_TOKEN:-}" ]; then
  : # Use LINKEDIN_ACCESS_TOKEN directly; no client_id/secret/refresh needed
elif [ -z "${LINKEDIN_CLIENT_ID:-}" ] || [ -z "${LINKEDIN_CLIENT_SECRET:-}" ] || [ -z "${LINKEDIN_REFRESH_TOKEN:-}" ]; then
  err "LinkedIn auth failed: set LINKEDIN_ACCESS_TOKEN, or set LINKEDIN_CLIENT_ID, LINKEDIN_CLIENT_SECRET, and LINKEDIN_REFRESH_TOKEN"
  exit 1
fi

# Ensure state file exists
mkdir -p "$(dirname "$STATE_FILE")"
if [ ! -f "$STATE_FILE" ]; then
  echo '{}' > "$STATE_FILE"
fi

# --- Resolve image path for a post file (per contracts/image-resolution.md) ---
# Input: post path e.g. content/linkedin/2026-01-29-cybersecurity-basics-educational.md
# Output: path to image file or empty
resolve_image() {
  local post_path="$1"
  local base name parts variant slug date base_path n rest
  base="${post_path##*/}"
  name="${base%.md}"
  IFS='-' read -ra parts <<< "$name"
  n=${#parts[@]}
  if [ "$n" -lt 4 ]; then
    echo ""
    return
  fi
  date="${parts[0]}-${parts[1]}-${parts[2]}"
  variant="${parts[n-1]}"
  rest=( "${parts[@]:3:$(( n - 4 ))}" )
  slug=$(IFS='-'; echo "${rest[*]}")
  base_path="$REPO_ROOT/public/images/content-flywheel/${date}-${slug}"
  for suffix in social hero inline; do
    if [ -f "${base_path}-${suffix}.png" ]; then
      echo "${base_path}-${suffix}.png"
      return
    fi
  done
  echo ""
}

# --- Get access token from refresh token ---
# redirect_uri must match the one used when the refresh token was obtained (e.g. from get-linkedin-refresh-token.mjs).
LINKEDIN_REDIRECT_URI="${LINKEDIN_REDIRECT_URI:-http://localhost:8080/callback}"

# Trim whitespace/newlines from a token (Secrets sometimes get trailing newlines when pasted).
trim_token() { echo "$1" | tr -d '\n\r' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//'; }

get_access_token() {
  local refresh_trimmed resp code
  refresh_trimmed=$(trim_token "$LINKEDIN_REFRESH_TOKEN")
  resp=$(curl -s -w "\n%{http_code}" -X POST "$LINKEDIN_TOKEN_URL" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=refresh_token" \
    -d "refresh_token=$refresh_trimmed" \
    -d "client_id=$LINKEDIN_CLIENT_ID" \
    -d "client_secret=$LINKEDIN_CLIENT_SECRET" \
    -d "redirect_uri=$LINKEDIN_REDIRECT_URI") || true
  code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$code" != "200" ]; then
    err "LinkedIn auth failed (HTTP $code). Response body length: ${#body} bytes."
    if [ -z "$body" ]; then
      err "Response body was empty. Check client_id, client_secret, refresh_token, and redirect_uri."
    else
      err "LinkedIn token API response:"
      printf '%s\n' "$body" | jq . 2>/dev/null || printf '%s\n' "$body"
    fi
    return 1
  fi
  echo "$body" | jq -r '.access_token'
}

# --- Get person URN (author for personal profile) ---
# Try OpenID Connect userinfo first (works with openid+profile scope); fall back to /v2/me.
get_person_urn() {
  local token="$1"
  local resp code body sub
  resp=$(curl -s -w "\n%{http_code}" -X GET "$LINKEDIN_API_BASE/v2/userinfo" \
    -H "Authorization: Bearer $token") || true
  code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$code" = "200" ]; then
    sub=$(echo "$body" | jq -r '.sub')
    if [ -n "$sub" ] && [ "$sub" != "null" ]; then
      echo "urn:li:person:$sub"
      return
    fi
  fi
  resp=$(curl -s -w "\n%{http_code}" -X GET "$LINKEDIN_API_BASE/v2/me" \
    -H "Authorization: Bearer $token" \
    -H "X-Restli-Protocol-Version: 2.0.0") || true
  code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$code" = "200" ]; then
    echo "$body" | jq -r '.id'
    return
  fi
  err "Failed to get person URN (tried /v2/userinfo and /v2/me). Request openid+profile scope when getting the token (npm run linkedin:get-token)."
  return 1
}

# --- Resolve author URN: company page (organization) or personal profile ---
# If LINKEDIN_ORGANIZATION_ID or LINKEDIN_ORGANIZATION_URN is set, use organization (company page).
# Otherwise use person URN (personal profile). Requires w_organization_social for company page.
get_author_urn() {
  local token="$1"
  if [ -n "${LINKEDIN_ORGANIZATION_URN:-}" ]; then
    # Expect format urn:li:organization:123
    if echo "$LINKEDIN_ORGANIZATION_URN" | grep -qE '^urn:li:organization:[0-9]+$'; then
      echo "$LINKEDIN_ORGANIZATION_URN"
      return
    fi
    err "LINKEDIN_ORGANIZATION_URN must be like urn:li:organization:123"
    return 1
  fi
  if [ -n "${LINKEDIN_ORGANIZATION_ID:-}" ]; then
    if echo "$LINKEDIN_ORGANIZATION_ID" | grep -qE '^[0-9]+$'; then
      echo "urn:li:organization:$LINKEDIN_ORGANIZATION_ID"
      return
    fi
    err "LINKEDIN_ORGANIZATION_ID must be a numeric organization ID"
    return 1
  fi
  get_person_urn "$token"
}

# --- Upload image via Images API (replaces deprecated Assets API); return image URN ---
# owner must match post author: for company page use organization URN; for personal use person URN.
# Token must have w_organization_social when owner is organization (get token with LINKEDIN_USE_COMPANY_PAGE=true).
upload_image() {
  local token="$1"
  local owner_urn="$2"
  local image_path="$3"
  local resp code body upload_url image_urn status i

  # Initialize upload (Images API)
  body=$(jq -n --arg owner "$owner_urn" '{ initializeUploadRequest: { owner: $owner } }')
  resp=$(curl -s -w "\n%{http_code}" -X POST "$LINKEDIN_API_BASE/rest/images?action=initializeUpload" \
    -H "Authorization: Bearer $token" \
    -H "Linkedin-Version: $LINKEDIN_VERSION" \
    -H "Content-Type: application/json" \
    -H "X-Restli-Protocol-Version: 2.0.0" \
    -d "$body") || true
  code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$code" != "200" ] && [ "$code" != "201" ]; then
    err "Images initializeUpload failed (HTTP $code). LinkedIn response:"
    printf '%s\n' "$body" | jq . 2>/dev/null || printf '%s\n' "$body"
    if [ "$code" = "401" ]; then
      err "401 Unauthorized: token may be expired, revoked, or missing scope. For company page: get a new token with LINKEDIN_USE_COMPANY_PAGE=true (includes w_organization_social and rw_ads), then update LINKEDIN_ACCESS_TOKEN in GitHub Secrets."
    fi
    return 1
  fi
  upload_url=$(echo "$body" | jq -r '.value.uploadUrl')
  image_urn=$(echo "$body" | jq -r '.value.image')
  if [ -z "$upload_url" ] || [ "$upload_url" = "null" ] || [ -z "$image_urn" ] || [ "$image_urn" = "null" ]; then
    err "Images response missing uploadUrl or image. Response: $body"
    return 1
  fi

  # Upload image binary (PUT with Bearer)
  resp=$(curl -s -w "\n%{http_code}" -X PUT "$upload_url" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: image/png" \
    --data-binary "@$image_path") || true
  code=$(echo "$resp" | tail -n1)
  if [ "$code" != "200" ] && [ "$code" != "201" ] && [ "$code" != "204" ]; then
    err "Image binary upload failed (HTTP $code)"
    return 1
  fi

  # w_member_social is write-only for Images API: we cannot GET status. Give LinkedIn time to process, then create the post.
  log "Image uploaded; waiting 15s for processing before creating post."
  sleep 15
  echo "$image_urn"
}

# --- Create post via rest/posts (Posts API; supports person or organization author + image URN) ---
create_ugc_post() {
  local token="$1"
  local author_urn="$2"
  local text="$3"
  local image_urn="${4:-}"  # optional; urn:li:image:xxx from Images API
  local payload
  if [ -n "$image_urn" ]; then
    payload=$(jq -n \
      --arg author "$author_urn" \
      --arg text "$text" \
      --arg media "$image_urn" \
      '{
        author: $author,
        commentary: $text,
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        content: { media: { id: $media, altText: "Post image" } },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false
      }')
  else
    payload=$(jq -n \
      --arg author "$author_urn" \
      --arg text "$text" \
      '{
        author: $author,
        commentary: $text,
        visibility: "PUBLIC",
        distribution: { feedDistribution: "MAIN_FEED", targetEntities: [], thirdPartyDistributionChannels: [] },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false
      }')
  fi
  local resp code
  resp=$(curl -s -w "\n%{http_code}" -X POST "$LINKEDIN_API_BASE/rest/posts" \
    -H "Authorization: Bearer $token" \
    -H "Content-Type: application/json" \
    -H "X-Restli-Protocol-Version: 2.0.0" \
    -H "Linkedin-Version: $LINKEDIN_VERSION" \
    -d "$payload") || true
  code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$code" != "200" ] && [ "$code" != "201" ]; then
    err "UGC post create failed (HTTP $code)"
    echo "$body" | jq -r '.message // .' 2>/dev/null || echo "$body"
    if [ "$code" = "401" ]; then
      err "401 Unauthorized: refresh your token with LINKEDIN_USE_COMPANY_PAGE=true and update LINKEDIN_ACCESS_TOKEN in GitHub Secrets."
    fi
    return 1
  fi
  echo "Created UGC post (HTTP $code)"
}

# --- Extract plain text from markdown (strip frontmatter, limit 3000) ---
post_body_text() {
  local path="$1"
  local text
  if [ ! -f "$path" ]; then
    echo ""
    return
  fi
  text=$(sed '/^---$/,/^---$/d' < "$path" | sed 's/^#* *//' | tr '\n' ' ' | sed 's/  */ /g; s/^[[:space:]]*//; s/[[:space:]]*$//')
  # LinkedIn max 3000
  if [ "${#text}" -gt 3000 ]; then
    text="${text:0:2997}..."
  fi
  echo "$text"
}

# --- Main ---
# Prefer refresh-token flow when refresh token is set (especially for company page: ensures fresh token with w_organization_social + rw_ads).
# Stored access tokens can be stale, truncated, or have paste newlines; refresh gives a clean token each run.
if [ -n "${LINKEDIN_REFRESH_TOKEN:-}" ] && [ -n "${LINKEDIN_CLIENT_ID:-}" ] && [ -n "${LINKEDIN_CLIENT_SECRET:-}" ]; then
  log "Using refresh token to obtain access token (recommended for company page)."
  ACCESS_TOKEN=$(get_access_token) || exit 1
  ACCESS_TOKEN=$(trim_token "$ACCESS_TOKEN")
elif [ -n "${LINKEDIN_ACCESS_TOKEN:-}" ]; then
  ACCESS_TOKEN=$(trim_token "$LINKEDIN_ACCESS_TOKEN")
  log "Using provided LINKEDIN_ACCESS_TOKEN (expires ~60 days). For company page, prefer refresh token so each run uses a fresh token."
else
  err "Set LINKEDIN_REFRESH_TOKEN + LINKEDIN_CLIENT_ID + LINKEDIN_CLIENT_SECRET, or LINKEDIN_ACCESS_TOKEN."
  exit 1
fi
AUTHOR_URN=$(get_author_urn "$ACCESS_TOKEN") || exit 1
if echo "$AUTHOR_URN" | grep -q '^urn:li:organization:'; then
  log "Publishing to company page: $AUTHOR_URN"
  log "Ensure LINKEDIN_ACCESS_TOKEN was obtained with w_organization_social and rw_ads (run get-token with LINKEDIN_USE_COMPANY_PAGE=true)."
else
  log "Publishing to personal profile: $AUTHOR_URN"
  log "To publish to a company page instead, add GitHub Secret LINKEDIN_ORGANIZATION_ID (numeric) or LINKEDIN_ORGANIZATION_URN (urn:li:organization:ID)"
fi

STATE=$(jq -c . "$STATE_FILE")
POSTS=$(echo "$POSTS_JSON" | jq -c '.[]')
UPDATED=false

while IFS= read -r post_path; do
  post_path="${post_path%\"}"
  post_path="${post_path#\"}"
  [ -z "$post_path" ] && continue
  if [ ! -f "$REPO_ROOT/$post_path" ]; then
    log "Skip (not a file): $post_path"
    continue
  fi
  # Idempotency: skip if already published for this path (any commit)
  if echo "$STATE" | jq -e --arg p "$post_path" '.[$p] != null' &>/dev/null; then
    log "Skip (already published): $post_path"
    continue
  fi
  image_path=$(resolve_image "$post_path")
  text=$(post_body_text "$REPO_ROOT/$post_path")
  if [ -z "$text" ]; then
    text="Post from $post_path"
  fi
  if [ -n "$image_path" ]; then
    log "Publishing with image: $post_path"
    asset_urn=$(upload_image "$ACCESS_TOKEN" "$AUTHOR_URN" "$image_path") || { err "Upload failed for $post_path"; exit 1; }
    create_ugc_post "$ACCESS_TOKEN" "$AUTHOR_URN" "$text" "$asset_urn" || { err "Create post failed for $post_path"; exit 1; }
  else
    log "Publishing text-only: $post_path"
    create_ugc_post "$ACCESS_TOKEN" "$AUTHOR_URN" "$text" "" || { err "Create post failed for $post_path"; exit 1; }
  fi
  # Append to state (per contracts/publish-state.md)
  STATE=$(echo "$STATE" | jq -c \
    --arg p "$post_path" \
    --arg c "$COMMIT_SHA" \
    --arg t "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    '.[$p] = { publishedAtCommit: $c, timestamp: $t }')
  UPDATED=true
done <<< "$POSTS"

if [ "$UPDATED" = true ]; then
  echo "$STATE" | jq . > "$STATE_FILE"
  log "Updated $STATE_FILE"
fi
