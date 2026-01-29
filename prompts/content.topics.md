# Topic Suggestion Prompt

Generate exactly 10 content topic ideas for a consultant marketing to small orgs and nonprofits.

## Input

- **Theme**: {{THEME}}
- **Audience**: {{AUDIENCE}}
- **Goals** (optional): {{GOALS}}
- **Constraints** (optional): {{CONSTRAINTS}}
- **Region** (optional): {{REGION}}

## Task

Produce a JSON array of exactly 10 topic candidates. Each object in the array MUST have these keys only:

- `title` (string): Short, specific topic title (e.g. "5 backup habits that protect nonprofit data")
- `hook` (string): One-line angle or hook for the topic
- `persona` (string): Who it's for (e.g. "nonprofit ED", "ops manager")
- `why_it_matters` (string): Brief rationale (1–2 sentences)
- `cta_type` (string): One of "free resource", "assessment", "short call"
- `difficulty` (string): One of "low", "med", "high"

## Rules

- Respect constraints (e.g. "no jargon", "board-friendly") in tone and language.
- Each topic must be distinct; no duplicate angles.
- Output ONLY a valid JSON array. No markdown, no code fences, no explanation — just the array of 10 objects.
