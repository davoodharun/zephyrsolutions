/**
 * POST /api/content/generate
 * Generates content assets for a selected topic.
 */

import type { Env } from '../../types';
import { validateContentEnv } from '../../_lib/env';
import { validateAssetGenerationRequest } from '../../_lib/validation-content';
import { generateContentJson } from '../../_lib/llm';

const BRAND_SAFETY = `Plain English, nonprofit-friendly. No fear-mongering or shaming. No mention of "AI", prompts, or internal systems. No unsubstantiated certification/compliance claims. Gentle disclaimers where appropriate.`;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'content';
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

interface ContentAsset {
  type: string;
  variant?: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  slug: string;
  suggested_filename?: string;
}

function dateSlug(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

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

    const validation = validateAssetGenerationRequest(body);
    if (!validation.valid || !validation.data) {
      return new Response(
        JSON.stringify({ ok: false, error: 'validation_failed', errors: validation.errors }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      );
    }

    const { topic, asset_types: requestedTypes } = validation.data;
    const topicTitle = topic.title ?? '';
    const topicHook = topic.hook ?? '';
    const topicPersona = topic.persona ?? '';
    const slug = slugify(topicTitle);
    const today = dateSlug();
    const assets: ContentAsset[] = [];
    const errors: string[] = [];

    const systemPrompt = `You are a content strategist for a consultant marketing to small orgs and nonprofits. ${BRAND_SAFETY} Output only valid JSON.`;

    const delayBetweenAssetsMs = 1500; // reduce burst rate-limiting (RPM)
    async function delay(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (let i = 0; i < requestedTypes.length; i++) {
      const assetType = requestedTypes[i];
      if (i > 0) await delay(delayBetweenAssetsMs);
      try {
        if (assetType === 'linkedin') {
          const userPrompt = `Topic: ${topicTitle}
${topicHook ? `Hook: ${topicHook}` : ''}
${topicPersona ? `Persona: ${topicPersona}` : ''}

Generate 3 LinkedIn post variants (120–220 words each):
1. Educational variant: hook + 3–6 short paragraphs; end with soft CTA (e.g. "If helpful, I can share a checklist").
2. Story variant: mini case or story angle; end with soft CTA.
3. Checklist variant: list-based; end with "Reply 'checklist' and I'll send it" or similar.

Output a JSON object with key "variants", an array of exactly 3 objects. Each object: { "variant": "educational"|"story"|"checklist", "title": "...", "content": "..." }. No markdown in content.`;
          const raw = await generateContentJson(systemPrompt, userPrompt, env, 1500);
          const parsed = JSON.parse(raw) as { variants?: Array<{ variant?: string; title?: string; content?: string }> };
          const variants = Array.isArray(parsed.variants) ? parsed.variants : [];
          const variantLabels = ['educational', 'story', 'checklist'];
          variants.slice(0, 3).forEach((v, i) => {
            const variant = v.variant ?? variantLabels[i] ?? 'educational';
            assets.push({
              type: 'linkedin',
              variant,
              title: v.title ?? topicTitle,
              content: v.content ?? '',
              metadata: { word_count: (v.content ?? '').split(/\s+/).length },
              slug,
              suggested_filename: `${today}-${slug}-${variant}.md`
            });
          });
        } else if (assetType === 'blog') {
          const userPrompt = `Topic: ${topicTitle}
${topicHook ? `Hook: ${topicHook}` : ''}
${topicPersona ? `Persona: ${topicPersona}` : ''}

Write a blog post (600–1200 words). H2 sections, scannable. Include: problem framing for small orgs, practical steps, "What not to do yet" section, short CTA at end.

Output a JSON object: { "title": "...", "content": "..." } (content is markdown with H2s). No code fences.`;
          const raw = await generateContentJson(systemPrompt, userPrompt, env, 2500);
          const parsed = JSON.parse(raw) as { title?: string; content?: string };
          assets.push({
            type: 'blog',
            title: parsed.title ?? topicTitle,
            content: parsed.content ?? '',
            metadata: { word_count: (parsed.content ?? '').split(/\s+/).length },
            slug,
            suggested_filename: `${today}-${slug}.md`
          });
        } else if (assetType === 'email') {
          const userPrompt = `Topic: ${topicTitle}
${topicPersona ? `Persona: ${topicPersona}` : ''}

Write an email newsletter (150–300 words). Conversational, value-first. 1 CTA max.

Output a JSON object: { "subject": "...", "preview_text": "...", "title": "...", "content": "..." }. No markdown in content.`;
          const raw = await generateContentJson(systemPrompt, userPrompt, env, 800);
          const parsed = JSON.parse(raw) as { subject?: string; preview_text?: string; title?: string; content?: string };
          assets.push({
            type: 'email',
            title: parsed.title ?? parsed.subject ?? topicTitle,
            content: parsed.content ?? '',
            metadata: { subject: parsed.subject ?? topicTitle, preview_text: parsed.preview_text },
            slug,
            suggested_filename: `${today}-${slug}.md`
          });
        } else if (assetType === 'onepager') {
          const userPrompt = `Topic: ${topicTitle}
${topicPersona ? `Persona: ${topicPersona}` : ''}

Write a board-friendly one-pager (markdown). Title + 5–7 bullet sections: Risk/Impact, What good looks like, Recommended next 30 days, Cost bands ($ / $$ / $$$). No jargon.

Output a JSON object: { "title": "...", "content": "..." } (content is markdown).`;
          const raw = await generateContentJson(systemPrompt, userPrompt, env, 1500);
          const parsed = JSON.parse(raw) as { title?: string; content?: string };
          assets.push({
            type: 'onepager',
            title: parsed.title ?? topicTitle,
            content: parsed.content ?? '',
            slug,
            suggested_filename: `${today}-${slug}.md`
          });
        } else if (assetType === 'workshop_outline') {
          const userPrompt = `Topic: ${topicTitle}
${topicPersona ? `Persona: ${topicPersona}` : ''}

Write a 30–45 minute workshop outline. 5–7 sections, each with talking points.

Output a JSON object: { "title": "...", "content": "..." } (content is markdown with sections and talking points).`;
          const raw = await generateContentJson(systemPrompt, userPrompt, env, 1200);
          const parsed = JSON.parse(raw) as { title?: string; content?: string };
          assets.push({
            type: 'workshop_outline',
            title: parsed.title ?? topicTitle,
            content: parsed.content ?? '',
            slug,
            suggested_filename: `${today}-${slug}.md`
          });
        } else {
          errors.push(`${assetType}: unsupported type`);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`Asset generation failed for ${assetType}:`, msg);
        errors.push(`${assetType}: ${msg.slice(0, 80)}`);
      }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        topic_title: topicTitle,
        generated_at: new Date().toISOString(),
        assets,
        errors
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('Generate endpoint failed:', msg);
    const isConfig = /LLM_API_KEY|environment variable/i.test(msg);
    const body = isConfig
      ? { ok: false, error: 'content_api_not_configured', message: 'Content API is not configured. Set LLM_API_KEY in Cloudflare Pages environment variables (Production and Preview).' }
      : { ok: false, error: 'asset_generation_failed', message: 'Content generation failed. Please try again.' };
    return new Response(JSON.stringify(body), {
      status: isConfig ? 503 : 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() }
    });
  }
};
