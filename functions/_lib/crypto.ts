/**
 * HMAC token generation and verification for report links
 * Uses Web Crypto API (available in Cloudflare Workers)
 */

export interface TokenPayload {
  leadId: string;
  exp: number; // Expiration timestamp
}

export interface TokenVerificationResult {
  valid: boolean;
  expired?: boolean;
  leadId?: string;
  error?: string;
}

/**
 * Generates a signed token for report access
 * Format: base64url(leadId.exp.signature)
 * 
 * @param leadId Lead identifier
 * @param secret HMAC secret key
 * @param expiryDays Number of days until expiration (default: 30)
 */
export async function generateReportToken(
  leadId: string,
  secret: string,
  expiryDays: number = 30
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + (expiryDays * 24 * 60 * 60);
  const payload = `${leadId}.${exp}`;

  // Create HMAC key
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Sign the payload
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );

  // Convert signature to base64url
  const sigBase64 = arrayBufferToBase64Url(signature);

  // Combine payload and signature
  const token = `${payload}.${sigBase64}`;

  return token;
}

/**
 * Verifies a signed token and extracts lead ID
 * 
 * @param token Signed token string
 * @param secret HMAC secret key
 */
export async function verifyReportToken(
  token: string,
  secret: string
): Promise<TokenVerificationResult> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [leadId, expStr, signature] = parts;
    const exp = parseInt(expStr, 10);

    if (isNaN(exp)) {
      return { valid: false, error: 'Invalid expiration in token' };
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      return { valid: false, expired: true, error: 'Token expired' };
    }

    // Verify signature
    const payload = `${leadId}.${exp}`;
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToArrayBuffer(signature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      new TextEncoder().encode(payload)
    );

    if (!isValid) {
      return { valid: false, error: 'Invalid token signature' };
    }

    return { valid: true, leadId };
  } catch (error) {
    return { valid: false, error: `Token verification failed: ${error}` };
  }
}

/**
 * Converts ArrayBuffer to base64url string
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Converts base64url string to ArrayBuffer
 */
function base64UrlToArrayBuffer(base64: string): ArrayBuffer {
  // Convert base64url to base64
  let base64Normalized = base64.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (base64Normalized.length % 4) {
    base64Normalized += '=';
  }

  const binary = atob(base64Normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
