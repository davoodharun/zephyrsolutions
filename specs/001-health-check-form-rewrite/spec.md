# Feature Specification: Health Check Form Full-Stack Rewrite

**Feature Branch**: `001-health-check-form-rewrite`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: Full stack edit of the health check form using health-check-rewrite.md (clearer naming, more options, non-technical audience, home page highlights, Notion CSV if needed)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Clear Assessment Name and Purpose (Priority: P1)

As a non-technical visitor, I want to see a clear name and short explanation of the assessment (e.g. that it’s a free assessment to see what types of IT and web development support your organization might need) so I understand the value before starting.

**Why this priority**: Without this, visitors may not understand what “IT Health Check” means and may not start the form.

**Independent Test**: Visit the health check entry page; confirm the heading and/or intro text state that it’s a free assessment and explain its purpose in plain language. No form submission required.

**Acceptance Scenarios**:

1. **Given** a visitor lands on the health check page, **When** they read the main heading and intro, **Then** they see that it’s a free assessment and what it’s for (IT and web development needs).
2. **Given** the current label is “IT Health Check”, **When** the rewrite is applied, **Then** the name is either improved in place or replaced with a clearer label (e.g. “Free IT & Web Assessment”) and the purpose is explained in one or two sentences.

---

### User Story 2 - Expanded Form Options (Priority: P2)

As a visitor, I want to choose from more current tools (e.g. Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint) and more pain points (e.g. large maintenance overhead, too much time on repetitive tasks, website maintenance) so my answers better reflect my situation.

**Why this priority**: Richer options improve data quality and relevance of the generated report; the form remains the core of the flow.

**Independent Test**: Open the form; confirm Current Tools and Pain Points (or equivalent) include the new options. Submit a test response and confirm the backend accepts and stores them.

**Acceptance Scenarios**:

1. **Given** the visitor is on the form, **When** they view Current Tools, **Then** the list includes at least: Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint (in addition to any existing options).
2. **Given** the visitor is on the form, **When** they view Pain Points, **Then** the list includes at least: large maintenance overhead, too much time doing repetitive tasks, website maintenance (in addition to any existing options).
3. **Given** the visitor submits the form with only new options selected, **Then** the submission is accepted and the data is stored (e.g. in Notion or existing backend) without error.

---

### User Story 3 - Non-Technical Audience and “Not Sure” (Priority: P3)

As a non-technical visitor, I want brief explanations next to some questions and “Not Sure” (or equivalent) where it makes sense so I can complete the form without feeling blocked by jargon or uncertainty.

**Why this priority**: Reduces abandonment and improves completion for the target audience.

**Independent Test**: Complete the form as a non-technical user; confirm at least one question has a short explanation and at least one select has a “Not Sure” (or similar) option; confirm submission succeeds.

**Acceptance Scenarios**:

1. **Given** the form is displayed, **When** a question is technical or could be unclear, **Then** a brief, plain-language explanation is visible (e.g. helper text or short description).
2. **Given** a question where “Not Sure” is appropriate (e.g. backups maturity, security confidence), **When** the visitor views the options, **Then** a “Not Sure” (or equivalent) option is available.
3. **Given** the visitor selects “Not Sure” where offered, **When** they submit, **Then** the submission is valid and stored; the downstream report or logic handles “Not Sure” without error.

---

### User Story 4 - Home Page Highlights and Guidance (Priority: P4)

As a visitor on the home page, I want to see elements that highlight the free assessment and guide me to the form so I can find it without searching.

**Why this priority**: Increases discovery and traffic to the form.

**Independent Test**: Load the home page; confirm at least one visible element (e.g. CTA, card, banner) promotes the assessment and links to the form.

**Acceptance Scenarios**:

1. **Given** a visitor is on the home page, **When** they scan the main content, **Then** at least one element (e.g. CTA, section, or card) highlights the free assessment and includes a link to the form.
2. **Given** that element is present, **When** the visitor clicks the link, **Then** they land on the health check form (or its entry page).

---

### User Story 5 - Notion DB Alignment and CSV (Priority: P5)

As the site owner, if the form changes require Notion database updates (e.g. new property values or structure), I want a CSV (or equivalent) that I can use to update or import into Notion so the backend stays in sync with the form.

**Why this priority**: Ensures data continuity and avoids manual guesswork when syncing form and CRM.

**Independent Test**: After form and backend changes are defined, confirm a CSV (or equivalent artifact) exists that reflects any new options or structure needed for Notion, and that it’s documented how to use it.

**Acceptance Scenarios**:

1. **Given** the form has new Current Tools or Pain Points (or other enum-like) values, **When** the Notion database must support those values, **Then** a CSV (or equivalent) is provided that matches the expected Notion structure (e.g. property names and allowed values).
2. **Given** that artifact exists, **Then** brief instructions (e.g. in docs or spec) describe how to import or apply it in Notion.

---

### Edge Cases

- What if a visitor selects only “Not Sure” for every optional question? Submission should still be valid; report logic should handle missing or “Not Sure” values without failing.
- What if the home page is managed by a CMS and the “highlight” is content-only? The spec is satisfied by adding content and a link; implementation may be copy + link without code change if the CMS supports it.
- What if Notion does not need schema changes (e.g. tools and pain points are free text)? Then no CSV is required; the requirement is conditional on “if the Notion DB needs to be updated.”

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The health check entry page (or form page) MUST display a clear name and a short, plain-language explanation that the assessment is free and that it helps identify what IT and web development support the organization might need.
- **FR-002**: The form MUST include expanded Current Tools options: at least Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint, in addition to any existing options.
- **FR-003**: The form MUST include expanded Pain Points options: at least large maintenance overhead, too much time doing repetitive tasks, website maintenance, in addition to any existing options.
- **FR-004**: The form MUST cater to a non-technical audience: at least one question MUST have a brief, plain-language explanation visible to the user; and at least one select (e.g. backups, security confidence) MUST offer a “Not Sure” (or equivalent) option.
- **FR-005**: Submissions that include only new options and/or “Not Sure” MUST be accepted and stored by the existing backend (e.g. Notion) without validation or runtime errors.
- **FR-006**: The home page MUST include at least one element (e.g. CTA, card, or section) that highlights the free assessment and links to the health check form (or its entry page).
- **FR-007**: If form changes require Notion database updates (e.g. new property values or structure), the feature MUST deliver a CSV (or equivalent) suitable for Notion import, plus brief instructions on how to use it.

### Key Entities

- **Form submission**: Existing submission payload; may gain new allowed values for current_tools and top_pain_points (or equivalent fields). Structure remains compatible with existing API and Notion mapping.
- **Notion schema / CSV**: If backend schema changes, a CSV (or equivalent) documents property names and allowed values for import or configuration.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time, non-technical visitor can read the assessment name and purpose and complete the form (including using “Not Sure” where offered) in one sitting without needing to look up terms.
- **SC-002**: All new Current Tools and Pain Points options are selectable, submittable, and stored; no client or server validation errors when only new options are chosen.
- **SC-003**: The home page includes at least one visible, clickable path to the health check form; the path is above the fold or in a primary content area (not only in footer).
- **SC-004**: If Notion changes are required, a CSV (or equivalent) and usage instructions are delivered so the site owner can align the database with the form.

## Assumptions

- The existing health check API and Notion integration remain in use; changes are additive (new options, new copy, new home page elements) and backward compatible where possible.
- “Not Sure” is stored as a distinct value (or mapped to a safe default) so report generation and Notion do not break.
- Home page changes can be implemented within the current site structure (e.g. Eleventy + TinaCMS or static content); no separate app is required.
- The CSV for Notion is for manual or semi-manual import; no automated Notion schema migration is required for this feature.

## Out of Scope

- Changing the core report-generation or email flow; only form, copy, options, home page, and Notion alignment are in scope.
- Redesigning the entire site or CMS; only the health check form and home page elements described above.
