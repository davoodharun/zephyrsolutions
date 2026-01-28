/**
 * GET /api/healthcheck/report?id=<token>
 * Renders HTML report page for a given token
 */

import type { Env } from '../../_lib/env';
import { validateEnv } from '../../_lib/env';
import { verifyReportToken } from '../../_lib/crypto';
import { getNotionLead } from '../../_lib/notion';
import { renderReportHTML, renderErrorPage } from '../../_lib/html';

export default async function(request: Request, env: Env): Promise<Response> {
  try {
    // Validate environment
    validateEnv(env);

    // Parse token from query string
    const url = new URL(request.url);
    const token = url.searchParams.get('id');

    if (!token) {
      return new Response(renderErrorPage('Token missing', env.PUBLIC_BASE_URL), {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Verify token
    const verification = await verifyReportToken(token, env.REPORT_TOKEN_SECRET);
    
    if (!verification.valid) {
      if (verification.expired) {
        return new Response(renderErrorPage('This report link has expired. Please contact us to request a new report.', env.PUBLIC_BASE_URL), {
          status: 400,
          headers: { 'Content-Type': 'text/html' }
        });
      }
      
      return new Response(renderErrorPage('The report link is invalid. Please contact us if you need assistance.', env.PUBLIC_BASE_URL), {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (!verification.leadId) {
      return new Response(renderErrorPage('Invalid token format.', env.PUBLIC_BASE_URL), {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Fetch lead from Notion
    const lead = await getNotionLead(verification.leadId, env);
    
    if (!lead || !lead.reportJson) {
      return new Response(renderErrorPage('We couldn\'t find the requested report. Please contact us if you need assistance.', env.PUBLIC_BASE_URL), {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Render HTML report
    const html = renderReportHTML(lead.reportJson, env.PUBLIC_BASE_URL);

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unexpected error in report endpoint:', error);
    return new Response(renderErrorPage('An error occurred loading the report. Please contact us if you need assistance.', env.PUBLIC_BASE_URL || ''), {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}
