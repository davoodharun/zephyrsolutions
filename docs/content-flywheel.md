# Content Flywheel

Content Flywheel generates marketing content (topic ideas + assets) via the content API and saves drafts to the repo via a GitHub Action.

## Environment variables (Cloudflare Pages)

Set in **Pages → Settings → Environment variables** (Production and Preview). The content API only requires `LLM_API_KEY`; Notion, email, and health-check vars are not needed for the flywheel.

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_API_KEY` | Yes | Used for topic and asset generation (OpenAI or compatible API key) |
| `LLM_API_URL` | No | Defaults to OpenAI-compatible endpoint |
| `CONTENT_API_SECRET` | No | If set, `POST /api/content/topics` and `POST /api/content/generate` require `Authorization: Bearer <secret>` or `X-Content-API-Secret` |

## API endpoints

- **POST /api/content/topics** — Request topic suggestions (theme, audience, optional goals/constraints). Returns `{ ok: true, topics: [ ... ] }` (10 topic candidates).
- **POST /api/content/generate** — Request asset generation for a topic and list of asset types (`linkedin`, `blog`, `email`, `onepager`, `workshop_outline`). Returns `{ ok: true, topic_title, generated_at, assets, errors }`.

See `specs/001-content-flywheel/quickstart.md` for curl examples and `specs/001-content-flywheel/contracts/api-endpoints.md` for request/response shapes.

## Workflow dispatch

**Workflow**: `.github/workflows/content-flywheel.yml`

1. In GitHub: **Actions** → **Content Flywheel** → **Run workflow**.
2. Fill **theme** and **audience** (and optionally preferred_channels, tone).
3. The workflow calls the content API (topics → generate), writes markdown files under `content/posts/`, `content/linkedin/`, `content/email/`, `content/onepagers/`, and opens a PR titled **Content: &lt;topic title&gt;**.
4. Review and edit the PR before merging; no automatic publishing.

**Repository setting (required for PR creation):** In **Settings → Actions → General**, under **Workflow permissions**, enable **Allow GitHub Actions to create and approve pull requests**. Without this, the default `GITHUB_TOKEN` cannot create the draft PR.

**Secrets** (repo Settings → Secrets and variables → Actions):

- `CONTENT_API_SECRET`: Optional; set if you protected the content endpoints with this secret in Cloudflare.
- `OPENAI_API_KEY`: Optional; if set, the workflow generates 3 images (hero, social, inline) with DALL-E 3 and saves them as PNGs in `public/images/content-flywheel/`. If unset or the API fails, minimal SVG placeholders are generated instead.

**Variables** (optional):

- `CONTENT_API_URL`: Base URL of the Pages deployment (e.g. `https://zephyrsolutions.pages.dev`). Defaults to that URL if unset.
- `OPENAI_API_URL`: Base URL for OpenAI API (defaults to `https://api.openai.com/v1`). Set only if using a proxy or different endpoint.

## Rate limiting

The flywheel makes several LLM calls in one run (1 for topics, then 4 for linkedin/blog/email/onepager). If you hit provider rate limits (e.g. OpenAI RPM):

- **Server-side**: The LLM client retries on 429 (up to 4 attempts), uses a 3s backoff for rate-limit errors, and honors the `Retry-After` header when present. The generate endpoint adds a 1.5s delay between each asset type to avoid bursting.
- **Workflow**: A 3s pause runs between the topics step and the generate step.
- **If you still hit limits**: Space out workflow runs (e.g. don’t trigger multiple times in a few minutes), or use a higher API tier / increased rate limits for your key.

## File path conventions

| Asset type | Path (relative to repo root) |
|------------|------------------------------|
| blog | `content/posts/YYYY-MM-DD-<slug>.md` |
| linkedin | `content/linkedin/YYYY-MM-DD-<slug>-<variant>.md` |
| email | `content/email/YYYY-MM-DD-<slug>.md` |
| onepager | `content/onepagers/YYYY-MM-DD-<slug>.md` |
| workshop_outline | `content/workshops/YYYY-MM-DD-<slug>.md` |
| images (hero, social, inline) | `public/images/content-flywheel/YYYY-MM-DD-<slug>-hero.png` (and `-social.png`, `-inline.png`), or `.svg` if OpenAI is not used |

If your site uses a different content tree (e.g. `src/content/`), update the workflow and paths accordingly.

## Image generation and theme alignment

- **DALL-E prompt**: The workflow uses `prompts/content.images.md` for the image generation prompt. It contains placeholders `{{TOPIC}}` and `{{FORMAT_SUFFIX}}`; the OpenAI script (`.github/scripts/generate-flywheel-images-openai.sh`) replaces them and calls the API. The prompt includes the site color palette (calm blue, purple, teal, dark surfaces) so generated images match the site theme.
- **SVG fallback**: When `OPENAI_API_KEY` is unset or the API fails, `.github/scripts/generate-flywheel-images.sh` creates SVG placeholders using the same palette from `public/css/style.css` (e.g. `#7c9eff`, `#a78bfa`, `#34d399`, `#0f172a`, `#1e293b`).
