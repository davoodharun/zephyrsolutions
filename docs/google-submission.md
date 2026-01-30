# Google Search Console Submission

This runbook describes how to submit the site to Google so it can discover and index pages. Perform these steps after the site is live on the primary domain.

## Prerequisites

- Site is deployed and publicly accessible at the primary domain (e.g. `https://zephyrsolutions.com`).
- Sitemap and robots.txt are built and served at `/sitemap.xml` and `/robots.txt` (generated at build time).

## 1. Verify property in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add a property:
   - **Domain property**: Enter the domain (e.g. `zephyrsolutions.com`). Verify via DNS TXT record.
   - **URL prefix property**: Enter the full URL (e.g. `https://zephyrsolutions.com`). Verify via HTML file upload, HTML meta tag, or Google Analytics.
3. Complete the verification steps as shown in GSC. Once verified, the property appears in your account.

## 2. Submit the sitemap

1. In Search Console, open the verified property.
2. In the left sidebar, go to **Sitemaps**.
3. Under "Add a new sitemap", enter: `sitemap.xml` (or the full URL `https://zephyrsolutions.com/sitemap.xml`).
4. Click **Submit**. Google will fetch and process the sitemap. Status may show "Success" after a short time; indexing of URLs can take longer (hours to days).

## 3. Optional: Request indexing for critical URLs

1. Use **URL inspection** (search bar at top of GSC).
2. Enter the homepage or a key URL (e.g. `https://zephyrsolutions.com/` or `https://zephyrsolutions.com/health-check/`).
3. If the URL is not indexed, use **Request indexing** to ask Google to crawl it sooner. This is optional; sitemap submission is the primary mechanism.

## 4. After domain or host changes

- If the primary domain or host changes, update `primaryDomain` in `content/global/settings.json` and rebuild so sitemap and robots.txt use the new URL.
- In GSC, add and verify the new property if the domain changed; submit the sitemap URL again.
- Remove or update the old property in GSC if you no longer use that domain.

## Verification

- In GSC **Sitemaps**, confirm the sitemap status is "Success" and that discovered/indexed counts increase over time.
- In **URL inspection**, check that key URLs are "URL is on Google" after indexing completes.
- No critical coverage errors should appear for intended public pages; fix any reported issues (e.g. 404s, blocked resources) as needed.
