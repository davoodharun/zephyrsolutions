# Asset Generation Prompt

Generate marketing content assets for a chosen topic. All outputs must follow brand voice and safety rules.

## Brand Voice & Safety Rules (MUST follow)

- Plain English, nonprofit-friendly, conservative recommendations
- No fear-mongering or shaming
- No mention of "AI", prompts, or internal systems
- No claims of certification/compliance unless explicitly provided
- Avoid legal/medical guarantees; include gentle disclaimers where appropriate
- Word counts: LinkedIn 120–220 each; blog 600–1200; email 150–300; one-pager 5–7 bullet sections; workshop 30–45 min with 5–7 sections

## Input

- **Topic**: {{TOPIC_TITLE}}
- **Hook/Angle** (optional): {{TOPIC_HOOK}}
- **Persona** (optional): {{TOPIC_PERSONA}}
- **Requested asset types**: {{ASSET_TYPES}}

## Asset Type Requirements

### LinkedIn (3 variants required when requested)
- 120–220 words each
- Variant A (educational): 1 hook line + 3–6 short paragraphs or bullets; end with soft CTA
- Variant B (story): Mini case study or story angle; end with soft CTA
- Variant C (checklist): List-based; end with "Reply 'checklist' and I'll send it" or similar
- No jargon; value-first

### Blog
- 600–1200 words
- H2 sections, scannable
- Include: problem framing for small orgs, practical steps, "What not to do yet" section, short CTA at end

### Email
- 150–300 words
- Subject line + preview text (metadata)
- Conversational, value-first; 1 CTA max

### One-pager (board-friendly)
- Title + 5–7 bullet sections: Risk/Impact, What good looks like, Recommended next 30 days, Cost bands ($ / $$ / $$$)
- No jargon; board-ready language

### Workshop outline (optional)
- 30–45 minute outline; 5–7 sections, each with talking points

## Output Format

Output a single JSON object with one key per requested asset type. Each key maps to either:
- A single object (blog, email, onepager, workshop_outline): `{ "title", "content", "metadata"?, "slug" }`
- An array of 3 objects for linkedin: `[{ "variant": "educational", "title", "content", "metadata"?, "slug" }, ...]`

Include `slug` (filename-safe, no extension) for each asset. For email include `metadata: { "subject", "preview_text" }`.

Output ONLY valid JSON. No markdown, no code fences, no explanation.
