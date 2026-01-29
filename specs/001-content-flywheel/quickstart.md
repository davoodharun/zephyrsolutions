# Quickstart: Content Flywheel v1

**Feature**: 001-content-flywheel  
**Date**: 2026-01-29

## Overview

Content Flywheel v1 is triggered by a workflow dispatch (e.g. GitHub Action). The workflow calls two Cloudflare Pages Functions to get topic suggestions and then generate assets; it then writes markdown files to the repo and opens a PR. This guide covers local/dev usage and the workflow setup.

## Prerequisites

- Repo with Cloudflare Pages Functions deployed (e.g. `zephyrsolutions.pages.dev`)
- GitHub Actions enabled; `GITHUB_TOKEN` or PAT with repo write access for PR creation
- LLM API key and URL configured (same env as health check: `LLM_API_KEY`, `LLM_API_URL`)
- Optional: `CONTENT_API_SECRET` if endpoints are protected

## Environment Variables (Cloudflare Pages)

Set in **Settings → Environment variables** (Production and Preview if testing on preview):

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_API_KEY` | Yes | Same as health check |
| `LLM_API_URL` | No | Defaults to OpenAI-compatible endpoint |
| `CONTENT_API_SECRET` | No | If set, topics and generate endpoints require this in header/query |

## Calling the API (manual or script)

### 1. Topic suggestion

```bash
curl -X POST "https://zephyrsolutions.pages.dev/api/content/topics" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "cybersecurity for nonprofits",
    "audience": "nonprofit ED",
    "constraints": "no jargon, board-friendly"
  }'
```

Response: `{ "ok": true, "topics": [ ... ] }` with 10 topic candidates.

### 2. Asset generation

```bash
curl -X POST "https://zephyrsolutions.pages.dev/api/content/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": { "title": "5 backup habits that protect nonprofit data", "persona": "nonprofit ED" },
    "asset_types": ["linkedin", "blog", "email", "onepager"]
  }'
```

Response: `{ "ok": true, "topic_title": "...", "generated_at": "...", "assets": [ ... ], "errors": [] }`.

### 3. Using the JSON in a GitHub Action

- Trigger: `workflow_dispatch` with inputs (theme, audience, preferred channels, tone).
- Steps:
  1. Call `POST /api/content/topics` with inputs → get topics.
  2. Optionally let user pick topic (e.g. first one) or use a default; call `POST /api/content/generate` with that topic and desired asset_types.
  3. Checkout repo; for each asset in the response, write a file under the path in [data-model.md](../data-model.md) (e.g. `content/posts/YYYY-MM-DD-<slug>.md`) with frontmatter + body.
  4. Commit, push branch, open PR (e.g. `gh pr create --title "Content: <topic title>"`).

## File paths (GitHub Action)

Align with existing content structure. Example (from contentgen.md):

| Asset type | Path (relative to repo root) |
|------------|------------------------------|
| blog | `content/posts/YYYY-MM-DD-<slug>.md` |
| linkedin | `content/linkedin/YYYY-MM-DD-<slug>-<variant>.md` |
| email | `content/email/YYYY-MM-DD-<slug>.md` |
| onepager | `content/onepagers/YYYY-MM-DD-<slug>.md` |
| workshop_outline | `content/workshops/YYYY-MM-DD-<slug>.md` |

If the site uses `src/content/` or another tree, update the workflow to match.

## Local development

1. **Run Eleventy + Pages Functions locally** (see main repo docs):
   ```bash
   npm run build
   npm run functions:dev
   ```
2. **Call local endpoints**:
   - Topics: `POST http://localhost:8788/api/content/topics`
   - Generate: `POST http://localhost:8788/api/content/generate`
3. **Test workflow**: Use a small script or Postman to run topics → generate, then write files under a test directory to verify paths and frontmatter.

## Fallback: download JSON (no Git write)

If the GitHub Action is not configured or repo write is unavailable, the consultant can call the generate endpoint and save the response JSON. A future “download zip” step could bundle the `assets[]` into files and zip them; the API response is sufficient for that.

## Workflow inputs and secrets

**Workflow**: `.github/workflows/content-flywheel.yml` (workflow_dispatch)

**Inputs** (when running manually):
- `theme` (required): General area (e.g. "cybersecurity for nonprofits")
- `audience` (required): Target persona (e.g. "nonprofit ED", "ops manager")
- `preferred_channels` (optional): Comma-separated asset types; default `linkedin,blog,email,onepager`
- `tone` (optional): e.g. "board-friendly"

**Secrets / variables** (GitHub repo Settings → Secrets and variables → Actions):
- `CONTENT_API_SECRET` (optional): If set in Cloudflare Pages and here, the workflow sends it as `Authorization: Bearer <secret>` when calling the content API. Set only if you protected the endpoints with `CONTENT_API_SECRET`.
- `GITHUB_TOKEN`: Provided automatically; needs `contents: write` and `pull-requests: write` (set in the workflow).

**Variables** (optional):
- `CONTENT_API_URL` (optional): Base URL of the Cloudflare Pages deployment (e.g. `https://zephyrsolutions.pages.dev`). Defaults to `https://zephyrsolutions.pages.dev` if not set.

## Next steps

- Endpoints and prompts are implemented; workflow is in `.github/workflows/content-flywheel.yml`.
- Document workflow inputs and any repo-specific paths in `docs/` (e.g. editor or dev guide).
