# Notion Reference: Health Check Form Allowed Values

**Purpose**: Reference of form field names and allowed values for Notion consistency, filtering, or imports. Notion properties (Tools, Pain Points, Backups, Security Confidence, etc.) are **rich_text**; values are free-form from the form. Use this list for consistency when reporting or importing.

| Form field | Notion property | Allowed values / notes |
|------------|----------------|------------------------|
| org_name | Org Name | Any string (title) |
| contact_name | Contact Name | Any string |
| email | Email | Email format |
| org_size | Org Size | 1-10; 11-50; 51-200; 200+ |
| current_tools | Tools | Microsoft Office; Excel; Google Workspace; Google Forms; Google Sheets; Slack; Microsoft Teams; SharePoint; Custom Software; Cloud Services (AWS, Azure, etc.); CRM System; Email Server; Website/CMS; Other |
| top_pain_points | Pain Points | Data backup concerns; Security concerns; Outdated systems; Limited IT support; Integration issues; Budget constraints; Staff training; Compliance requirements; Large maintenance overhead; Too much time on repetitive tasks; Website maintenance |
| backups_maturity | Backups | none; basic; regular; automated; cloud-based; not_sure |
| security_confidence | Security Confidence | very_low; low; moderate; high; very_high; not_sure |
| budget_comfort | Budget Comfort | very_limited; limited; moderate; comfortable; flexible |
| timeline | Timeline | immediate; 1-3 months; 3-6 months; 6-12 months; flexible |

**Source of truth**: Form markup in `content/pages/health-check.md` and `schema/healthcheck_submission.schema.json`. Notion does not require schema changes; properties are rich_text and accept any string.
