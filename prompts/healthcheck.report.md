# Report Generation Prompt

Generate a personalized IT health check report based on the following organization assessment.

## Input Data

{{SUBMISSION}}

## Task

Analyze this organization's IT situation and produce a HealthCheckReport JSON that exactly matches the provided schema.

## Report Requirements

1. **Summary**: 2-4 sentences providing an overall assessment of their IT readiness
2. **Readiness Score**: Rate from 1-5 where:
   - 1-2: Significant gaps, immediate attention needed
   - 3: Some concerns, planning recommended
   - 4-5: Generally good, minor improvements possible
3. **Readiness Label**: 
   - "Watch": Monitor but no immediate action needed
   - "Plan": Should develop a plan to address gaps
   - "Act": Take action soon to address risks
4. **Top Risks**: 2-5 items. Each must have a **specific title** (e.g. "Lack of automated backups") and a **concrete description**—never "Risk" or "See assessment."
5. **Top Priorities**: 2-4 items. Each must have a **specific title and description**—never "Priority" or "See assessment."
6. **Do Not Worry Yet**: 1-3 items. Each must name a **specific area** and why it's acceptable—never generic "Item" or "Acceptable for now."
7. **Next Steps**: 3-6 steps. Each must have a **specific title**, description, and realistic timeline—never "Step" or "See assessment." or "Soon" alone.
8. **Recommended Entry Offer**: One of "free resources", "Fixed-price assessment", or "Short call" based on readiness
9. **Admin Notes**: Internal notes for the business team about this lead

## Critical: No placeholders

- Do NOT use generic labels as titles: no "Risk", "Priority", "Item", "Step"
- Do NOT use placeholder text: no "See assessment.", "Acceptable for now.", or "High impact." as the only description
- Every title and description must be specific to this organization's assessment (their tools, pain points, backups, timeline)

## Guidelines

- Use plain English, no technical jargon
- Be specific and actionable
- Consider their budget comfort and timeline
- Focus on practical solutions for smaller organizations
- Be encouraging but honest about risks

## Output Format

Output ONLY valid JSON that matches the HealthCheckReport schema. No markdown, no code blocks, no explanations - just the JSON object.
