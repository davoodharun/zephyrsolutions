/**
 * POST /api/content/topics
 * Returns topic suggestions for a given theme and audience.
 */

import type { Env } from '../../types';
import { validateContentEnv } from '../../_lib/env';
import { validateTopicSuggestionRequest } from '../../_lib/validation-content';
import { generateContentJson } from '../../_lib/llm';

const SYSTEM_PROMPT = `You are a content strategist for a consultant marketing to small orgs and nonprofits. Generate exactly 10 distinct topic ideas. Output only valid JSON.`;

function buildUserPrompt(theme: string, audience: string, goals?: string[], constraints?: string, region?: string): string {
  return `Generate exactly 10 content topic ideas.

Input:
- Theme: ${theme}
- Audience: ${audience}
${goals?.length ? `- Goals: ${goals.join(', ')}` : ''}
${constraints ? `- Constraints: ${constraints}` : ''}
${region ? `- Region: ${region}` : ''}

Output a JSON object with a single key "topics" whose value is an array of exactly 10 objects. Each object MUST have only these keys:
- title (string): Short, specific topic title
- hook (string): One-line angle or hook
- persona (string): Who it's for (e.g. "nonprofit ED")
- why_it_matters (string): Brief rationale
- cta_type (string): One of "free resource", "assessment", "short call"
- difficulty (string): One of "low", "med", "high"

Output ONLY the JSON object. No markdown, no explanation.`;
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Content-API-Secret'
  };
}

function checkContentAuth(request: Request, env: Env): boolean {
  const secret = env.CONTENT_API_SECRET?.trim();
  if (!secret) return true;
  const auth = request.headers.get('Authorization');
  const headerSecret = request.headers.get('X-Content-API-Secret');
  if (auth?.startsWith('Bearer ')) return auth.slice(7) === secret;
  if (headerSecret) return headerSecret === secret;
  return false;
}

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: { ...corsHeaders(), 'Access-Control-Max-Age': '86400' }
  });
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  try {
    validateContentEnv(env);
    if (!checkContentAuth(request, env)) {
      return new Response(
        JSON.stringify({ ok: false, error: 'unauthorized', message: 'Missing or invalid authorization.' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ ok: false, error: 'validation_failed', errors: { body: 'Invalid JSON.' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    const validation = validateTopicSuggestionRequest(body);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ ok: false, error: 'validation_failed', errors: validation.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    const { theme, audience, goals, constraints, region } = validation.data;
    const userPrompt = buildUserPrompt(theme, audience, goals, constraints, region);
    const raw = await generateContentJson(SYSTEM_PROMPT, userPrompt, env, 2500);
    const parsed = JSON.parse(raw) as { topics?: unknown[] };
    let topics = Array.isArray(parsed.topics) ? parsed.topics : Array.isArray(parsed) ? parsed : [];
    topics = topics.slice(0, 10);
    const normalized = topics.map((t: any) => ({
      title: t?.title ?? '',
      hook: t?.hook ?? '',
      persona: t?.persona ?? audience,
      why_it_matters: t?.why_it_matters ?? '',
      cta_type: t?.cta_type ?? 'free resource',
      difficulty: t?.difficulty ?? 'med'
    }));

    return new Response(JSON.stringify({ ok: true, topics: normalized }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Topic generation failed:', msg);
    const isConfig = /LLM_API_KEY|environment variable/i.test(msg);
    const body = isConfig
      ? { ok: false, error: 'content_api_not_configured', message: 'Content API is not configured. Set LLM_API_KEY in Cloudflare Pages environment variables (Production and Preview).' }
      : { ok: false, error: 'topic_generation_failed', message: 'Could not generate topics. Please try again.' };
    return new Response(JSON.stringify(body), {
      status: isConfig ? 503 : 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
};
