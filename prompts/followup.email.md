# Email Content Generation Prompt

Generate a warm, personalized email body for a nonprofit organization that just completed the IT health check assessment.

## Report Data

{{REPORT}}

## Contact Information

- Organization: {{ORG_NAME}}
- Contact: {{CONTACT_NAME}}

## Task

Create an email body that:
1. Thanks them for completing the assessment
2. Provides a brief, friendly summary of their readiness score and label
3. Highlights 2-3 key priorities from their report
4. Includes a clear call-to-action based on their readiness_label:
   - "Watch": Offer free resources, gentle follow-up
   - "Plan": Offer fixed-price assessment, encourage planning conversation
   - "Act": Offer short call, emphasize urgency without being pushy
5. Includes the report link: {{REPORT_URL}}
6. Is warm, non-salesy, and written in plain English

## Tone

- Friendly and approachable
- Professional but not corporate
- Helpful without being pushy
- Acknowledges their specific situation
- Encourages next steps without pressure

## Sign-off (REQUIRED)

- The email is from **Zephyr Solutions** (the company sending the report).
- End with a closing like "Warm regards," or "Best regards," followed by exactly **Zephyr Solutions** on the next line.
- Do NOT use placeholders such as [Your Name], [Your Position], [Your Nonprofit Organization], [Your Contact Information], or any [bracketed] placeholder in the sign-off or anywhere in the email. Use only "Zephyr Solutions" as the sender name.

## Output Format

Provide the email body text (not HTML, plain text that can be converted to HTML). Include:
- Subject line suggestion
- Email body text
- Keep it concise (3-4 paragraphs max)
- End with the sign-off above (e.g. "Warm regards,\n\nZephyr Solutions")
