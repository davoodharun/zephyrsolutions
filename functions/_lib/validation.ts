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
    "summary": { "type": "string", "minLength": 20, "maxLength": 500 },
    "readiness_score": { "type": "integer", "minimum": 1, "maximum": 5 },
    "readiness_label": { "type": "string", "enum": ["Watch", "Plan", "Act"] },
    "top_risks": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["title", "description", "severity"],
        "properties": {
          "title": { "type": "string", "minLength": 2, "maxLength": 100 },
          "description": { "type": "string", "minLength": 10, "maxLength": 300 },
          "severity": { "type": "string", "enum": ["low", "medium", "high"] }
        },
        "additionalProperties": true
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
          "title": { "type": "string", "minLength": 2, "maxLength": 100 },
          "description": { "type": "string", "minLength": 10, "maxLength": 300 },
          "impact": { "type": "string", "minLength": 5, "maxLength": 200 }
        },
        "additionalProperties": true
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
          "title": { "type": "string", "minLength": 2, "maxLength": 100 },
          "description": { "type": "string", "minLength": 10, "maxLength": 300 }
        },
        "additionalProperties": true
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
          "title": { "type": "string", "minLength": 2, "maxLength": 100 },
          "description": { "type": "string", "minLength": 10, "maxLength": 300 },
          "timeline": { "type": "string", "minLength": 2, "maxLength": 50 }
        },
        "additionalProperties": true
      },
      "minItems": 3,
      "maxItems": 6
    },
    "recommended_entry_offer": { "type": "string", "enum": ["Free resources", "Fixed-price assessment", "Short call"] },
    "admin_notes": { "type": "string", "minLength": 5, "maxLength": 500 }
  },
  "additionalProperties": true
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

/** Picks first non-empty string from obj using possible key names (case-insensitive). Coerces numbers/booleans to string. */
function pickStr(obj: Record<string, unknown>, keys: string[]): string {
  if (obj == null || typeof obj !== 'object') return '';
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v != null && v !== '') {
      const s = typeof v === 'string' ? v.trim() : String(v).trim();
      if (s) lower[k.toLowerCase()] = s;
    }
  }
  for (const key of keys) {
    const v = lower[key.toLowerCase()];
    if (v) return v;
  }
  return '';
}

/** Ensures value is an array (handles LLM returning object with numeric keys). */
function toArray(val: unknown): unknown[] {
  if (Array.isArray(val)) return val;
  if (val != null && typeof val === 'object' && !Array.isArray(val)) {
    const o = val as Record<string, unknown>;
    const keys = Object.keys(o).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
    if (keys.length > 0) return keys.map(k => o[k]);
  }
  return [];
}

/**
 * Normalizes LLM report output to match schema (version, enums, key-name mapping).
 * Maps common LLM key variants (risk_title, name, details, etc.) to schema keys.
 */
export function normalizeHealthCheckReport(data: Record<string, unknown>): Record<string, unknown> {
  const r = { ...data };

  if (r.version !== undefined) r.version = String(r.version).trim() || '1';
  else r.version = '1';

  const score = Number(r.readiness_score);
  r.readiness_score = (Number.isFinite(score) && score >= 1 && score <= 5) ? Math.round(score) : 3;

  const label = String(r.readiness_label ?? '').trim().toLowerCase();
  if (label === 'watch' || label === 'plan' || label === 'act') {
    r.readiness_label = label.charAt(0).toUpperCase() + label.slice(1);
  }

  const offerRaw = String(r.recommended_entry_offer ?? '').trim().toLowerCase();
  const exactMap: Record<string, string> = {
    'free resources': 'Free resources', 'free resource': 'Free resources',
    'fixed-price assessment': 'Fixed-price assessment', 'fixed price assessment': 'Fixed-price assessment',
    'fixed-price': 'Fixed-price assessment', 'fixed price': 'Fixed-price assessment',
    'short call': 'Short call', 'short': 'Short call', 'schedule a call': 'Short call'
  };
  if (exactMap[offerRaw]) {
    r.recommended_entry_offer = exactMap[offerRaw];
  } else if (offerRaw.length > 0) {
    if (offerRaw.includes('short') || offerRaw.includes('call')) r.recommended_entry_offer = 'Short call';
    else if (offerRaw.includes('fixed') || offerRaw.includes('assessment')) r.recommended_entry_offer = 'Fixed-price assessment';
    else r.recommended_entry_offer = 'Free resources';
  }

  const severityMap: Record<string, string> = { low: 'low', medium: 'medium', high: 'high' };
  r.top_risks = toArray(r.top_risks).map(item => {
    const i = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const title = pickStr(i, ['title', 'risk_title', 'name', 'risk', 'risk_name', 'heading']);
    const description = pickStr(i, ['description', 'details', 'explanation', 'risk_description', 'detail']);
    let severity = pickStr(i, ['severity', 'level', 'risk_level']);
    severity = severityMap[severity.toLowerCase()] || 'medium';
    return { title: title || 'Risk', description: description || 'See assessment.', severity };
  });

  r.top_priorities = toArray(r.top_priorities).map(item => {
    const i = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const title = pickStr(i, ['title', 'priority', 'name', 'heading']);
    const description = pickStr(i, ['description', 'details', 'explanation', 'detail']);
    const impact = pickStr(i, ['impact', 'impact_description', 'why', 'rationale']);
    return { title: title || 'Priority', description: description || 'See assessment.', impact: impact || 'High impact.' };
  });

  r.do_not_worry_yet = toArray(r.do_not_worry_yet).map(item => {
    const i = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const title = pickStr(i, ['title', 'name', 'heading', 'item']);
    const description = pickStr(i, ['description', 'details', 'explanation', 'detail']);
    return { title: title || 'Item', description: description || 'Acceptable for now.' };
  });

  r.next_steps = toArray(r.next_steps).map(item => {
    const i = item != null && typeof item === 'object' ? (item as Record<string, unknown>) : {};
    const title = pickStr(i, ['title', 'step', 'name', 'action', 'heading']);
    const description = pickStr(i, ['description', 'details', 'explanation', 'detail']);
    const timeline = pickStr(i, ['timeline', 'when', 'timeframe', 'due', 'time_frame', 'duration']);
    return { title: title || 'Step', description: description || 'See assessment.', timeline: timeline || 'Soon' };
  });

  // Pad arrays to meet schema minItems
  const riskFallback = { title: 'General risk', description: 'Review during assessment.', severity: 'medium' as const };
  while ((r.top_risks as unknown[]).length < 2) (r.top_risks as unknown[]).push(riskFallback);
  const priorityFallback = { title: 'Priority item', description: 'Review during assessment.', impact: 'High impact.' };
  while ((r.top_priorities as unknown[]).length < 2) (r.top_priorities as unknown[]).push(priorityFallback);
  const worryFallback = { title: 'Item', description: 'Acceptable for now.' };
  while ((r.do_not_worry_yet as unknown[]).length < 1) (r.do_not_worry_yet as unknown[]).push(worryFallback);
  const stepFallback = { title: 'Next step', description: 'See assessment.', timeline: 'Soon' };
  while ((r.next_steps as unknown[]).length < 3) (r.next_steps as unknown[]).push(stepFallback);

  (r.top_risks as unknown[]).splice(5);
  (r.top_priorities as unknown[]).splice(4);
  (r.do_not_worry_yet as unknown[]).splice(3);
  (r.next_steps as unknown[]).splice(6);

  if (typeof r.summary !== 'string' || (r.summary as string).trim().length < 20) {
    r.summary = (typeof r.summary === 'string' && (r.summary as string).trim()) ? (r.summary as string).trim() : 'IT assessment completed. Review the report sections for details and next steps.';
    if ((r.summary as string).length < 20) r.summary = 'IT assessment completed. Review the report sections below for details and next steps.';
  } else {
    r.summary = (r.summary as string).trim();
  }
  if (typeof r.admin_notes !== 'string' || (r.admin_notes as string).trim().length < 5) {
    r.admin_notes = (typeof r.admin_notes === 'string' && (r.admin_notes as string).trim()) ? (r.admin_notes as string).trim() : 'Review lead and follow up.';
  } else {
    r.admin_notes = (r.admin_notes as string).trim();
  }

  return r;
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
