#!/usr/bin/env bash
# Generate 3 image assets via OpenAI DALL-E 3 for Content Flywheel.
# Requires: OPENAI_API_KEY in environment.
# Usage: generate-flywheel-images-openai.sh <SLUG> <DATE> <TOPIC_TITLE> [OUTPUT_DIR]
# Exits 0 on success, 1 on missing key or API failure (caller can fall back to SVG script).

set -e
SLUG="${1:-content}"
DATE="${2:-$(date +%Y-%m-%d)}"
TITLE="${3:-Content}"
OUT_DIR="${4:-public/images/content-flywheel}"

if [ -z "${OPENAI_API_KEY}" ]; then
  echo "OPENAI_API_KEY not set; skip OpenAI image generation"
  exit 1
fi

mkdir -p "$OUT_DIR"
API_URL="${OPENAI_API_URL:-https://api.openai.com/v1}/images/generations"

# Truncate title for prompt
TITLE_TRIM=$(printf '%s' "$TITLE" | tr '\n' ' ' | head -c 100)

# Load prompt from prompts/content.images.md (line containing {{TOPIC}}), or use inline fallback
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROMPT_FILE="${REPO_ROOT}/prompts/content.images.md"
PROMPT_TEMPLATE=""
if [ -f "$PROMPT_FILE" ]; then
  PROMPT_TEMPLATE=$(grep -F '{{TOPIC}}' "$PROMPT_FILE" | head -n1) || true
fi
if [ -z "$PROMPT_TEMPLATE" ]; then
  PROMPT_TEMPLATE="Do not include any text, letters, words, typography, signs, labels, or writing in the image. Abstract visual only. Minimal, professional digital illustration: simple abstract shapes, soft gradients, modern and clean. Theme or topic context (for mood only, do not depict as text): {{TOPIC}}. {{FORMAT_SUFFIX}} Color palette: calm blue (#7c9eff), soft purple (#a78bfa), teal accent (#34d399), dark blue and slate backgrounds (#0f172a, #1e293b). Use only these colors or very close shades. Purely abstract shapes and gradients—no words, no letters, no text of any kind. High quality."
fi

gen_image() {
  local kind=$1
  local size=$2
  local prompt_suffix=$3
  local prompt
  prompt="${PROMPT_TEMPLATE//\{\{TOPIC\}\}/$TITLE_TRIM}"
  prompt="${prompt//\{\{FORMAT_SUFFIX\}\}/$prompt_suffix}"
  local outfile="${OUT_DIR}/${DATE}-${SLUG}-${kind}.png"

  local body
  body=$(jq -n \
    --arg prompt "$prompt" \
    --arg size "$size" \
    '{
      model: "dall-e-3",
      prompt: $prompt,
      n: 1,
      size: $size,
      response_format: "b64_json",
      quality: "standard",
      style: "natural"
    }')

  local resp
  resp=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$body") || exit 1

  local http_code
  http_code=$(echo "$resp" | tail -n1)
  local json
  json=$(echo "$resp" | sed '$d')

  if [ "$http_code" != "200" ]; then
    echo "OpenAI API error ($http_code): $json"
    return 1
  fi

  local b64
  b64=$(echo "$json" | jq -r '.data[0].b64_json // empty')
  if [ -z "$b64" ]; then
    echo "No b64_json in response"
    return 1
  fi

  echo "$b64" | base64 -d > "$outfile"
  echo "Generated $outfile"
}

# Hero: wide banner (1792x1024)
gen_image "hero" "1792x1024" "Wide banner format, horizontal layout." || exit 1
# Social: square (1024x1024)
gen_image "social" "1024x1024" "Square format for social media." || exit 1
# Inline: landscape (1792x1024)
gen_image "inline" "1792x1024" "Horizontal content image, inline article style." || exit 1

echo "Generated 3 images with OpenAI in $OUT_DIR"
exit 0
