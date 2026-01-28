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

/**
 * Maps form submission to Notion database properties
 */
function mapSubmissionToNotionProperties(submission: any, status: string): any {
  return {
    'Org Name': {
      title: [
        {
          text: {
            content: submission.org_name
          }
        }
      ]
    },
    'Contact Name': {
      rich_text: [
        {
          text: {
            content: submission.contact_name
          }
        }
      ]
    },
    'Email': {
      email: submission.email
    },
    'Org Size': {
      select: {
        name: submission.org_size
      }
    },
    'Tools': {
      multi_select: submission.current_tools.map((tool: string) => ({ name: tool }))
    },
    'Pain Points': {
      multi_select: submission.top_pain_points.map((point: string) => ({ name: point }))
    },
    'Backups': {
      select: {
        name: submission.backups_maturity
      }
    },
    'Security Confidence': {
      select: {
        name: submission.security_confidence
      }
    },
    'Budget Comfort': {
      select: {
        name: submission.budget_comfort
      }
    },
    'Timeline': {
      select: {
        name: submission.timeline
      }
    },
    'Status': {
      select: {
        name: status
      }
    },
    'Source': {
      select: {
        name: 'website-healthcheck'
      }
    },
    'Created At': {
      date: {
        start: new Date().toISOString()
      }
    },
    'Updated At': {
      date: {
        start: new Date().toISOString()
      }
    }
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

  // Update the lead with report data
  const updateProperties: any = {
    'Status': {
      select: {
        name: 'sent'
      }
    },
    'Readiness Score': {
      number: report.readiness_score
    },
    'Readiness Label': {
      select: {
        name: report.readiness_label
      }
    },
    'Report Summary': {
      rich_text: [
        {
          text: {
            content: report.summary
          }
        }
      ]
    },
    'Report JSON': {
      rich_text: [
        {
          text: {
            content: JSON.stringify(report)
          }
        }
      ]
    },
    'Updated At': {
      date: {
        start: new Date().toISOString()
      }
    }
  };

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

  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Status': {
          select: {
            name: 'needs_manual_review'
          }
        },
        'Updated At': {
          date: {
            start: new Date().toISOString()
          }
        }
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
