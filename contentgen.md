# Content Flywheel v1 — Topic Suggestion + Asset Generator (Cloudflare Pages)

## 0. Objective
Build a “Content Flywheel” feature that helps the consultant quickly produce consistent, trust-first marketing content for small orgs and nonprofits.

The feature must:
1) Suggest strong content topics based on a chosen theme + audience constraints
2) Generate multiple content assets from a selected topic:
   - LinkedIn post (1–3 variants)
   - Blog post (600–1200 words)
   - Email newsletter (short)
   - Board-friendly one-pager (executive summary)
   - at least 3 generated image assets related to the topic (can be generic and minimal)
   - Optional: workshop outline / talk abstract

Primary outcomes:
- Reduce time-to-publish
- Maintain consistent voice and positioning (plain English, nonprofit-focused)
- Produce content as version-controlled files in Git (reviewable via PR)

Non-goals (v1):
- Auto-posting to LinkedIn
- Full CMS replacement
- Fully autonomous publishing without review

## 1. User Stories
### US1: Suggest Topics
As Harun, I want to input a general area (e.g., “cybersecurity for nonprofits”) and get 10 topic ideas with angles and target personas so I can pick one fast.

### US2: Generate Assets
As Harun, I want to choose a topic and generate ready-to-edit assets (LinkedIn + blog + email + one-pager) so I can publish with minimal effort.

### US3: Save as Drafts in Git
As Harun, I want outputs saved as markdown files with frontmatter so I can review and merge via PR.

## 2. Platform & Architecture
- Hosting: Cloudflare Pages (static site)
- Backend: Cloudflare Pages Functions under `/functions/api/content/*`
- Storage: Git repo files (committed via GitHub Actions) OR downloadable zip as fallback
- Optional CRM logging: store “content generation run” metadata to Notion (separate DB) later

Recommended approach:
- Use GitHub Actions for “write to repo + PR” (because Cloudflare Functions cannot easily push git commits securely).
- Cloudflare Functions generate content and return a structured JSON payload.
- GitHub Action consumes JSON and writes files + opens a PR.

## 3. UX / Entry Points
### Option A (MVP): GitHub Action workflow dispatch
- Harun runs a workflow manually (“Generate Content”) with inputs:
  - theme
  - target audience persona
  - preferred channels
  - tone options
- Workflow calls Cloudflare API endpoint to generate topics/assets, then creates a PR.

### Option B (later): Simple admin page on the website
- Protected admin page to run suggestion + generation and download a zip of drafts.

v1 should implement Option A first.

## 4. Core Workflows
### 4.1 Topic Suggestion
Input:
- theme (string)
- audience (enum: nonprofit ED, ops manager, small business owner, etc.)
- goals (enum multi: reduce cost, reduce risk, modernize, reliability, compliance)
- constraints (e.g., “no jargon”, “board-friendly”)
- region (optional)

Output:
- 10 topic candidates with:
  - title
  - hook/angle
  - who it’s for (persona)
  - why it matters
  - recommended CTA type (free resource / assessment / short call)
  - estimated difficulty (low/med/high)

Endpoint:
- POST /api/content/topics

### 4.2 Asset Generation
Input:
- selected topic (from above OR user-provided)
- brand voice settings
- constraints (word counts, style rules)
- desired assets list

Output:
- Structured JSON containing each asset (content + metadata + suggested filenames)

Endpoint:
- POST /api/content/generate

### 4.3 Git Draft Creation (via GitHub Action)
- Workflow calls /api/content/generate
- Writes files to repo:
  - `src/content/posts/YYYY-MM-DD-slug.md`
  - `src/content/linkedin/YYYY-MM-DD-slug.md`
  - `src/content/email/YYYY-MM-DD-slug.md`
  - `src/content/onepagers/YYYY-MM-DD-slug.md`
- Opens a PR titled: `Content: <topic title>`

## 5. Brand Voice & Safety Rules
All outputs must follow:
- Plain English, nonprofit-friendly, conservative recommendations
- No fear-mongering or shaming
- No mention of “AI”, prompts, or internal systems
- No claims of certification/compliance unless explicitly provided
- Avoid legal/medical guarantees; include gentle disclaimers where appropriate

## 6. Content Requirements by Asset Type

### 6.1 LinkedIn Post
- 120–220 words
- 1 hook line + 3–6 short paragraphs or bullets
- End with a soft CTA:
  - “If helpful, I can share a checklist”
  - or “Reply ‘checklist’ and I’ll send it”

Return 3 variants:
- Variant A: Educational
- Variant B: Story/mini case
- Variant C: Checklist

### 6.2 Blog Post
- 600–1200 words
- H2 sections, scannable
- Includes:
  - Problem framing for small orgs
  - Practical steps
  - “What not to do yet” section
  - Short CTA at end

### 6.3 Email Newsletter
- 150–300 words
- Subject line + preview text
- Conversational, value-first
- 1 CTA max

### 6.4 Board-Friendly One-Pager (Markdown)
- Title + 5–7 bullet sections:
  - Risk/Impact
  - What good looks like
  - Recommended next 30 days
  - Cost bands ($ / $$ / $$$)
- No jargon; board-ready language

### 6.5 Optional: Workshop Outline
- 30–45 minute outline
- 5–7 sections, each with “talking points”
