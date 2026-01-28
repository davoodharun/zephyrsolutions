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

/** Builds a Notion rich_text property from a string (or array joined by "; ") */
function richText(value: string | string[]): { rich_text: Array<{ text: { content: string } }> } {
  const content = Array.isArray(value) ? value.join('; ') : (value ?? '');
  return {
    rich_text: [{ text: { content: content.slice(0, 2000) } }]
  };
}

/**
 * Maps form submission to Notion database properties.
 * Uses rich_text for all text-like columns so the same code works whether
 * your Notion database uses Rich text, Select, or Multi-select.
 */
function mapSubmissionToNotionProperties(submission: any, status: string): any {
  const now = new Date().toISOString();
  return {
    'Org Name': {
      title: [
        {
          text: {
            content: submission.org_name ?? ''
          }
        }
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
        {
          text: {
            content: leadId
          }
        }
      ]
    }
  };

  // Add notes if provided
  if (submission.notes) {
    properties['Notes'] = {
      rich_text: [
        {
          text: {
            content: submission.notes
          }
        }
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
  // Update the lead with report data (Status/Updated At as rich_text for DBs that use Rich text)
  const updateProperties: any = {
    'Status': richText('sent'),
    'Updated At': richText(now),
    'Report Summary': {
      rich_text: [
        {
          text: {
            content: (report.summary ?? '').slice(0, 2000)
          }
        }
      ]
    },
    'Report JSON': {
      rich_text: [
        {
          text: {
            content: JSON.stringify(report).slice(0, 2000)
          }
        }
      ]
    }
  };
  // Only set number/select if your Notion DB uses those types; otherwise add as rich_text
  if (report.readiness_score != null) {
    updateProperties['Readiness Score'] = { number: report.readiness_score };
  }
  if (report.readiness_label) {
    updateProperties['Readiness Label'] = richText(report.readiness_label);
  }

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: updateProperties
    });
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error(`Failed to update Notion lead: ${error}`);
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

    // Extract report JSON if available
    const reportJson = properties['Report JSON']?.rich_text?.[0]?.text?.content;

    return {
      leadId,
      reportJson: reportJson ? JSON.parse(reportJson) : null,
      properties
    };
  } catch (error) {
    console.error('Notion API error:', error);
    throw new Error(`Failed to get Notion lead: ${error}`);
  }
}
