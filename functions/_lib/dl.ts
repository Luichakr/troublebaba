// Signed, expiring download tokens for the paid PDF. No DB: expiry lives inside
// the signed token; the per-link download counter lives as a small R2 object.
// Signing key reuses CRON_SECRET (server-only secret already configured).

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = ''; for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(s: string): string {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  return atob(s);
}
function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function hmac(secret: string, msg: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toHex(await crypto.subtle.sign('HMAC', key, enc.encode(msg)));
}
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let o = 0; for (let i = 0; i < a.length; i++) o |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return o === 0;
}

/** token = <b64url(JSON{t,e})>.<hmac>  where t=txnId, e=expiry epoch seconds. */
export async function signDownloadToken(secret: string, txnId: string, expiresAtSec: number): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ t: txnId, e: expiresAtSec })));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyDownloadToken(secret: string, token: string): Promise<{ ok: boolean; txnId?: string; sig?: string; reason?: string }> {
  const dot = token.lastIndexOf('.');
  if (dot < 0) return { ok: false, reason: 'malformed' };
  const payload = token.slice(0, dot), sig = token.slice(dot + 1);
  if (!safeEqual(await hmac(secret, payload), sig)) return { ok: false, reason: 'bad_signature' };
  let data: any;
  try { data = JSON.parse(b64urlDecode(payload)); } catch { return { ok: false, reason: 'malformed' }; }
  if (typeof data.e !== 'number' || Date.now() / 1000 > data.e) return { ok: false, reason: 'expired' };
  return { ok: true, txnId: String(data.t), sig };
}
