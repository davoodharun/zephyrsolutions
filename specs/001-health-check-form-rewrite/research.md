# Research: Health Check Form Full-Stack Rewrite

**Branch**: `001-health-check-form-rewrite` | **Plan**: [plan.md](./plan.md)

## 1. Assessment name and positioning

**Decision**: Use a clear, plain-language name and one- to two-sentence purpose on the health check page (e.g. “Free IT & Web Assessment” with copy stating it’s free and helps identify what IT and web development support the organization might need). Exact headline can be tuned in copy; the spec does not mandate a single string.

**Rationale**: Spec requires a clear name and short explanation so non-technical visitors understand value before starting. “Free IT & Web Assessment” is more descriptive than “IT Health Check” and aligns with FR-001.

**Alternatives considered**: Keeping “IT Health Check” with only expanded intro (acceptable if stakeholder prefers); “Technology Readiness Assessment” (more formal; “IT & Web” is preferred for audience).

---

## 2. “Not Sure” placement and storage

**Decision**: Add a “Not Sure” option to at least **Backup Strategy Maturity** and **Security Confidence Level**. Store as the value `not_sure` in the submission payload and in Notion (existing rich_text fields accept any string). Report/LLM logic must treat `not_sure` as a valid, non-failing value (e.g. neutral or “prefer not to say” in the report).

**Rationale**: FR-004 requires at least one select to offer “Not Sure”; backups and security are the most jargon-sensitive and uncertainty-prone. Storing a distinct value keeps analytics and reporting explicit; backend and Notion already accept arbitrary strings for these fields.

**Alternatives considered**: Null/empty for “Not Sure” (rejected: complicates required-field validation). Adding “Not Sure” to all selects (acceptable as future enhancement; spec requires “at least one”).

---

## 3. Expanded tools and pain points (values)

**Decision**: Add to **Current Tools**: Excel, Slack, Microsoft Teams, Google Forms, Google Sheets, SharePoint (in addition to existing options). Add to **Pain Points**: Large maintenance overhead, Too much time on repetitive tasks, Website maintenance (in addition to existing). Use exact labels in the form; submission sends these strings. No change to Notion property types (Tools and Pain Points remain rich_text).

**Rationale**: FR-002 and FR-003 require these options. Schema already allows arbitrary strings for `current_tools` and `top_pain_points`; no backend or Notion schema change required for new values.

**Alternatives considered**: Restricting to a fixed enum in JSON Schema (rejected: would require schema and API change; current design is open strings). Adding only a subset (rejected: spec lists minimum set).

---

## 4. Helper text and non-technical explanations

**Decision**: Add brief, plain-language explanations for at least one question (e.g. “Backup Strategy Maturity” or “Security Confidence”) using existing `field-help` or equivalent pattern already used on the form. No new UI framework; reuse current markup and CSS.

**Rationale**: FR-004 requires at least one question to have a visible explanation. Existing form already has “Select all that apply” and “Additional context” help; extend the same pattern.

**Alternatives considered**: Tooltips only (rejected: less accessible). Long descriptions for every question (out of scope; “at least one” suffices).

---

## 5. Home page highlight and CTA

**Decision**: Add at least one visible element on the home page (e.g. CTA, card, or section) that highlights the free assessment and links to `/health-check/`. Prefer above-the-fold or primary content area (SC-003). Implement via content/template change in `content/pages/index.md` (and layout/section if needed).

**Rationale**: FR-006 and SC-003 require a visible, clickable path to the form from the home page. Current index has hero, about, services, work, contact; adding a dedicated CTA or card keeps structure clear and avoids burying the link in the footer.

**Alternatives considered**: Link only in nav (acceptable if prominent; spec encourages “at least one element” in main content). Separate landing page (out of scope; link to existing form page suffices).

---

## 6. Notion CSV and schema alignment

**Decision**: Notion stores Tools and Pain Points as rich_text, so new tool/pain point values do **not** require Notion schema or property changes. The only new *enum* value introduced is `not_sure` for backups_maturity and security_confidence; Notion already stores these as rich_text, so no Notion schema update is required. If the site owner later wants a reference of allowed values (e.g. for reporting or imports), deliver an optional CSV (or markdown table) listing: (1) form field name, (2) allowed values including “Not Sure”, and (3) brief instructions (e.g. “Notion properties are rich_text; values are free-form. Use this list for consistency.”). Document in `docs/health-check-setup.md` or in this spec folder.

**Rationale**: FR-007 requires a CSV (or equivalent) only “if form changes require Notion database updates.” Current form and Notion mapping do not require Notion schema changes; providing an optional reference CSV satisfies “equivalent” and supports future imports or consistency checks.

**Alternatives considered**: Automated Notion schema migration (out of scope per spec). No CSV (acceptable only if we declare no Notion updates; providing a reference CSV is low effort and aligns with FR-007 when “structure” is interpreted to include allowed-value documentation).
