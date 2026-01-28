/**
 * Email service client (Resend/SendGrid)
 * Handles sending transactional emails to leads
 */

import type { Env } from './env';

export interface EmailContent {
  subject: string;
  body: string; // Plain text, will be converted to HTML
}

/**
 * Sends an email using Resend or SendGrid
 */
export async function sendEmail(
  to: string,
  content: EmailContent,
  env: Env
): Promise<void> {
  const provider = env.EMAIL_PROVIDER || 'resend';

  if (provider === 'resend') {
    await sendEmailResend(to, content, env);
  } else if (provider === 'sendgrid') {
    await sendEmailSendGrid(to, content, env);
  } else {
    throw new Error(`Unsupported email provider: ${provider}`);
  }
}

/**
 * Sends email using Resend API
 */
async function sendEmailResend(
  to: string,
  content: EmailContent,
  env: Env
): Promise<void> {
  const { Resend } = await import('resend');
  const resend = new Resend(env.EMAIL_API_KEY);

  // Convert plain text to simple HTML
  const htmlBody = content.body
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  try {
    const result = await resend.emails.send({
      from: env.EMAIL_FROM,
      to: [to],
      subject: content.subject,
      html: htmlBody,
      text: content.body
    });

    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message}`);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}

/**
 * Sends email using SendGrid API
 */
async function sendEmailSendGrid(
  to: string,
  content: EmailContent,
  env: Env
): Promise<void> {
  // Convert plain text to simple HTML
  const htmlBody = content.body
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('');

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }]
          }
        ],
        from: { email: env.EMAIL_FROM },
        subject: content.subject,
        content: [
          {
            type: 'text/plain',
            value: content.body
          },
          {
            type: 'text/html',
            value: htmlBody
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
}
