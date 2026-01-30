# Contract: LinkedIn Publish Workflow Trigger

**Feature**: 001-linkedin-automation

## Trigger

- **Event**: `push` to branch `main`.
- **Path filter**: Workflow runs only when the push includes changes under:
  - `content/linkedin/**`
- **Optional**: Also run when `public/images/content-flywheel/**` changes (if we want to re-publish when only image is updated; otherwise omit).

## Inputs (from event)

- **Commit**: The commit SHA of the push to main.
- **Changed files**: List of added/modified files under `content/linkedin/` in that commit (or since last publish run if batching).

## Outputs (workflow)

- **Job success**: All detected new/updated LinkedIn posts (and their images when available) are published to LinkedIn, or failures are reported.
- **Job failure**: At least one publish failed; workflow status and logs indicate which post and error (e.g. LinkedIn API error, auth failure).

## Idempotency

- Workflow MUST NOT create duplicate LinkedIn posts for the same content when re-run (e.g. on workflow re-run or same merge re-processed).
- Implementation: use a state file (e.g. `content/linkedin/.published.json`) or equivalent to record which post file (path + content hash or commit) was already published; skip or no-op for already-published posts.
