# Contract: Optional Notion Reference CSV

**Branch**: `001-health-check-form-rewrite` | **Spec**: [../spec.md](../spec.md)

## Purpose

If the feature delivers a CSV (or equivalent) per FR-007, it serves as a **reference** of form field names and allowed values for Notion consistency or imports. Notion properties (Tools, Pain Points, Backups, Security Confidence, etc.) are rich_text and do not require schema changes; this artifact is for documentation and optional import use.

## Format (advisory)

| Column | Description |
|--------|-------------|
| Field name | Form/submission field (e.g. current_tools, backups_maturity) |
| Notion property | Notion database property name (e.g. Tools, Backups) |
| Allowed values | Semicolon-separated or one value per row; include "Not Sure" where applicable |
| Notes | e.g. "rich_text; any value allowed; list is canonical for form" |

## When to deliver

- **Required** only if form changes “require Notion database updates” (FR-007). Current design does not change Notion schema; new values are stored in existing rich_text properties.
- **Optional**: Provide a small CSV or markdown table listing field names and allowed values (including new tools, pain points, and `not_sure`) plus brief instructions (e.g. in `docs/health-check-setup.md` or this spec folder) so the site owner can align exports or imports with the form.

## Instructions (brief)

- Notion properties used by the health check are rich_text; values are free-form from the form.
- Use the reference list for consistency when filtering, reporting, or importing; the form and `schema/healthcheck_submission.schema.json` are the source of truth for allowed values.
