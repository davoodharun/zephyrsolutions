/**
 * Notion API client for lead management
 * Handles creating and updating lead records in Notion database
 */

import { Client } from '@notionhq/client';
import type { Env } from './env';

export interface NotionLead {
  orgName: string;
  contactName: string;
  email: string;
  orgSize: string;
  tools: string[];
  painPoints: string[];
  backups: string;
  securityConfidence: string;
  budgetComfort: string;
  timeline: string;
  notes?: string;
  status: 'pending_generation' | 'sent' | 'needs_manual_review';
  readinessScore?: number;
  readinessLabel?: string;
  reportSummary?: string;
  reportJson?: string;
  leadId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Creates a Notion client instance
 */
function createNotionClient(apiKey: string): Client {
  return new Client({ auth: apiKey });
}

/** Builds a Notion rich_text property from a string (or array joined by "; "). Notion API requires type: "text". */
function richText(value: string | string[]): { rich_text: Array<{ type: 'text'; text: { content: string } }> } {
  const content = Array.isArray(value) ? value.join('; ') : (value ?? '');
  return {
    rich_text: [{ type: 'text', text: { content: content.slice(0, 2000) } }]
  };
}

/**
 * Maps form submission to Notion database properties.
 * Org Name uses Notion's title type (primary column); Email uses email type; rest use rich_text.
 */
function mapSubmissionToNotionProperties(submission: any, status: string): any {
  const now = new Date().toISOString();
  return {
    'Org Name': {
      title: [
        { type: 'text' as const, text: { content: submission.org_name ?? '' } }
      ]
    },
    'Contact Name': richText(submission.contact_name ?? ''),
    'Email': {
      email: submission.email ?? ''
    },
    'Org Size': richText(submission.org_size ?? ''),
    'Tools': richText(submission.current_tools ?? []),
    'Pain Points': richText(submission.top_pain_points ?? []),
    'Backups': richText(submission.backups_maturity ?? ''),
    'Security Confidence': richText(submission.security_confidence ?? ''),
    'Budget Comfort': richText(submission.budget_comfort ?? ''),
    'Timeline': richText(submission.timeline ?? ''),
    'Status': richText(status),
    'Source': richText('website-healthcheck'),
    'Created At': richText(now),
    'Updated At': richText(now)
  };
}

/**
 * Creates a new lead record in Notion
 */
export async function createNotionLead(
  submission: any,
  env: Env
): Promise<string> {
  const notion = createNotionClient(env.NOTION_API_KEY);
  
  // Generate unique lead ID
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const properties = {
    ...mapSubmissionToNotionProperties(submission, 'pending_generation'),
    'Lead ID': {
      rich_text: [
        { type: 'text' as const, text: { content: leadId } }
      ]
    }
  };

  // Add notes if provided
  if (submission.notes) {
    properties['Notes'] = {
      rich_text: [
        { type: 'text' as const, text: { content: submission.notes } }
      ]
    };
  }

  try {
    const response = await notion.pages.create({
      parent: {
        database_id: env.NOTION_DB_LEADS_ID
      },
      properties: properties
    });

    return leadId;
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error(`Failed to create Notion lead: ${error}`);
  }
}

/**
 * Updates a lead record in Notion with report data
 */
export async function updateNotionLead(
  leadId: string,
  report: any,
  env: Env
): Promise<void> {
  const notion = createNotionClient(env.NOTION_API_KEY);

  // First, find the lead by Lead ID
  const response = await notion.databases.query({
    database_id: env.NOTION_DB_LEADS_ID,
    filter: {
      property: 'Lead ID',
      rich_text: {
        equals: leadId
      }
    }
  });

  if (response.results.length === 0) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  const pageId = response.results[0].id;

  const now = new Date().toISOString();
  // Notion rich_text requires type: "text" and has 2000-char limit per segment; chunk Report JSON
  const reportJsonStr = JSON.stringify(report);
  const chunkSize = 2000;
  const reportJsonChunks: Array<{ type: 'text'; text: { content: string } }> = [];
  for (let i = 0; i < reportJsonStr.length; i += chunkSize) {
    reportJsonChunks.push({
      type: 'text',
      text: { content: reportJsonStr.slice(i, i + chunkSize) }
    });
  }

  const updateProperties: any = {
    'Status': richText('sent'),
    'Updated At': richText(now),
    'Report Summary': {
      rich_text: [
        { type: 'text' as const, text: { content: (report.summary ?? '').slice(0, 2000) } }
      ]
    },
    'Report JSON': {
      rich_text: reportJsonChunks
    }
  };
  // Use rich_text so it works whether your Notion DB has Number/Select or Rich text for these
  if (report.readiness_score != null) {
    updateProperties['Readiness Score'] = richText(String(report.readiness_score));
  }
  if (report.readiness_label) {
    updateProperties['Readiness Label'] = richText(report.readiness_label);
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: updateProperties
    });
  } catch (error: unknown) {
    // Notion SDK errors often have .body with { code, message }; surface for debugging
    const body = (error as { body?: { code?: string; message?: string } })?.body;
    const code = body?.code ?? (error as { code?: string })?.code;
    const msg = body?.message ?? (error instanceof Error ? error.message : String(error));
    const detail = code ? `[${code}] ${msg}` : msg;
    console.error('Notion API error:', detail, error);
    throw new Error(`Failed to update Notion lead: ${detail}`);
  }
}

/**
 * Marks a lead as needing manual review
 */
export async function markLeadForManualReview(
  leadId: string,
  env: Env
): Promise<void> {
  const notion = createNotionClient(env.NOTION_API_KEY);

  // Find the lead by Lead ID
  const response = await notion.databases.query({
    database_id: env.NOTION_DB_LEADS_ID,
    filter: {
      property: 'Lead ID',
      rich_text: {
        equals: leadId
      }
    }
  });

  if (response.results.length === 0) {
    throw new Error(`Lead not found: ${leadId}`);
  }

  const pageId = response.results[0].id;

  const now = new Date().toISOString();
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Status': richText('needs_manual_review'),
        'Updated At': richText(now)
      }
    });
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error(`Failed to mark lead for manual review: ${error}`);
  }
}

/**
 * Retrieves a lead record from Notion by lead ID
 */
export async function getNotionLead(
  leadId: string,
  env: Env
): Promise<any | null> {
  const notion = createNotionClient(env.NOTION_API_KEY);

  try {
    const response = await notion.databases.query({
      database_id: env.NOTION_DB_LEADS_ID,
      filter: {
        property: 'Lead ID',
        rich_text: {
          equals: leadId
        }
      }
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    const properties = (page as any).properties;

    // Extract report JSON; try common property name variants (Notion DB may use "Report JSON" or "Report Json")
    const reportPropNames = ['Report JSON', 'Report Json', 'ReportJSON'];
    let richTextBlocks: any[] = [];
    for (const name of reportPropNames) {
      const prop = properties[name];
      if (prop?.rich_text) {
        richTextBlocks = prop.rich_text;
        break;
      }
    }
    const reportJsonStr = richTextBlocks
      .map((b: any) => b?.text?.content ?? '')
      .filter(Boolean)
      .join('');
    let reportJson = null;
    if (reportJsonStr) {
      try {
        reportJson = JSON.parse(reportJsonStr);
      } catch (e) {
        console.warn('Report JSON parse failed for lead', leadId, 'length=', reportJsonStr.length, (e as Error)?.message);
        reportJson = null;
      }
    } else if (Object.keys(properties).length > 0) {
      console.warn('Report JSON empty for lead', leadId, 'property names:', Object.keys(properties).join(', '));
    }

    return {
      leadId,
      reportJson,
      properties
    };
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error(`Failed to get Notion lead: ${error}`);
  }
}
