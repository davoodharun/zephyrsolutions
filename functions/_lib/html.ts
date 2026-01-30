/**
 * HTML report template rendering
 * Generates branded HTML report pages from report JSON
 */

export interface HealthCheckReport {
  version: string;
  summary: string;
  readiness_score: number;
  readiness_label: 'Watch' | 'Plan' | 'Act';
  top_risks: Array<{ title: string; description: string; severity: string }>;
  top_priorities: Array<{ title: string; description: string; impact: string }>;
  do_not_worry_yet: Array<{ title: string; description: string }>;
  next_steps: Array<{ title: string; description: string; timeline: string }>;
  recommended_entry_offer: string;
  admin_notes?: string;
}

/**
 * Renders HTML report page from report data
 */
export function renderReportHTML(report: HealthCheckReport, baseUrl: string = ''): string {
  const cssPath = `${baseUrl}/css/style.css`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IT Health Check Report - Zephyr Solutions</title>
  <link rel="stylesheet" href="${cssPath}">
  <style>
    .report-container {
      max-width: 900px;
      margin: 0 auto;
      padding: var(--spacing-3xl) var(--spacing-lg);
    }
    .report-header {
      text-align: center;
      margin-bottom: var(--spacing-3xl);
    }
    .readiness-badge {
      display: inline-block;
      padding: var(--spacing-sm) var(--spacing-lg);
      border-radius: calc(var(--border-radius) * 3);
      font-weight: var(--font-weight-semibold);
      margin: var(--spacing-md) 0;
    }
    .readiness-badge.watch {
      background: rgba(52, 211, 153, 0.2);
      border: 1px solid var(--color-accent);
      color: var(--color-accent-light);
    }
    .readiness-badge.plan {
      background: rgba(167, 139, 250, 0.2);
      border: 1px solid var(--color-secondary);
      color: var(--color-secondary-light);
    }
    .readiness-badge.act {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #ef4444;
      color: #fca5a5;
    }
    .report-section {
      margin-bottom: var(--spacing-3xl);
    }
    .report-section h2 {
      font-size: var(--font-size-3xl);
      color: var(--color-primary-light);
      margin-bottom: var(--spacing-lg);
    }
    .report-section h3 {
      font-size: var(--font-size-2xl);
      color: var(--color-text-primary);
      margin-top: var(--spacing-xl);
      margin-bottom: var(--spacing-md);
    }
    .report-item {
      background: var(--color-surface-variant);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
      border-radius: var(--border-radius);
    }
    .report-item h4 {
      font-size: var(--font-size-xl);
      color: var(--color-primary-light);
      margin-bottom: var(--spacing-sm);
    }
    .severity-badge {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: calc(var(--border-radius) * 2);
      font-size: var(--font-size-sm);
      margin-left: var(--spacing-sm);
    }
    .severity-badge.low {
      background: rgba(52, 211, 153, 0.2);
      color: var(--color-accent-light);
    }
    .severity-badge.medium {
      background: rgba(167, 139, 250, 0.2);
      color: var(--color-secondary-light);
    }
    .severity-badge.high {
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>IT Health Check Report</h1>
      <div class="readiness-badge ${report.readiness_label.toLowerCase()}">
        Readiness: ${report.readiness_label} (Score: ${report.readiness_score}/5)
      </div>
    </div>

    <div class="report-section">
      <h2>Summary</h2>
      <p>${escapeHtml(report.summary)}</p>
    </div>

    <div class="report-section">
      <h2>Top Risks</h2>
      ${report.top_risks.map(risk => `
        <div class="report-item">
          <h4>
            ${escapeHtml(risk.title)}
            <span class="severity-badge ${risk.severity}">${risk.severity}</span>
          </h4>
          <p>${escapeHtml(risk.description)}</p>
        </div>
      `).join('')}
    </div>

    <div class="report-section">
      <h2>Top Priorities</h2>
      ${report.top_priorities.map(priority => `
        <div class="report-item">
          <h4>${escapeHtml(priority.title)}</h4>
          <p><strong>Impact:</strong> ${escapeHtml(priority.impact)}</p>
          <p>${escapeHtml(priority.description)}</p>
        </div>
      `).join('')}
    </div>

    <div class="report-section">
      <h2>Don't Worry Yet</h2>
      ${report.do_not_worry_yet.map(item => `
        <div class="report-item">
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description)}</p>
        </div>
      `).join('')}
    </div>

    <div class="report-section">
      <h2>Recommended Next Steps</h2>
      ${report.next_steps.map(step => `
        <div class="report-item">
          <h4>${escapeHtml(step.title)}</h4>
          <p><strong>Timeline:</strong> ${escapeHtml(step.timeline)}</p>
          <p>${escapeHtml(step.description)}</p>
        </div>
      `).join('')}
    </div>

    <div class="report-section">
      <h2>Recommended Next Step</h2>
      <p>Based on your assessment, we recommend: <strong>${escapeHtml(report.recommended_entry_offer)}</strong></p>
      <p>
        <a href="${baseUrl}/#contact" class="button">Get in Touch</a>
        <a href="https://calendly.com/davoodharun/tfi" class="button button--secondary" target="_blank" rel="noopener noreferrer" style="margin-left: var(--spacing-md);">Book a Call</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Renders error page HTML
 */
export function renderErrorPage(message: string, baseUrl: string = ''): string {
  const cssPath = `${baseUrl}/css/style.css`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Not Found - Zephyr Solutions</title>
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>
  <div class="container" style="max-width: 600px; margin: 4rem auto; text-align: center; padding: var(--spacing-3xl);">
    <h1>Report Not Found</h1>
    <p>${escapeHtml(message)}</p>
    <p>Please contact us if you need assistance.</p>
    <p><a href="${baseUrl}/#contact" class="button">Contact Us</a></p>
  </div>
</body>
</html>`;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
