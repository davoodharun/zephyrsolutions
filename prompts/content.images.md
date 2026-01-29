# Content Flywheel – DALL-E Image Generation Prompt

Used by the Content Flywheel workflow to generate hero, social, and inline images that match the site theme. Placeholders are replaced by the OpenAI script before calling the API.

**Note:** DALL-E 3 often adds text even when asked not to. The prompt leads with a strong "no text" rule and repeats it at the end; if images still contain words, consider using the SVG fallback or post-processing/cropping.

## Placeholders

- `{{TOPIC}}` – Topic title or short description (e.g. "5 backup habits that protect nonprofit data").
- `{{FORMAT_SUFFIX}}` – Format-specific instruction (e.g. "Wide banner format, horizontal layout." or "Square format for social media.").

## Prompt (single line when used)

Do not include any text, letters, words, typography, signs, labels, or writing in the image. Abstract visual only. Minimal, professional digital illustration: simple abstract shapes, soft gradients, modern and clean. Theme or topic context (for mood only, do not depict as text): {{TOPIC}}. {{FORMAT_SUFFIX}} Color palette: calm blue (#7c9eff), soft purple (#a78bfa), teal accent (#34d399), dark blue and slate backgrounds (#0f172a, #1e293b). Use only these colors or very close shades. Calm, professional, minimal; consistent with a small business or nonprofit website. Purely abstract shapes and gradients—no words, no letters, no text of any kind. High quality.
