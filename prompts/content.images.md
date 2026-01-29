# Content Flywheel – Image Generation Prompt

Used by the Content Flywheel workflow to generate hero, social, and inline images that match the site theme. Placeholders are replaced by the OpenAI script before calling the API. The workflow defaults to **GPT Image** (`gpt-image-1`), which follows “no text” instructions better than DALL-E 3; the same OpenAI Image API and key are used by the Cursor MCP image tool (MCP runs only in the IDE; the workflow calls the API directly in CI).

## Placeholders

- `{{TOPIC}}` – Topic title or short description (e.g. "5 backup habits that protect nonprofit data").
- `{{FORMAT_SUFFIX}}` – Format-specific instruction (e.g. "Wide banner format, horizontal layout." or "Square format for social media.").

## Prompt (single line when used)

Do not include any text, letters, words, typography, signs, labels, or writing in the image. Abstract visual only. Minimal, professional digital illustration: simple abstract shapes, soft gradients, modern and clean. Theme or topic context (for mood only, do not depict as text): {{TOPIC}}. {{FORMAT_SUFFIX}} Color palette: calm blue (#7c9eff), soft purple (#a78bfa), teal accent (#34d399), dark blue and slate backgrounds (#0f172a, #1e293b). Use only these colors or very close shades. Calm, professional, minimal; consistent with a small business or nonprofit website. Purely abstract shapes and gradients—no words, no letters, no text of any kind. High quality.
