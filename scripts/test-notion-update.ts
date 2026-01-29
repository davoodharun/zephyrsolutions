/**
 * Test Notion lead update in isolation (no Cloudflare, no submit flow).
 * Uses the same updateNotionLead logic as the API so you can see the exact
 * Notion API error when the update fails (e.g. property name/type mismatch).
 *
 * Prerequisites:
 *   - .env with NOTION_API_KEY and NOTION_DB_LEADS_ID (or set in shell)
 *   - A lead that already exists in your Notion DB (e.g. from a prior form submit)
 *
 * Run from repo root:
 *   npm run test:notion-update -- <leadId>
 *   npm run test:notion-update -- lead_1769656904140_05kqocx
 *
 * Or with npx/tsx directly:
 *   npx tsx scripts/test-notion-update.ts lead_1769656904140_05kqocx
 *
 * Or set TEST_LEAD_ID and run:
 *   TEST_LEAD_ID=lead_xxx npm run test:notion-update
 */

import 'dotenv/config';
import { updateNotionLead } from '../functions/_lib/notion';
import type { Env } from '../functions/_lib/env';

const leadId = process.argv[2] || process.env.TEST_LEAD_ID;
if (!leadId) {
  console.error('Usage: npx tsx scripts/test-notion-update.ts <leadId>');
  console.error('   or: TEST_LEAD_ID=lead_xxx npx tsx scripts/test-notion-update.ts');
  process.exit(1);
}

const apiKey = process.env.NOTION_API_KEY;
const dbId = process.env.NOTION_DB_LEADS_ID;
if (!apiKey || !dbId) {
  console.error('Missing NOTION_API_KEY or NOTION_DB_LEADS_ID. Set in .env or environment.');
  process.exit(1);
}

const env: Env = {
  NOTION_API_KEY: apiKey,
  NOTION_DB_LEADS_ID: dbId,
  LLM_API_KEY: '',
  EMAIL_API_KEY: '',
  EMAIL_FROM: '',
  PUBLIC_BASE_URL: '',
  REPORT_TOKEN_SECRET: '',
};

// Minimal valid report shape (same as production after normalization)
const sampleReport = {
  version: '1',
  summary:
    'Test summary for isolated Notion update. Organization has moderate IT maturity. Recommend planning conversation.',
  readiness_score: 3,
  readiness_label: 'Plan',
  top_risks: [
    {
      title: 'No automated backups',
      description: 'Manual backups are easy to forget and may be incomplete.',
      severity: 'high',
    },
    {
      title: 'Single point of failure',
      description: 'One person handles all IT with limited documentation.',
      severity: 'medium',
    },
  ],
  top_priorities: [
    {
      title: 'Backup automation',
      description: 'Set up automated backups to reduce risk of data loss.',
      impact: 'Reduces risk and ensures consistency.',
    },
  ],
  do_not_worry_yet: [
    {
      title: 'Email',
      description: 'Current email setup is adequate for now.',
    },
  ],
  next_steps: [
    { title: 'Schedule backup review', description: 'Review backup process.', timeline: 'Within 2 weeks' },
    { title: 'Send resources', description: 'Share backup best practices.', timeline: 'Soon' },
  ],
  recommended_entry_offer: 'Fixed-price assessment',
  admin_notes: 'Isolated test run – safe to ignore.',
};

async function main() {
  console.log('Lead ID:', leadId);
  console.log('Notion DB ID:', dbId);
  console.log('Calling updateNotionLead...\n');

  try {
    await updateNotionLead(leadId, sampleReport, env);
    console.log('Update succeeded. Check Notion: Status should be "sent" and Report JSON should be populated.');
  } catch (error: unknown) {
    console.error('Update failed.\n');
    const err = error as { body?: unknown; code?: string; message?: string };
    if (err.body !== undefined) {
      console.error('Notion API response body:', JSON.stringify(err.body, null, 2));
    }
    if (err.message) {
      console.error('Message:', err.message);
    }
    console.error('Full error:', error);
    process.exit(1);
  }
}

main();
