// Paddle helpers for Cloudflare Pages Functions (Web Crypto, no deps).

export interface PaddleEnv {
  /** Notification-destination signing secret (starts with "pdl_ntfset_..."). */
  PADDLE_WEBHOOK_SECRET?: string;
  /** Server API key (starts with "pdl_sdbx_apikey_..." / "pdl_live_apikey_..."). */
  PADDLE_API_KEY?: string;
  /** 'sandbox' | 'production' — picks the API base URL. */
  PADDLE_ENV?: string;
}

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Constant-time-ish string compare. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

/** Verify the `Paddle-Signature: ts=..;h1=..` header against the raw body.
 *  Docs: https://developer.paddle.com/webhooks/signature-verification */
export async function verifyPaddleSignature(secret: string, header: string | null, rawBody: string): Promise<boolean> {
  if (!secret || !header) return false;
  const parts = Object.fromEntries(header.split(';').map(kv => {
    const i = kv.indexOf('=');
    return [kv.slice(0, i).trim(), kv.slice(i + 1).trim()];
  }));
  const ts = parts['ts'];
  const h1 = parts['h1'];
  if (!ts || !h1) return false;

  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(`${ts}:${rawBody}`));
  return safeEqual(toHex(sig), h1);
}

function apiBase(env: PaddleEnv): string {
  return (env.PADDLE_ENV === 'production')
    ? 'https://api.paddle.com'
    : 'https://sandbox-api.paddle.com';
}

/** Fetch a customer's email by id (transaction webhooks carry customer_id, not email). */
export async function getCustomerEmail(env: PaddleEnv, customerId: string): Promise<string | null> {
  if (!env.PADDLE_API_KEY || !customerId) return null;
  try {
    const res = await fetch(`${apiBase(env)}/customers/${customerId}`, {
      headers: { Authorization: `Bearer ${env.PADDLE_API_KEY}` },
    });
    if (!res.ok) return null;
    const body = await res.json<any>();
    return body?.data?.email ?? null;
  } catch {
    return null;
  }
}
