# Research: AI-Driven Nonprofit IT Health Check Workflow

**Feature**: 001-ai-health-check  
**Date**: 2026-01-26  
**Status**: Complete

## Technology Decisions

### Decision: Cloudflare Pages Functions for Serverless Backend

**Rationale**: 
- Existing site is deployed on Cloudflare Pages (or compatible static host)
- Pages Functions provide serverless runtime without separate infrastructure
- Seamless integration with static site deployment
- Built-in edge computing and global distribution
- Cost-effective for low-to-medium traffic volumes
- TypeScript support with Workers runtime

**Alternatives Considered**:
- Separate backend service (Netlify Functions, Vercel Functions, AWS Lambda): Adds deployment complexity and potential latency
- Client-side only processing: Not feasible for LLM calls, CRM writes, and email sending
- Traditional server: Requires infrastructure management, conflicts with static site architecture

### Decision: Notion API for CRM Integration

**Rationale**:
- Lightweight, API-first database solution
- No additional infrastructure required
- Flexible schema for lead data
- Good API documentation and TypeScript support
- Suitable for small-to-medium lead volumes
- Enables manual review workflow through Notion UI

**Alternatives Considered**:
- Custom database (PostgreSQL, MongoDB): Requires infrastructure setup and maintenance
- Third-party CRM APIs (HubSpot, Salesforce): More complex integration, potential cost overhead
- File-based storage: Not suitable for concurrent writes and querying needs

### Decision: Resend as Primary Email Provider (SendGrid as Fallback)

**Rationale**:
- Modern API with excellent developer experience
- Good TypeScript/JavaScript SDK support
- Competitive pricing for transactional emails
- Reliable delivery rates
- Simple integration with Cloudflare Workers

**Alternatives Considered**:
- SendGrid: Acceptable alternative, more established but slightly more complex API
- AWS SES: Requires AWS account and more complex setup
- Mailgun: Similar to SendGrid, no significant advantage
- SMTP relay: Less reliable, requires SMTP server management

### Decision: OpenAI-Compatible API for LLM

**Rationale**:
- Flexible - supports OpenAI, Anthropic, or other compatible providers
- JSON-only output mode available
- Good prompt engineering capabilities
- Cost-effective for structured output generation
- Standard REST API pattern

**Alternatives Considered**:
- OpenAI-specific SDK: Less flexible, locks into single provider
- Local LLM models: Requires significant infrastructure and may not meet quality requirements
- Template-based reports: Cannot provide personalized, AI-generated insights

### Decision: HMAC-Signed Tokens for Report Links

**Rationale**:
- Secure token generation without database lookups
- Stateless verification (can verify without querying Notion)
- Configurable expiration (30 days)
- Prevents token guessing or enumeration attacks
- Standard cryptographic approach

**Alternatives Considered**:
- Random UUIDs stored in database: Requires database lookup for every report access
- JWT tokens: More complex, overkill for simple token verification
- Plain IDs: Insecure, allows enumeration

### Decision: JSON Schema Validation for Reports

**Rationale**:
- Ensures LLM output matches expected structure
- Enables automatic repair attempts
- Provides clear error messages for debugging
- Standard validation approach
- Can be versioned alongside code

**Alternatives Considered**:
- Manual validation: Error-prone, harder to maintain
- TypeScript types only: Runtime validation still needed
- Custom validation functions: More code to maintain, less standardized

### Decision: Synchronous Processing (MVP)

**Rationale**:
- Simpler implementation and error handling
- Immediate feedback to user
- Meets performance requirements (under 2 minutes)
- Cloudflare Workers support sufficient CPU time for MVP
- Can be refactored to async if needed later

**Alternatives Considered**:
- Queue-based async processing: Adds complexity, requires queue infrastructure
- Webhook callbacks: More complex user experience, requires webhook endpoints

## Best Practices Research

### Cloudflare Pages Functions Patterns

**Finding**: Functions route based on file paths in `/functions` directory. TypeScript files export a default function that receives `Request` and `env` context.

**Implementation Pattern**:
- Use `/functions/api/healthcheck/submit.ts` for POST endpoint
- Use `/functions/api/healthcheck/report.ts` for GET endpoint
- Shared utilities in `/functions/_lib/` (underscore prefix prevents routing)
- Environment variables accessed via `env` parameter

### Notion API Integration Patterns

**Finding**: Notion API uses REST endpoints with bearer token authentication. Database pages are created/updated via API with property mapping.

**Implementation Pattern**:
- Use `@notionhq/client` SDK for TypeScript
- Create pages with `notion.pages.create()`
- Update pages with `notion.pages.update()`
- Query pages with `notion.databases.query()`
- Map form fields to Notion database properties

### LLM Prompt Engineering for Structured Output

**Finding**: JSON-only output requires explicit instructions and system prompts. Repair prompts can fix common JSON formatting issues.

**Implementation Pattern**:
- Use system prompt to establish persona and constraints
- Use user prompt with form data and explicit JSON schema reference
- Request JSON-only output with no markdown
- Implement repair prompt that takes invalid JSON + errors and returns corrected JSON
- Validate against JSON schema after generation

### Email Template Best Practices

**Finding**: Transactional emails should be warm, personalized, and include clear CTAs. Plain text and HTML versions improve deliverability.

**Implementation Pattern**:
- Use LLM to generate personalized email content from report data
- Include summary bullets, readiness score, and report link
- CTA varies based on readiness_label (Watch/Plan/Act)
- Branded HTML template with fallback plain text

### Security Best Practices

**Finding**: Rate limiting, input validation, and secure token generation are essential for public-facing forms.

**Implementation Pattern**:
- Honeypot field for basic bot protection
- Cloudflare native rate limiting (or custom implementation)
- Input validation on both client and server
- HMAC-signed tokens with expiration
- No sensitive data in logs or URLs
- Environment variables for all secrets

## Integration Patterns

### Form Submission Flow

1. Client validates form fields
2. POST to `/api/healthcheck/submit` with JSON payload
3. Server validates payload against schema
4. Create Notion lead (status: pending_generation)
5. Call LLM to generate report JSON
6. Validate report JSON, attempt repair if needed
7. Update Notion lead with results
8. Generate signed token for report link
9. Send email with report summary and link
10. Return success response to client

### Report Access Flow

1. Client requests `/api/healthcheck/report?id=<token>`
2. Server verifies token signature and expiration
3. Extract lead_id from token
4. Query Notion for lead record and report JSON
5. Render HTML report from template
6. Return HTML response

## Performance Considerations

- Cloudflare Workers have CPU time limits (typically 50ms free tier, 30s paid)
- LLM API calls may take 5-30 seconds depending on provider
- Notion API calls are typically <500ms
- Email sending is typically <1s
- Total workflow should complete in <2 minutes for 90% of requests

## Error Handling Strategy

- LLM failures: Attempt one repair, then mark for manual review
- Notion failures: Retry with exponential backoff (max 3 attempts)
- Email failures: Log error, mark lead for manual follow-up
- Token verification failures: Return generic error (don't expose details)
- Validation failures: Return 400 with specific field errors

## Scalability Considerations

- Current design supports 10-50 submissions/day
- Can scale to 100+ submissions/day with current architecture
- Cloudflare Workers auto-scale
- Notion API has rate limits (3 requests/second) - may need queuing for higher volume
- LLM API costs scale with usage - monitor and optimize prompts
