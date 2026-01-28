# Data Model: AI-Driven Nonprofit IT Health Check Workflow

**Feature**: 001-ai-health-check  
**Date**: 2026-01-26

## Entities

### HealthCheckSubmission

Represents the form data submitted by a visitor completing the IT health check assessment.

**Fields**:
- `org_name` (string, required): Organization name
- `contact_name` (string, required): Contact person's name
- `email` (string, required, email format): Contact email address
- `org_size` (enum, required): Organization size category
  - Values: "1-10", "11-50", "51-200", "200+"
- `current_tools` (array of strings, required): Multi-select of current tools/technologies in use
- `top_pain_points` (array of strings, required): Multi-select of primary pain points
- `backups_maturity` (enum, required): Backup strategy maturity level
  - Values: TBD based on form design
- `security_confidence` (enum, required): Security confidence level
  - Values: TBD based on form design
- `budget_comfort` (enum, required): Budget comfort level
  - Values: TBD based on form design
- `timeline` (enum, required): Project timeline preference
  - Values: TBD based on form design
- `notes` (string, optional): Additional notes or context
- `honeypot` (string, optional): Spam protection field (must be empty for valid submissions)

**Validation Rules**:
- All required fields must be present and non-empty
- Email must be valid email format
- Enum values must match allowed options
- Array fields must contain at least one item
- Honeypot field must be empty (if present)
- Notes field has maximum length (e.g., 1000 characters)

**State Transitions**: N/A (submission is a one-time event)

### HealthCheckReport

Represents the AI-generated assessment report based on the submission data.

**Fields**:
- `version` (string, required): Report schema version (e.g., "1")
- `summary` (string, required): Overall assessment summary (2-4 sentences)
- `readiness_score` (integer, required): Numeric readiness score from 1 to 5
- `readiness_label` (enum, required): Readiness category
  - Values: "Watch", "Plan", "Act"
- `top_risks` (array of objects, required, 2-5 items): Top risk areas identified
  - Each item: `{ title: string, description: string, severity: "low" | "medium" | "high" }`
- `top_priorities` (array of objects, required, 2-4 items): Top priority recommendations
  - Each item: `{ title: string, description: string, impact: string }`
- `do_not_worry_yet` (array of objects, required, 1-3 items): Items that are acceptable for now
  - Each item: `{ title: string, description: string }`
- `next_steps` (array of objects, required, 3-6 items): Recommended next steps
  - Each item: `{ title: string, description: string, timeline: string }`
- `recommended_entry_offer` (enum, required): Recommended engagement level
  - Values: "Free resources", "Fixed-price assessment", "Short call"
- `admin_notes` (string, required): Internal notes for business team

**Validation Rules**:
- Must be valid JSON (no markdown)
- All required fields must be present
- Array lengths must be within specified ranges
- Readiness score must be between 1 and 5
- Enum values must match allowed options
- All string fields must be non-empty

**State Transitions**: N/A (report is generated once and stored)

### Lead (Notion Database Record)

Represents a CRM record in Notion database containing submission data and assessment results.

**Fields** (mapped to Notion database properties):
- `Org Name` (Title): Organization name from submission
- `Lead ID` (Text): Unique identifier for the lead (generated)
- `Contact Name` (Text): Contact person's name
- `Email` (Email): Contact email address
- `Org Size` (Select): Organization size category
- `Tools` (Multi-select): Current tools in use
- `Pain Points` (Multi-select): Top pain points
- `Backups` (Select): Backup maturity level
- `Security Confidence` (Select): Security confidence level
- `Budget Comfort` (Select): Budget comfort level
- `Timeline` (Select): Project timeline
- `Status` (Select): Processing status
  - Values: "pending_generation", "sent", "needs_manual_review"
- `Readiness Score` (Number): Numeric readiness score (1-5)
- `Readiness Label` (Select): Readiness category (Watch/Plan/Act)
- `Report Summary` (Rich text): Summary from generated report
- `Report JSON` (Rich text): Full report JSON as string
- `Source` (Select): Lead source identifier (e.g., "website-healthcheck")
- `Created At` (Date): Timestamp when lead was created
- `Updated At` (Date): Timestamp when lead was last updated

**State Transitions**:
1. **Initial**: Status = "pending_generation" (created on form submission)
2. **Success**: Status = "sent" (after successful report generation and email delivery)
3. **Failure**: Status = "needs_manual_review" (after report generation fails after repair attempt)

**Relationships**:
- One Lead corresponds to one HealthCheckSubmission
- One Lead corresponds to one HealthCheckReport (after generation)
- Lead is stored in external Notion database (not in application codebase)

### ReportToken

Represents a secure, signed token used to access report pages.

**Fields** (encoded in token):
- `lead_id` (string): Identifier for the lead record
- `exp` (timestamp): Expiration time (30 days from generation)
- `sig` (HMAC signature): Cryptographic signature for verification

**Validation Rules**:
- Token must be valid base64url format
- Signature must verify against secret key
- Expiration must not be in the past
- Lead ID must correspond to existing lead record

**State Transitions**: N/A (token is generated once and validated on each access)

## Data Flow

1. **Submission**: Visitor submits form → HealthCheckSubmission created
2. **Lead Creation**: HealthCheckSubmission → Lead record created in Notion (status: pending_generation)
3. **Report Generation**: HealthCheckSubmission → HealthCheckReport generated via LLM
4. **Lead Update**: HealthCheckReport → Lead record updated in Notion (status: sent, with report data)
5. **Token Generation**: Lead ID → ReportToken generated (HMAC-signed)
6. **Report Access**: ReportToken → Lead record queried → HealthCheckReport retrieved → HTML rendered

## Storage Strategy

- **HealthCheckSubmission**: Transient - only exists during request processing, not persisted
- **HealthCheckReport**: Stored as JSON string in Notion Lead record (Report JSON property)
- **Lead**: Persisted in Notion database (external system)
- **ReportToken**: Not stored - stateless verification using HMAC signature

## Validation Strategy

- **Client-side**: Basic field validation before submission (UX improvement)
- **Server-side**: Full schema validation using JSON Schema (security requirement)
- **Report Validation**: JSON Schema validation after LLM generation, with one repair attempt
- **Token Validation**: Cryptographic signature verification + expiration check
