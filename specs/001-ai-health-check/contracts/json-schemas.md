# JSON Schemas: Health Check Data Structures

**Feature**: 001-ai-health-check  
**Date**: 2026-01-26

## HealthCheckSubmission Schema

Schema for validating form submission payloads.

**File**: `schema/healthcheck_submission.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "org_name",
    "contact_name",
    "email",
    "org_size",
    "current_tools",
    "top_pain_points",
    "backups_maturity",
    "security_confidence",
    "budget_comfort",
    "timeline"
  ],
  "properties": {
    "org_name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    },
    "contact_name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    },
    "email": {
      "type": "string",
      "format": "email",
      "maxLength": 254
    },
    "org_size": {
      "type": "string",
      "enum": ["1-10", "11-50", "51-200", "200+"]
    },
    "current_tools": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "maxItems": 20
    },
    "top_pain_points": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "maxItems": 10
    },
    "backups_maturity": {
      "type": "string",
      "enum": ["none", "basic", "regular", "automated", "cloud-based"]
    },
    "security_confidence": {
      "type": "string",
      "enum": ["very_low", "low", "moderate", "high", "very_high"]
    },
    "budget_comfort": {
      "type": "string",
      "enum": ["very_limited", "limited", "moderate", "comfortable", "flexible"]
    },
    "timeline": {
      "type": "string",
      "enum": ["immediate", "1-3 months", "3-6 months", "6-12 months", "flexible"]
    },
    "notes": {
      "type": "string",
      "maxLength": 1000
    },
    "honeypot": {
      "type": "string",
      "maxLength": 0
    }
  },
  "additionalProperties": false
}
```

**Validation Rules**:
- All required fields must be present
- Email must be valid email format
- Enum values must match exactly
- Array fields must have at least one item
- Honeypot field must be empty string
- No additional properties allowed

---

## HealthCheckReport Schema

Schema for validating LLM-generated report JSON.

**File**: `schema/healthcheck_report.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "version",
    "summary",
    "readiness_score",
    "readiness_label",
    "top_risks",
    "top_priorities",
    "do_not_worry_yet",
    "next_steps",
    "recommended_entry_offer",
    "admin_notes"
  ],
  "properties": {
    "version": {
      "type": "string",
      "const": "1"
    },
    "summary": {
      "type": "string",
      "minLength": 50,
      "maxLength": 500
    },
    "readiness_score": {
      "type": "integer",
      "minimum": 1,
      "maximum": 5
    },
    "readiness_label": {
      "type": "string",
      "enum": ["Watch", "Plan", "Act"]
    },
    "top_risks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description", "severity"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 5,
            "maxLength": 100
          },
          "description": {
            "type": "string",
            "minLength": 20,
            "maxLength": 300
          },
          "severity": {
            "type": "string",
            "enum": ["low", "medium", "high"]
          }
        },
        "additionalProperties": false
      },
      "minItems": 2,
      "maxItems": 5
    },
    "top_priorities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description", "impact"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 5,
            "maxLength": 100
          },
          "description": {
            "type": "string",
            "minLength": 20,
            "maxLength": 300
          },
          "impact": {
            "type": "string",
            "minLength": 10,
            "maxLength": 200
          }
        },
        "additionalProperties": false
      },
      "minItems": 2,
      "maxItems": 4
    },
    "do_not_worry_yet": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 5,
            "maxLength": 100
          },
          "description": {
            "type": "string",
            "minLength": 20,
            "maxLength": 300
          }
        },
        "additionalProperties": false
      },
      "minItems": 1,
      "maxItems": 3
    },
    "next_steps": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description", "timeline"],
        "properties": {
          "title": {
            "type": "string",
            "minLength": 5,
            "maxLength": 100
          },
          "description": {
            "type": "string",
            "minLength": 20,
            "maxLength": 300
          },
          "timeline": {
            "type": "string",
            "minLength": 5,
            "maxLength": 50
          }
        },
        "additionalProperties": false
      },
      "minItems": 3,
      "maxItems": 6
    },
    "recommended_entry_offer": {
      "type": "string",
      "enum": ["Free resources", "Fixed-price assessment", "Short call"]
    },
    "admin_notes": {
      "type": "string",
      "minLength": 10,
      "maxLength": 500
    }
  },
  "additionalProperties": false
}
```

**Validation Rules**:
- Version must be exactly "1"
- All required fields must be present
- Array lengths must be within specified ranges
- Readiness score must be between 1 and 5
- All string fields must meet length requirements
- Enum values must match exactly
- No additional properties allowed
- No markdown formatting in strings (pure text only)

**Repair Strategy**:
- If validation fails, attempt one repair pass using LLM repair prompt
- Repair prompt receives invalid JSON + schema errors
- Repair prompt outputs corrected JSON only
- Re-validate repaired JSON
- If repair succeeds, use repaired JSON; if repair fails, mark for manual review

---

## Schema Versioning

- Current version: "1"
- Future versions will increment (e.g., "2", "3")
- Version field in report allows backward compatibility
- Schema files are versioned in Git alongside code

---

## Validation Implementation

**Client-side**: Basic validation for UX (optional, not security-critical)  
**Server-side**: Full JSON Schema validation (required for security)

**Validation Library**: Use a JSON Schema validator compatible with Cloudflare Workers runtime (e.g., Ajv, jsonschema)

**Error Messages**: Return specific field-level errors for submission validation; generic errors for report validation (to avoid exposing internal structure)
