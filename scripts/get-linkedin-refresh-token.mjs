#!/usr/bin/env node
/**
 * One-time OAuth helper: get a LinkedIn refresh_token for the LinkedIn Publish workflow.
 *
 * Prerequisites:
 * 1. Create an app at https://www.linkedin.com/developers/apps
 * 2. In the app: Auth tab → add Redirect URL: http://localhost:8080/callback
 * 3. Under Products, add "Sign In with LinkedIn using OpenID Connect"; for company page add "Advertising API" too.
 * 4. Set env: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET
 * 5. For company page token, set LINKEDIN_USE_COMPANY_PAGE=true (requires Advertising API on the app; otherwise you get invalid_scope).
 *
 * Run: node scripts/get-linkedin-refresh-token.mjs
 *      LINKEDIN_USE_COMPANY_PAGE=true node scripts/get-linkedin-refresh-token.mjs   # for company page
 * Then open the URL shown (or the script will try to open it), sign in with LinkedIn, approve.
 * The script will print refresh_token and access_token; put refresh_token in GitHub Secret LINKEDIN_REFRESH_TOKEN.
 */

import { createServer } from 'http';
import { exec } from 'child_process';
import { platform } from 'os';

const PORT = 8080;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;
// Base scopes: w_member_social (personal), openid + profile (userinfo/me).
// w_organization_social is only requested when LINKEDIN_USE_COMPANY_PAGE=true (requires Advertising API product on the app).
const BASE_SCOPE = 'w_member_social openid profile';
const COMPANY_PAGE_SCOPE = 'w_organization_social';
const SCOPE = process.env.LINKEDIN_USE_COMPANY_PAGE === 'true' || process.env.LINKEDIN_USE_COMPANY_PAGE === '1'
  ? `${BASE_SCOPE} ${COMPANY_PAGE_SCOPE}`
  : BASE_SCOPE;
const AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

const clientId = process.env.LINKEDIN_CLIENT_ID;
const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in the environment (or .env).');
  console.error('Example: LINKEDIN_CLIENT_ID=xxx LINKEDIN_CLIENT_SECRET=yyy node scripts/get-linkedin-refresh-token.mjs');
  process.exit(1);
}

const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
const authUrl = `${AUTH_URL}?response_type=code&client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${state}&scope=${encodeURIComponent(SCOPE)}`;

function openBrowser(url) {
  const cmd = platform() === 'win32' ? `start "" "${url}"` : platform() === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
  exec(cmd, (err) => { if (err) console.log('Open this URL in your browser:', url); });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://localhost:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const errorParam = url.searchParams.get('error');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (errorParam) {
    res.writeHead(200);
    res.end(`<p>LinkedIn returned an error: <strong>${errorParam}</strong>. ${url.searchParams.get('error_description') || ''}</p><p>Check the terminal for details.</p>`);
    server.close();
    return;
  }
  if (returnedState !== state) {
    res.writeHead(200);
    res.end('<p>State mismatch. Please run the script again.</p>');
    server.close();
    return;
  }
  if (!code) {
    res.writeHead(200);
    res.end('<p>No authorization code received. Try again.</p>');
    server.close();
    return;
  }
  try {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: clientId,
      client_secret: clientSecret,
    });
    const tokenRes = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    const data = await tokenRes.json();
    if (!tokenRes.ok) {
      res.writeHead(200);
      res.end(`<p>Token exchange failed (${tokenRes.status}): ${data.error_description || data.error || JSON.stringify(data)}</p>`);
      server.close();
      return;
    }
    res.writeHead(200);
    res.end('<p><strong>Success!</strong> Check the terminal. Add <code>LINKEDIN_ACCESS_TOKEN</code> to GitHub Secrets (LinkedIn often does not return a refresh token).</p>');
    console.log('\n--- Copy to GitHub Secrets ---\n');
    console.log('LINKEDIN_ACCESS_TOKEN (use this; valid ~60 days, then re-run this script):');
    console.log(data.access_token || '(missing)');
    console.log('\nLINKEDIN_REFRESH_TOKEN (only if LinkedIn returned one):');
    console.log(data.refresh_token || '(not returned by LinkedIn)');
    if (data.expires_in) console.log('\nAccess token expires in (seconds):', data.expires_in);
    if (data.refresh_token_expires_in) console.log('Refresh token expires in (seconds):', data.refresh_token_expires_in);
    console.log('\n---\n');
    server.close();
  } catch (e) {
    res.writeHead(500);
    res.end('<p>Token exchange failed: ' + String(e) + '</p>');
    console.error(e);
    server.close();
  }
});

server.listen(PORT, () => {
  console.log('Local callback server listening on', REDIRECT_URI);
  console.log('Requested scopes:', SCOPE);
  if (SCOPE.includes(COMPANY_PAGE_SCOPE)) {
    console.log('(Company page: w_organization_social — ensure Advertising API is on your app or you may get invalid_scope)');
  }
  console.log('Opening browser for LinkedIn sign-in...');
  openBrowser(authUrl);
  console.log('If the browser did not open, visit:\n', authUrl);
});
