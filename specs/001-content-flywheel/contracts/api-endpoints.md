# API Contracts: Content Flywheel Endpoints

**Feature**: 001-content-flywheel  
**Date**: 2026-01-29

## POST /api/content/topics

Returns topic suggestions for a given theme and audience.

### Request

**Method**: POST  
**Content-Type**: application/json  
**Optional**: `Authorization: Bearer <CONTENT_API_SECRET>` or `X-Content-API-Secret: <secret>` (if endpoint is protected)

**Body** (TopicSuggestionRequest):
```json
{
  "theme": "cybersecurity for nonprofits",
  "audience": "nonprofit ED",
  "goals": ["reduce risk", "compliance"],
  "constraints": "no jargon, board-friendly",
  "region": ""
}
```

**Validation**:
- `theme` (string, required)
- `audience` (string, required)
- `goals` (array of strings, optional)
- `constraints` (string, optional)
- `region` (string, optional)

### Response

**Success (200 OK)**:
```json
{
  "ok": true,
  "topics": [
    {
      "title": "5 backup habits that protect nonprofit data",
      "hook": "Most small orgs lose data to simple mistakes, not hackers.",
      "persona": "nonprofit ED",
      "why_it_matters": "Board and funders increasingly ask about data protection.",
      "cta_type": "free resource",
      "difficulty": "low"
    }
  ]
}
```
- `topics`: array of 10 topic candidates (TopicCandidate); each has title, hook, persona, why_it_matters, cta_type, difficulty.

**Validation Error (400 Bad Request)**:
```json
{
  "ok": false,
  "error": "validation_failed",
  "errors": { "theme": "Theme is required." }
}
```

**Server Error (500 Internal Server Error)**:
```json
{
  "ok": false,
  "error": "topic_generation_failed",
  "message": "Could not generate topics. Please try again."
}
```

---

## POST /api/content/generate

Generates content assets for a selected topic.

### Request

**Method**: POST  
**Content-Type**: application/json  
**Optional**: Same auth as topics (if protected).

**Body** (AssetGenerationRequest):
```json
{
  "topic": {
    "title": "5 backup habits that protect nonprofit data",
    "hook": "Most small orgs lose data to simple mistakes.",
    "persona": "nonprofit ED"
  },
  "asset_types": ["linkedin", "blog", "email", "onepager"],
  "brand_voice": {},
  "constraints": {}
}
```

**Validation**:
- `topic` (object, required); `topic.title` (string, required)
- `asset_types` (array of strings, required); allowed: "linkedin", "blog", "email", "onepager", "workshop_outline"
- `brand_voice`, `constraints` (optional)

### Response

**Success (200 OK)**:
```json
{
  "ok": true,
  "topic_title": "5 backup habits that protect nonprofit data",
  "generated_at": "2026-01-29T12:00:00.000Z",
  "assets": [
    {
      "type": "linkedin",
      "variant": "educational",
      "title": "5 backup habits...",
      "content": "...",
      "metadata": { "word_count": 180 },
      "slug": "5-backup-habits-nonprofit-data",
      "suggested_filename": "2026-01-29-5-backup-habits-nonprofit-data-educational.md"
    },
    {
      "type": "blog",
      "title": "5 backup habits that protect nonprofit data",
      "content": "...",
      "metadata": { "word_count": 850 },
      "slug": "5-backup-habits-nonprofit-data",
      "suggested_filename": "2026-01-29-5-backup-habits-nonprofit-data.md"
    }
  ],
  "errors": []
}
```
- `assets`: array of ContentAsset; one per requested type (LinkedIn may have 3 entries for 3 variants).
- `errors`: empty on full success; may list per-asset or global failures if partial.

**Partial Success (200 OK)** (e.g. one asset type failed):
```json
{
  "ok": true,
  "topic_title": "...",
  "generated_at": "...",
  "assets": [ ... ],
  "errors": ["blog: generation timed out"]
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "ok": false,
  "error": "validation_failed",
  "errors": { "topic": "Topic title is required.", "asset_types": "At least one asset type required." }
}
```

**Server Error (500 Internal Server Error)**:
```json
{
  "ok": false,
  "error": "asset_generation_failed",
  "message": "Content generation failed. Please try again."
}
```

---

## CORS

Both endpoints SHOULD support:
- `Access-Control-Allow-Origin`: configurable (e.g. same origin or `*` for workflow caller)
- `Access-Control-Allow-Methods`: POST, OPTIONS
- `Access-Control-Allow-Headers`: Content-Type, Authorization (if used)

Preflight: respond to OPTIONS with 204 and above headers.
