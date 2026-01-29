/**
 * Request validation for Content Flywheel API
 * Topics and Generate endpoints
 */

const ALLOWED_GOALS = ['reduce cost', 'reduce risk', 'modernize', 'reliability', 'compliance'];
const ALLOWED_ASSET_TYPES = ['linkedin', 'blog', 'email', 'onepager', 'workshop_outline'];

export interface TopicSuggestionRequest {
  theme: string;
  audience: string;
  goals?: string[];
  constraints?: string;
  region?: string;
}

export interface AssetGenerationRequest {
  topic: { title: string; hook?: string; persona?: string; [k: string]: unknown };
  asset_types: string[];
  brand_voice?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: Record<string, string>;
}

export function validateTopicSuggestionRequest(body: unknown): ValidationResult<TopicSuggestionRequest> {
  const errors: Record<string, string> = {};
  if (body == null || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body must be a JSON object.' } };
  }
  const o = body as Record<string, unknown>;
  const theme = typeof o.theme === 'string' ? o.theme.trim() : '';
  const audience = typeof o.audience === 'string' ? o.audience.trim() : '';
  if (!theme) errors.theme = 'Theme is required.';
  if (!audience) errors.audience = 'Audience is required.';
  let goals: string[] | undefined;
  if (Array.isArray(o.goals)) {
    goals = o.goals.filter((g): g is string => typeof g === 'string');
    const invalid = goals.filter(g => !ALLOWED_GOALS.includes(g));
    if (invalid.length > 0) errors.goals = `Invalid goals: ${invalid.join(', ')}. Allowed: ${ALLOWED_GOALS.join(', ')}`;
  }
  const constraints = typeof o.constraints === 'string' ? o.constraints : undefined;
  const region = typeof o.region === 'string' ? o.region : undefined;
  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    data: { theme, audience, goals, constraints, region }
  };
}

export function validateAssetGenerationRequest(body: unknown): ValidationResult<AssetGenerationRequest> {
  const errors: Record<string, string> = {};
  if (body == null || typeof body !== 'object') {
    return { valid: false, errors: { body: 'Request body must be a JSON object.' } };
  }
  const o = body as Record<string, unknown>;
  const topic = o.topic;
  if (topic == null || typeof topic !== 'object' || Array.isArray(topic)) {
    errors.topic = 'Topic object is required.';
  } else {
    const title = (topic as Record<string, unknown>).title;
    if (typeof title !== 'string' || !title.trim()) {
      errors.topic = 'Topic title is required.';
    }
  }
  const asset_types = o.asset_types;
  if (!Array.isArray(asset_types) || asset_types.length === 0) {
    errors.asset_types = 'At least one asset type is required.';
  } else {
    const invalid = asset_types.filter((t): t is string => typeof t === 'string' && !ALLOWED_ASSET_TYPES.includes(t));
    if (invalid.length > 0) {
      errors.asset_types = `Invalid asset types: ${invalid.join(', ')}. Allowed: ${ALLOWED_ASSET_TYPES.join(', ')}`;
    }
  }
  if (Object.keys(errors).length > 0) return { valid: false, errors };
  const topicObj = topic as Record<string, unknown>;
  return {
    valid: true,
    data: {
      topic: {
        title: String(topicObj.title).trim(),
        hook: typeof topicObj.hook === 'string' ? topicObj.hook : undefined,
        persona: typeof topicObj.persona === 'string' ? topicObj.persona : undefined,
        ...topicObj
      },
      asset_types: asset_types.filter((t): t is string => typeof t === 'string'),
      brand_voice: o.brand_voice && typeof o.brand_voice === 'object' ? (o.brand_voice as Record<string, unknown>) : undefined,
      constraints: o.constraints && typeof o.constraints === 'object' ? (o.constraints as Record<string, unknown>) : undefined
    }
  };
}
