# Feature Specification: AI-Driven Nonprofit IT Health Check Workflow

**Feature Branch**: `001-ai-health-check`  
**Created**: 2026-01-26  
**Status**: Draft  
**Input**: User description: "please use the sepcification in @LeadGeneration.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Completes Health Check Assessment (Priority: P1)

A nonprofit organization representative visits the marketing website and discovers an IT Health Check assessment. They complete a short form (10-12 questions) about their organization's technology situation, including organization size, current tools, pain points, security confidence, and budget comfort. Upon submission, they immediately see a success message indicating their results will be emailed shortly.

**Why this priority**: This is the primary entry point for lead generation. Without a working form and submission flow, no leads can be captured and no value is delivered to potential clients.

**Independent Test**: Can be fully tested by a visitor completing the form and receiving immediate confirmation, delivering the core value proposition of the assessment.

**Acceptance Scenarios**:

1. **Given** a visitor is on the health check landing page, **When** they complete all required form fields and submit, **Then** they see a success message indicating their results will be emailed within minutes
2. **Given** a visitor submits the form with invalid or missing required fields, **When** they attempt to submit, **Then** they see clear validation errors indicating what needs to be corrected
3. **Given** a visitor submits the form with a honeypot field filled, **When** the form is submitted, **Then** the submission is silently rejected without showing an error to the bot
4. **Given** a visitor completes the form successfully, **When** they submit, **Then** the form data is validated and processed without exposing sensitive information in browser console or network logs

---

### User Story 2 - Visitor Receives Personalized Health Check Report via Email (Priority: P1)

After submitting the health check form, the visitor receives an email within minutes containing a personalized assessment report. The email includes a summary of their readiness score, top priorities, and a secure link to view the full HTML report. The report provides actionable insights tailored to their organization's specific situation.

**Why this priority**: The email delivery is the primary value delivery mechanism. Without it, visitors receive no benefit from completing the assessment, undermining trust and lead quality.

**Independent Test**: Can be fully tested by submitting a form and verifying receipt of email with report summary and working report link within the expected timeframe.

**Acceptance Scenarios**:

1. **Given** a visitor has successfully submitted the health check form, **When** the system processes their submission, **Then** they receive an email within 5 minutes containing their readiness score, summary, and a link to the full report
2. **Given** a visitor receives the email, **When** they click the report link, **Then** they are taken to a branded HTML report page showing their personalized assessment
3. **Given** the report generation fails validation, **When** the system attempts one repair pass, **Then** if repair succeeds, the email is sent; if repair fails, a polite fallback email is sent and the lead is marked for manual review
4. **Given** a visitor receives the email, **When** they view it, **Then** the email content is warm, non-salesy, and includes a clear call-to-action based on their readiness level

---

### User Story 3 - Lead Data Appears in CRM System (Priority: P1)

When a visitor submits the health check form, their information and assessment results are automatically stored in the CRM system. The lead record includes all form responses, the generated readiness score and label, report summary, and full report JSON. This enables the business to follow up with qualified leads and track lead quality.

**Why this priority**: CRM integration is essential for lead management and follow-up. Without it, submitted assessments cannot be tracked or converted into business opportunities.

**Independent Test**: Can be fully tested by submitting a form and verifying the lead record appears in the CRM with all expected fields populated correctly.

**Acceptance Scenarios**:

1. **Given** a visitor submits the health check form, **When** the system processes the submission, **Then** a lead record is created in the CRM with status "pending_generation" containing all form field values
2. **Given** a lead record exists with status "pending_generation", **When** the report is successfully generated, **Then** the lead record is updated with status "sent", readiness score, readiness label, report summary, and full report JSON
3. **Given** report generation fails after repair attempt, **When** the system handles the failure, **Then** the lead record is updated with status "needs_manual_review" and a fallback email is sent
4. **Given** a lead record exists in the CRM, **When** viewing the record, **Then** all form responses, assessment results, and metadata are visible and searchable

---

### User Story 4 - Visitor Views Secure HTML Report (Priority: P2)

A visitor who receives the email can click the report link to view a full, branded HTML report page. The report link uses a secure, signed token that expires after a reasonable period. The report displays all assessment insights in a readable, professional format without exposing internal system details.

**Why this priority**: While email delivery is P1, the HTML report provides additional value and engagement. It's a secondary but important touchpoint that enhances the user experience.

**Independent Test**: Can be fully tested by clicking a valid report link from an email and verifying the HTML report renders correctly with all expected content.

**Acceptance Scenarios**:

1. **Given** a visitor has a valid report link from their email, **When** they click the link, **Then** they see a branded HTML report page displaying their readiness score, label, summary, top risks, priorities, and next steps
2. **Given** a visitor attempts to access a report link with an expired or invalid token, **When** they navigate to the link, **Then** they see an appropriate error message without exposing internal system details
3. **Given** a visitor views the report page, **When** they examine the content, **Then** all information is presented in plain English without technical jargon, tailored to nonprofit organizations
4. **Given** a visitor views the report, **When** they see the recommendations, **Then** the recommendations are conservative, affordable, and appropriate for smaller organizations

---

### Edge Cases

- What happens when the LLM API is unavailable or times out during report generation?
- How does the system handle malformed or invalid JSON responses from the LLM?
- What happens if email delivery fails after successful report generation?
- How does the system handle duplicate submissions from the same email address?
- What happens when the CRM system (Notion) is unavailable during lead creation?
- How does the system handle form submissions that exceed rate limits?
- What happens if the report token secret is rotated while existing tokens are still valid?
- How does the system handle very long form responses or notes fields?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a web form with 10-12 fields for collecting nonprofit IT assessment information
- **FR-002**: System MUST validate all required form fields before processing submissions
- **FR-003**: System MUST include spam protection mechanisms (honeypot field at minimum)
- **FR-004**: System MUST generate a personalized IT health check report using AI/LLM based on form responses
- **FR-005**: System MUST validate generated report JSON against a defined schema before use
- **FR-006**: System MUST attempt one automatic repair if report JSON validation fails
- **FR-007**: System MUST create a lead record in the CRM system with status "pending_generation" upon form submission
- **FR-008**: System MUST update the lead record with assessment results (readiness score, label, summary, report JSON) after successful report generation
- **FR-009**: System MUST send an email to the visitor containing report summary and secure report link within 5 minutes of form submission
- **FR-010**: System MUST generate secure, signed tokens for report links that expire after 30 days
- **FR-011**: System MUST render a branded HTML report page when a valid report token is accessed
- **FR-012**: System MUST mark leads as "needs_manual_review" when report generation fails after repair attempt
- **FR-013**: System MUST send a polite fallback email when report generation fails
- **FR-014**: System MUST not log sensitive information (email addresses, form responses) in console or application logs
- **FR-015**: System MUST store all required secrets and API keys in secure environment variables
- **FR-016**: System MUST rate limit form submissions to prevent abuse
- **FR-017**: System MUST not expose internal CRM IDs or system details in report URLs or responses
- **FR-018**: System MUST process form submissions synchronously unless runtime limits require asynchronous processing

### Key Entities *(include if feature involves data)*

- **HealthCheckSubmission**: Represents the form data submitted by a visitor, including organization name, contact information, organization size, current tools, pain points, backup maturity, security confidence, budget comfort, timeline, and optional notes
- **HealthCheckReport**: Represents the AI-generated assessment report, including version, summary, readiness score (1-5), readiness label (Watch/Plan/Act), top risks (2-5 items), top priorities (2-4 items), items not to worry about yet (1-3 items), next steps (3-6 items), recommended entry offer, and admin notes
- **Lead**: Represents a CRM record containing the submission data, assessment results, status (pending_generation/sent/needs_manual_review), timestamps, and source identifier

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can complete and submit the health check form in under 3 minutes
- **SC-002**: 95% of successful form submissions result in email delivery within 5 minutes
- **SC-003**: 90% of generated reports pass JSON schema validation on first attempt
- **SC-004**: 100% of form submissions create a corresponding lead record in the CRM system
- **SC-005**: Report links remain accessible and functional for 30 days after generation
- **SC-006**: System processes form submissions without exposing sensitive data in logs or URLs
- **SC-007**: Email delivery success rate is above 98% for valid email addresses
- **SC-008**: Report generation and delivery workflow completes end-to-end in under 2 minutes for 90% of submissions
- **SC-009**: Leads marked for manual review receive fallback email within 5 minutes of submission
- **SC-010**: System handles rate limiting without blocking legitimate users (allows at least 10 submissions per hour per IP)

## Assumptions

- The existing marketing website is deployed on a static hosting platform that supports serverless functions
- A CRM system (Notion) is available and configured with appropriate API access
- An email delivery service (Resend or SendGrid) is available and configured
- An LLM API service (OpenAI-compatible) is available and configured
- Form submissions will primarily come from legitimate nonprofit organizations
- The assessment form will be embedded in or linked from the main marketing website
- Report generation will be synchronous unless runtime limits require asynchronous processing
- The system will use environment variables for all sensitive configuration (API keys, secrets)
- Report tokens will use HMAC signing for security
- The system will not store sensitive credentials or passwords from form submissions

## Non-Goals

- Rebuilding or modifying the existing website framework
- Storing sensitive credentials or passwords from leads
- Implementing aggressive automated drip marketing campaigns
- Building a full customer portal or dashboard
- Supporting multiple languages or internationalization
- Generating PDF reports (may be added in future milestone)
- Real-time chat or support features
- User accounts or authentication for visitors
- Integration with multiple CRM systems (Notion only for MVP)

## Dependencies

- Access to static hosting platform with serverless function support
- Access to Notion API with database creation and write permissions
- Access to email delivery service API (Resend or SendGrid)
- Access to LLM API service (OpenAI-compatible)
- Existing marketing website where form can be embedded or linked
- Environment variable configuration system for secrets management
