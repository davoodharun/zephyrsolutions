# Data Model: Health Check Form Rewrite

**Branch**: `001-health-check-form-rewrite` | **Plan**: [plan.md](./plan.md)

## Entities

### Form submission (existing; additive changes)

Same payload shape as today; new allowed values and one new enum value.

| Field | Type | Validation / notes |
|-------|------|---------------------|
| org_name | string | 1–200 chars, required |
| contact_name | string | 1–200 chars, required |
| email | string | email format, max 254, required |
| org_size | string | enum: 1-10, 11-50, 51-200, 200+ |
| current_tools | string[] | 1–20 items; **add**: Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint (plus existing) |
| top_pain_points | string[] | 1–10 items; **add**: Large maintenance overhead, Too much time on repetitive tasks, Website maintenance (plus existing) |
| backups_maturity | string | enum: none, basic, regular, automated, cloud-based, **not_sure** |
| security_confidence | string | enum: very_low, low, moderate, high, very_high, **not_sure** |
| budget_comfort | string | enum: unchanged |
| timeline | string | enum: unchanged |
| notes | string | optional, max 1000 |
| honeypot | string | must be empty |

**State**: No new states; submission flow unchanged (submit → Notion + optional KV, report generation as today).

**Relationships**: Submission → Notion lead (1:1); submission → report (1:1, existing). No new entities.

### Notion lead (existing; additive)

- **Org Name**, **Contact Name**, **Email**, **Org Size**, **Tools**, **Pain Points**, **Backups**, **Security Confidence**, **Budget Comfort**, **Timeline**, **Status**, **Source**, **Created At**, **Updated At** (unchanged).
- **Tools** and **Pain Points**: rich_text; new tool/pain point values stored as-is.
- **Backups** and **Security Confidence**: rich_text; `not_sure` stored as-is. No Notion schema change.

### Optional artifact: Notion reference CSV

If delivered (see research.md):

- **Purpose**: Reference of form field names and allowed values for Notion/import consistency.
- **Contents**: Columns such as Field name, Allowed values, Notes. One row per field (or per enum). Not a system of record; form and schema are source of truth.

## Validation rules (from requirements)

- FR-005: Submissions with only new options and/or “Not Sure” are valid; backend and report logic must accept and store them without error.
- “Not Sure” is valid for backups_maturity and security_confidence; report/LLM must not fail on it (treat as neutral or “prefer not to say”).

## State transitions

No new transitions. Existing: visitor submits → lead created/updated in Notion → report generated (optional KV) → email/link to report.
