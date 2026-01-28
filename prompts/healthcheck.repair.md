# JSON Repair Prompt

The following JSON output failed validation against the required schema. Please correct it to match the schema exactly.

## Invalid JSON

{{INVALID_JSON}}

## Schema Errors

{{SCHEMA_ERRORS}}

## Task

Output the corrected JSON that:
1. Fixes all schema validation errors
2. Maintains the original intent and content as much as possible
3. Matches the schema structure exactly
4. Contains all required fields with valid values

## Output Format

Output ONLY the corrected JSON. No markdown, no code blocks, no explanations - just the corrected JSON object.
