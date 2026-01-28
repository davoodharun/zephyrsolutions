# API Contracts: Health Check Endpoints

**Feature**: 001-ai-health-check  
**Date**: 2026-01-26

## POST /api/healthcheck/submit

Submits a health check assessment form and triggers report generation.

### Request

**Method**: POST  
**Content-Type**: application/json  
**Rate Limit**: 10 requests per hour per IP address

**Body** (HealthCheckSubmission):
```json
{
  "org_name": "Example Nonprofit",
  "contact_name": "John Doe",
  "email": "john@example.org",
  "org_size": "11-50",
  "current_tools": ["Microsoft Office", "Google Workspace"],
  "top_pain_points": ["Data backup", "Security concerns"],
  "backups_maturity": "basic",
  "security_confidence": "low",
  "budget_comfort": "moderate",
  "timeline": "3-6 months",
  "notes": "Optional additional context",
  "honeypot": ""
}
```

**Validation**:
- All required fields must be present
- Email must be valid format
- Enum values must match allowed options
- Honeypot field must be empty
- Array fields must contain at least one item

### Response

**Success (200 OK)**:
```json
{
  "ok": true,
  "lead_id": "abc123",
  "report_url": "https://zephyrsolutions.info/api/healthcheck/report?id=eyJ..."
}
```

**Validation Error (400 Bad Request)**:
```json
{
  "ok": false,
  "error": "validation_failed",
  "errors": {
    "email": "Invalid email format",
    "org_size": "Invalid value. Must be one of: 1-10, 11-50, 51-200, 200+"
  }
}
```

**Rate Limit Exceeded (429 Too Many Requests)**:
```json
{
  "ok": false,
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later."
}
```

**Server Error (500 Internal Server Error)**:
```json
{
  "ok": false,
  "error": "internal_error",
  "message": "An error occurred processing your submission. Please try again later."
}
```

### Behavior

1. Validate request payload against schema
2. Check rate limits
3. Verify honeypot field is empty
4. Create lead record in Notion (status: pending_generation)
5. Call LLM to generate report JSON
6. Validate report JSON against schema
7. If validation fails, attempt one repair pass
8. If repair succeeds, continue; if repair fails, mark lead as "needs_manual_review" and send fallback email
9. Update lead record with report data (status: sent)
10. Generate signed report token
11. Send email to lead with report summary and link
12. Return success response

### Error Handling

- **LLM API failure**: Mark lead as "needs_manual_review", send fallback email, return 500
- **Notion API failure**: Retry up to 3 times with exponential backoff, return 500 if all retries fail
- **Email delivery failure**: Log error, mark lead for manual follow-up, still return 200 (report generation succeeded)
- **Validation failure**: Return 400 with specific field errors

---

## GET /api/healthcheck/report

Retrieves and renders the HTML report page for a given token.

### Request

**Method**: GET  
**Query Parameters**:
- `id` (string, required): Signed report token

**Example**:
```
GET /api/healthcheck/report?id=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Response

**Success (200 OK)**:
- **Content-Type**: text/html
- **Body**: Branded HTML report page with:
  - Readiness score and label
  - Summary
  - Top risks
  - Top priorities
  - Items not to worry about yet
  - Next steps
  - Recommended entry offer

**Token Invalid (400 Bad Request)**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Report Not Found</title>
</head>
<body>
  <h1>Report Not Found</h1>
  <p>The report link is invalid or has expired. Please contact us if you need assistance.</p>
</body>
</html>
```

**Token Expired (400 Bad Request)**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Report Expired</title>
</head>
<body>
  <h1>Report Expired</h1>
  <p>This report link has expired. Please contact us to request a new report.</p>
</body>
</html>
```

**Lead Not Found (404 Not Found)**:
```html
<!DOCTYPE html>
<html>
<head>
  <title>Report Not Found</title>
</head>
<body>
  <h1>Report Not Found</h1>
  <p>We couldn't find the requested report. Please contact us if you need assistance.</p>
</body>
</html>
```

### Behavior

1. Verify token signature using HMAC
2. Check token expiration
3. Extract lead_id from token
4. Query Notion for lead record
5. If lead not found, return 404
6. Extract report JSON from lead record
7. Render HTML report from template
8. Return HTML response

### Security

- Token signature prevents tampering
- Token expiration limits access window (30 days)
- No internal system details exposed in error messages
- Lead ID not exposed in URLs (only in signed token)

---

## Rate Limiting

All endpoints implement rate limiting to prevent abuse:

- **POST /api/healthcheck/submit**: 10 requests per hour per IP address
- **GET /api/healthcheck/report**: 100 requests per hour per IP address

Rate limit headers (when applicable):
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1640995200
```
