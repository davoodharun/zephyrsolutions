#!/usr/bin/env bash
# Generate 3 minimal SVG image assets for Content Flywheel (topic-related, generic placeholders).
# Usage: generate-flywheel-images.sh <SLUG> <DATE> <TOPIC_TITLE> [OUTPUT_DIR]
# Example: generate-flywheel-images.sh "5-backup-habits" "2026-01-29" "5 backup habits that protect nonprofit data"

set -e
SLUG="${1:-content}"
DATE="${2:-$(date +%Y-%m-%d)}"
TITLE="${3:-Content}"
OUT_DIR="${4:-public/images/content-flywheel}"

# Escape for XML/SVG and truncate long titles for display
escape_xml() { echo "$1" | sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g; s/"/\&quot;/g'; }
TITLE_TRIM=$(printf '%s' "$TITLE" | tr '\n' ' ' | head -c 80)
TITLE_ESC=$(escape_xml "$TITLE_TRIM")

mkdir -p "$OUT_DIR"

# 1. Hero/banner (wide) - 800x300
cat > "${OUT_DIR}/${DATE}-${SLUG}-hero.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" viewBox="0 0 800 300" role="img" aria-labelledby="hero-title">
  <title id="hero-title">$TITLE_ESC — hero image</title>
  <defs>
    <linearGradient id="hero-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="300" fill="url(#hero-grad)"/>
  <rect x="40" y="40" width="720" height="220" rx="8" fill="rgba(255,255,255,0.12)"/>
  <text x="400" y="165" font-family="system-ui,sans-serif" font-size="22" fill="rgba(255,255,255,0.95)" text-anchor="middle">$TITLE_ESC</text>
  <text x="400" y="195" font-family="system-ui,sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" text-anchor="middle">Content Flywheel · $DATE</text>
</svg>
EOF

# 2. Social/square - 800x800
cat > "${OUT_DIR}/${DATE}-${SLUG}-social.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800" role="img" aria-labelledby="social-title">
  <title id="social-title">$TITLE_ESC — social share image</title>
  <defs>
    <linearGradient id="social-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4338ca;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6d28d9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#social-grad)"/>
  <circle cx="400" cy="340" r="140" fill="rgba(255,255,255,0.1)"/>
  <circle cx="400" cy="340" r="100" fill="rgba(255,255,255,0.08)"/>
  <text x="400" y="480" font-family="system-ui,sans-serif" font-size="28" fill="rgba(255,255,255,0.95)" text-anchor="middle">$TITLE_ESC</text>
  <text x="400" y="530" font-family="system-ui,sans-serif" font-size="14" fill="rgba(255,255,255,0.6)" text-anchor="middle">$DATE</text>
</svg>
EOF

# 3. Inline/content - 800x400
cat > "${OUT_DIR}/${DATE}-${SLUG}-inline.svg" << EOF
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" role="img" aria-labelledby="inline-title">
  <title id="inline-title">$TITLE_ESC — inline image</title>
  <defs>
    <linearGradient id="inline-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.9" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.9" />
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#inline-grad)"/>
  <rect x="32" y="32" width="736" height="336" rx="8" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <text x="400" y="210" font-family="system-ui,sans-serif" font-size="24" fill="rgba(255,255,255,0.95)" text-anchor="middle">$TITLE_ESC</text>
  <text x="400" y="250" font-family="system-ui,sans-serif" font-size="13" fill="rgba(255,255,255,0.65)" text-anchor="middle">Generic placeholder · replace with final asset</text>
</svg>
EOF

echo "Generated 3 images: ${DATE}-${SLUG}-hero.svg, ${DATE}-${SLUG}-social.svg, ${DATE}-${SLUG}-inline.svg in $OUT_DIR"
