/**
 * Test report normalization in isolation (no LLM, no Cloudflare).
 *
 * Run from repo root:  npx tsx scripts/test-report-normalize.ts
 *
 * This simulates what the LLM might return (different key names, structure)
 * and checks that normalizeHealthCheckReport + validateHealthCheckReport
 * produce a valid report. The values we "map" are the raw keys/values the
 * LLM returns → the exact keys/values our schema expects.
 */

import {
  normalizeHealthCheckReport,
  validateHealthCheckReport,
} from '../functions/_lib/validation';

// Example 1: LLM used different key names (risk_title, details, level instead of title, description, severity)
const llmLikePayload1 = {
  version: 1, // number instead of "1"
  summary: 'Small org with basic backups. Some concerns.',
  readiness_score: 3,
  readiness_label: 'plan', // lowercase
  top_risks: [
    {
      risk_title: 'No automated backups',
      details: 'Manual backups are easy to forget and may be incomplete.',
      level: 'high',
    },
    {
      Risk: 'Single point of failure',
      Description: 'One person handles all IT.',
      Severity: 'medium',
    },
  ],
  top_priorities: [
    { priority: 'Backup automation', description: 'Set up automated backups.', impact: 'Reduces risk.' },
  ],
  do_not_worry_yet: [{ name: 'Email', description: 'Current email setup is adequate for now.' }],
  next_steps: [
    { step: 'Schedule backup review', description: 'Review backup process.', when: 'Within 2 weeks' },
  ],
  recommended_entry_offer: 'Fixed-price assessment', // exact match
  admin_notes: 'Follow up on backup options.',
};

// Example 2: LLM returned object-as-array (common JSON mistake)
const llmLikePayload2 = {
  version: '1',
  summary: 'Organization has moderate IT maturity. Recommend planning conversation.',
  readiness_score: 4,
  readiness_label: 'Watch',
  top_risks: {
    0: { title: 'Legacy software', description: 'Some legacy apps may need upgrade.', severity: 'medium' },
    1: { title: 'Documentation', description: 'Limited documentation for key processes.', severity: 'low' },
  },
  top_priorities: {
    0: { title: 'Document processes', description: 'Document key workflows.', impact: 'Easier handoff.' },
    1: { title: 'Backup check', description: 'Verify backup restore works.', impact: 'Confidence.' },
  },
  do_not_worry_yet: { 0: { title: 'Hardware', description: 'Hardware is adequate for current load.' } },
  next_steps: {
    0: { title: 'Quick call', description: 'Discuss priorities.', timeline: 'Next week' },
    1: { title: 'Send resources', description: 'Share backup best practices.', timeline: 'Soon' },
    2: { title: 'Follow up', description: 'Check in on progress.', timeline: '1 month' },
  },
  recommended_entry_offer: 'free resources',
  admin_notes: 'Good candidate for fixed-price assessment.',
};

function runTest(name: string, payload: Record<string, unknown>) {
  console.log('\n---', name, '---');
  console.log('Before normalize (sample keys):', {
    top_risks_is_array: Array.isArray(payload.top_risks),
    first_risk_keys: Array.isArray(payload.top_risks)
      ? Object.keys((payload.top_risks as unknown[])[0] || {})
      : payload.top_risks != null && typeof payload.top_risks === 'object'
        ? Object.keys((payload.top_risks as Record<string, unknown>)['0'] || {})
        : [],
  });

  const normalized = normalizeHealthCheckReport(payload) as Record<string, unknown>;
  const result = validateHealthCheckReport(normalized);

  console.log('After normalize:', {
    top_risks_length: (normalized.top_risks as unknown[])?.length,
    first_risk: (normalized.top_risks as unknown[])?.[0],
  });
  console.log('Validation:', result.valid ? 'PASS' : 'FAIL');
  if (!result.valid && result.errors?.length) {
    console.log('Errors (first 5):', result.errors.slice(0, 5));
  }
  return result.valid;
}

const pass1 = runTest('Different key names (risk_title, details, level)', llmLikePayload1);
const pass2 = runTest('Object-as-array (top_risks = {0:..., 1:...})', llmLikePayload2);

console.log('\n=== Summary ===');
console.log('Test 1 (key names):', pass1 ? 'PASS' : 'FAIL');
console.log('Test 2 (object-as-array):', pass2 ? 'PASS' : 'FAIL');
process.exit(pass1 && pass2 ? 0 : 1);
