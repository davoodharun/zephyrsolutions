# Contract: Health Check Submission Schema Delta

**Branch**: `001-health-check-form-rewrite` | **Spec**: [../spec.md](../spec.md)

## Scope

Additive changes only. Existing `schema/healthcheck_submission.schema.json` and API `/api/healthcheck/submit` contract unchanged in shape; new allowed values and one new enum value.

## 1. Enum changes

### backups_maturity

- **Current**: `["none", "basic", "regular", "automated", "cloud-based"]`
- **Add**: `"not_sure"`
- **Result**: `["none", "basic", "regular", "automated", "cloud-based", "not_sure"]`

### security_confidence

- **Current**: `["very_low", "low", "moderate", "high", "very_high"]`
- **Add**: `"not_sure"`
- **Result**: `["very_low", "low", "moderate", "high", "very_high", "not_sure"]`

### budget_comfort, timeline, org_size

- No change.

## 2. current_tools (array of strings)

- Schema remains **array of strings** (no enum). Form and backend accept any of:
  - **Existing**: Microsoft Office, Google Workspace, Custom Software, Cloud Services (AWS, Azure, etc.), CRM System, Email Server, Website/CMS, Other
  - **New**: Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint
- Validation: minItems 1, maxItems 20; no change to schema structure.

## 3. top_pain_points (array of strings)

- Schema remains **array of strings** (no enum). Form and backend accept any of:
  - **Existing**: Data backup concerns, Security concerns, Outdated systems, Limited IT support, Integration issues, Budget constraints, Staff training, Compliance requirements
  - **New**: Large maintenance overhead, Too much time on repetitive tasks, Website maintenance
- Validation: minItems 1, maxItems 10; no change to schema structure.

## 4. API contract

- **Endpoint**: `POST /api/healthcheck/submit` (unchanged)
- **Request body**: Same JSON shape; new values allowed in `current_tools`, `top_pain_points`; `not_sure` allowed in `backups_maturity`, `security_confidence`.
- **Response**: Unchanged (e.g. `{ ok: true }` or `{ ok: false, errors, message }`).
- **Backward compatibility**: Existing clients sending only old values remain valid.

## 5. Notion mapping

- **Tools**: rich_text; values sent as-is (new tool labels stored as submitted).
- **Pain Points**: rich_text; values sent as-is (new pain point labels stored as submitted).
- **Backups**, **Security Confidence**: rich_text; `not_sure` sent as-is. No Notion property type change.
