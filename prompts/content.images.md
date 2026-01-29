# Content Flywheel – DALL-E Image Generation Prompt

Used by the Content Flywheel workflow to generate hero, social, and inline images that match the site theme. Placeholders are replaced by the OpenAI script before calling the API.

## Placeholders

- `{{TOPIC}}` – Topic title or short description (e.g. "5 backup habits that protect nonprofit data").
- `{{FORMAT_SUFFIX}}` – Format-specific instruction (e.g. "Wide banner format, horizontal layout." or "Square format for social media.").

## Prompt (single line when used)

Minimal, professional abstract image for a blog or social post. Style: simple shapes, soft gradients, modern and clean. Theme or topic context: {{TOPIC}}. {{FORMAT_SUFFIX}} Color palette: calm blue (#7c9eff), soft purple (#a78bfa), teal accent (#34d399), dark blue and slate backgrounds (#0f172a, #1e293b). Use only these colors or very close shades. Style: calm, professional, minimal; consistent with a small business or nonprofit website. No text or words in the image. High quality.
