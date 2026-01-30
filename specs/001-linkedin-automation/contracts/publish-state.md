# Contract: Publish State File

**Feature**: 001-linkedin-automation

## Location

`content/linkedin/.published.json` (in repo so workflow can read/write it).

## Schema

JSON object: keys = post file path (relative to repo root, e.g. `content/linkedin/2026-01-29-slug-educational.md`); value = object with:

- `publishedAtCommit` (string): Commit SHA at which this post was published.
- `timestamp` (string, optional): ISO 8601 time when published.

Example:

```json
{
  "content/linkedin/2026-01-29-cybersecurity-basics-educational.md": {
    "publishedAtCommit": "abc123",
    "timestamp": "2026-01-29T15:00:00Z"
  }
}
```

## Usage

- Before publishing a post, check if its path is already a key in the state; if so and commit matches (or skip logic defined), skip publishing (idempotency).
- After successful LinkedIn UGC post creation, add or update the entry for that post path with current commit and timestamp; write file back to repo.
- Workflow must commit and push `content/linkedin/.published.json` after a successful run so the next run sees updated state.
