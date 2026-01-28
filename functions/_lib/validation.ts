/**
 * JSON Schema validation utilities
 * Uses Ajv for schema validation compatible with Cloudflare Workers
 * Note: Schemas are defined inline for Workers compatibility
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

// Initialize Ajv with formats support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Submission schema (inline for Workers compatibility)
const submissionSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["org_name", "contact_name", "email", "org_size", "current_tools", "top_pain_points", "backups_maturity", "security_confidence", "budget_comfort", "timeline"],
  "properties": {
    "org_name": { "type": "string", "minLength": 1, "maxLength": 200 },
    "contact_name": { "type": "string", "minLength": 1, "maxLength": 200 },
    "email": { "type": "string", "format": "email", "maxLength": 254 },
    "org_size": { "type": "string", "enum": ["1-10", "11-50", "51-200", "200+"] },
    "current_tools": { "type": "array", "items": { "type": "string" }, "minItems": 1, "maxItems": 20 },
    "top_pain_points": { "type": "array", "items": { "type": "string" }, "minItems": 1, "maxItems": 10 },
    "backups_maturity": { "type": "string", "enum": ["none", "basic", "regular", "automated", "cloud-based"] },
    "security_confidence": { "type": "string", "enum": ["very_low", "low", "moderate", "high", "very_high"] },
    "budget_comfort": { "type": "string", "enum": ["very_limited", "limited", "moderate", "comfortable", "flexible"] },
    "timeline": { "type": "string", "enum": ["immediate", "1-3 months", "3-6 months", "6-12 months", "flexible"] },
    "notes": { "type": "string", "maxLength": 1000 },
    "honeypot": { "type": "string", "maxLength": 0 }
  },
  "additionalProperties": false
};

// Report schema (simplified - full schema would be very long inline)
// For production, consider loading from file or using a schema registry
const reportSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["version", "summary", "readiness_score", "readiness_label", "top_risks", "top_priorities", "do_not_worry_yet", "next_steps", "recommended_entry_offer", "admin_notes"],
  "properties": {
    "version": { "type": "string", "const": "1" },
    "summary": { "type": "string", "minLength": 50, "maxLength": 500 },
    "readiness_score": { "type": "integer", "minimum": 1, "maximum": 5 },
    "readiness_label": { "type": "string", "enum": ["Watch", "Plan", "Act"] },
    "top_risks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description", "severity"],
        "properties": {
          "title": { "type": "string", "minLength": 5, "maxLength": 100 },
          "description": { "type": "string", "minLength": 20, "maxLength": 300 },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] }
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
          "title": { "type": "string", "minLength": 5, "maxLength": 100 },
          "description": { "type": "string", "minLength": 20, "maxLength": 300 },
          "impact": { "type": "string", "minLength": 10, "maxLength": 200 }
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
          "title": { "type": "string", "minLength": 5, "maxLength": 100 },
          "description": { "type": "string", "minLength": 20, "maxLength": 300 }
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
          "title": { "type": "string", "minLength": 5, "maxLength": 100 },
          "description": { "type": "string", "minLength": 20, "maxLength": 300 },
          "timeline": { "type": "string", "minLength": 5, "maxLength": 50 }
        },
        "additionalProperties": false
      },
      "minItems": 3,
      "maxItems": 6
    },
    "recommended_entry_offer": { "type": "string", "enum": ["Free resources", "Fixed-price assessment", "Short call"] },
    "admin_notes": { "type": "string", "minLength": 10, "maxLength": 500 }
  },
  "additionalProperties": false
};

// Compile schemas
const validateSubmission = ajv.compile(submissionSchema);
const validateReport = ajv.compile(reportSchema);

export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Validates a health check submission against the schema
 */
export function validateHealthCheckSubmission(data: unknown): ValidationResult {
  const valid = validateSubmission(data);

  if (!valid && validateSubmission.errors) {
    const errors = validateSubmission.errors.map(err => ({
      field: err.instancePath || (err.params as any)?.missingProperty || 'unknown',
      message: err.message || 'Validation error'
    }));

    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Validates a health check report against the schema
 */
export function validateHealthCheckReport(data: unknown): ValidationResult {
  const valid = validateReport(data);

  if (!valid && validateReport.errors) {
    const errors = validateReport.errors.map(err => ({
      field: err.instancePath || (err.params as any)?.missingProperty || 'unknown',
      message: err.message || 'Validation error'
    }));

    return { valid: false, errors };
  }

  return { valid: true };
}

/**
 * Validates honeypot field (must be empty)
 */
export function validateHoneypot(honeypot: string | undefined): boolean {
  return !honeypot || honeypot === '';
}

/**
 * Validates email format (basic check, schema does detailed validation)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
