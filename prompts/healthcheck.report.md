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
4. **Top Risks**: 2-5 items that pose the greatest risk to the organization
5. **Top Priorities**: 2-4 items that should be addressed first for maximum impact
6. **Do Not Worry Yet**: 1-3 items that are acceptable for now but worth monitoring
7. **Next Steps**: 3-6 concrete, actionable steps the organization can take
8. **Recommended Entry Offer**: Based on readiness level:
   - "Free resources" for Watch/Plan organizations
   - "Fixed-price assessment" for Plan organizations
   - "Short call" for Act organizations
9. **Admin Notes**: Internal notes for the business team about this lead

## Guidelines

- Use plain English, no technical jargon
- Be specific and actionable
- Consider their budget comfort and timeline
- Focus on practical solutions for smaller organizations
- Be encouraging but honest about risks

## Output Format

Output ONLY valid JSON that matches the HealthCheckReport schema. No markdown, no code blocks, no explanations - just the JSON object.
