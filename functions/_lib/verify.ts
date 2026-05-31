// ECDSA P-256 / SHA-256 webhook signature verification for Monobank.
// Runtime: Cloudflare Workers (uses Web Crypto SubtleCrypto).
//
// Monobank signs the RAW request body with ECDSA. The signature is sent in
// the `X-Sign` header as Base64-encoded **DER (ASN.1)**, but Web Crypto's
// `crypto.subtle.verify` expects the raw **P1363 / IEEE format** (r||s of
// fixed length). So we (a) base64-decode, (b) convert DER → P1363, then verify.

/** Base64 → Uint8Array. */
function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64.replace(/\s+/g, ''));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** Strip PEM wrappers + base64 → raw SPKI bytes. */
function pemToDer(pem: string): Uint8Array {
  const cleaned = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  return b64ToBytes(cleaned);
}

/** Convert DER-encoded ECDSA signature (SEQUENCE { INTEGER r, INTEGER s }) to
 *  the IEEE P1363 layout (r||s, each left-padded to `size` bytes). */
function derToP1363(der: Uint8Array, size = 32): Uint8Array {
  if (der[0] !== 0x30) throw new Error('Invalid ECDSA DER signature: missing SEQUENCE tag');
  let offset = 2;                                     // skip 0x30 + length
  if (der[1] & 0x80) offset = 2 + (der[1] & 0x7f);    // long-form length

  if (der[offset] !== 0x02) throw new Error('Invalid ECDSA DER: missing first INTEGER tag (r)');
  const rLen = der[offset + 1];
  let r = der.slice(offset + 2, offset + 2 + rLen);
  offset += 2 + rLen;

  if (der[offset] !== 0x02) throw new Error('Invalid ECDSA DER: missing second INTEGER tag (s)');
  const sLen = der[offset + 1];
  let s = der.slice(offset + 2, offset + 2 + sLen);

  // INTEGERs may have a leading 0x00 (to mark positive) or be shorter than `size`.
  if (r.length > size) r = r.slice(r.length - size);
  if (s.length > size) s = s.slice(s.length - size);

  const out = new Uint8Array(size * 2);
  out.set(r, size - r.length);
  out.set(s, size + size - s.length);
  return out;
}

let cachedKey: CryptoKey | null = null;
let cachedKeySource: string | null = null;

/** Import an ECDSA P-256 public key from a base64-encoded PEM (matches Monobank's `key` field). */
export async function importMonoPubKey(base64Pem: string): Promise<CryptoKey> {
  if (cachedKey && cachedKeySource === base64Pem) return cachedKey;
  // The `key` field returned by Monobank is itself base64; once decoded, it's a PEM string.
  const pemString = new TextDecoder().decode(b64ToBytes(base64Pem));
  const der = pemToDer(pemString);
  const key = await crypto.subtle.importKey(
    'spki',
    der.buffer.slice(der.byteOffset, der.byteOffset + der.byteLength) as ArrayBuffer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify'],
  );
  cachedKey = key;
  cachedKeySource = base64Pem;
  return key;
}

/** Verify an X-Sign header (base64 DER ECDSA signature) against the raw body bytes. */
export async function verifyWebhook(
  pubKey: CryptoKey,
  xSignBase64: string,
  bodyBytes: Uint8Array,
): Promise<boolean> {
  const derSig = b64ToBytes(xSignBase64);
  const p1363  = derToP1363(derSig, 32);
  return crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    pubKey,
    p1363.buffer.slice(p1363.byteOffset, p1363.byteOffset + p1363.byteLength) as ArrayBuffer,
    bodyBytes.buffer.slice(bodyBytes.byteOffset, bodyBytes.byteOffset + bodyBytes.byteLength) as ArrayBuffer,
  );
}
