// Shared helpers for talking to Monobank Acquiring API.
// Runtime: Cloudflare Pages Functions (Workers V8 isolate — uses Web fetch / SubtleCrypto, NOT Node APIs).

export interface Env {
  /** Merchant X-Token (production: web.monobank.ua → Мерчант. Test: api.monobank.ua via QR). */
  MONOBANK_TOKEN: string;
  /** Optional override (defaults to https://api.monobank.ua). */
  MONOBANK_API?: string;
  /** Base64 PEM public key for webhook signature verification.
   *  If absent, the worker fetches it from /api/merchant/pubkey on first use.
   *  Cache it in env to avoid an extra request per cold start. */
  MONOBANK_PUBKEY?: string;
  /** Optional site URL override; falls back to request origin. */
  SITE_URL?: string;

  // ─── Telegram notifications (successful payments only) ───
  /** Bot token from @BotFather. Encrypted in CF env. */
  TELEGRAM_BOT_TOKEN?: string;
  /** Comma-separated list of Telegram chat IDs to notify. Example: "436984255,123456789". */
  TELEGRAM_NOTIFY_CHAT_IDS?: string;
}

const DEFAULT_API = 'https://api.monobank.ua';

export interface InvoiceCreateRequest {
  amount: number;          // minor units (kopecks for UAH)
  ccy?: number;            // ISO 4217. 980 = UAH, 840 = USD, 978 = EUR. Default 980.
  merchantPaymInfo?: {
    reference?: string;
    destination?: string;
    comment?: string;
    customerEmails?: string[];
    basketOrder?: Array<{
      name: string;
      qty: number;
      sum: number;
      icon?: string;
      unit?: string;
      code?: string;
    }>;
  };
  redirectUrl?: string;
  webHookUrl?: string;
  validity?: number;
  paymentType?: 'debit' | 'hold';
}

export interface InvoiceCreateResponse {
  invoiceId: string;
  pageUrl: string;
}

export interface InvoiceStatusResponse {
  invoiceId: string;
  status: 'created' | 'processing' | 'hold' | 'success' | 'failure' | 'reversed' | 'expired';
  amount: number;
  ccy: number;
  finalAmount?: number;
  createdDate?: string;
  modifiedDate?: string;
  reference?: string;
  destination?: string;
  errCode?: string;
  failureReason?: string;
  paymentInfo?: Record<string, unknown>;
  cancelList?: unknown[];
  tipsInfo?: unknown;
  walletData?: unknown;
}

/** Low-level Monobank API call. Throws on non-2xx. */
export async function monoFetch<T = unknown>(
  env: Env,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<T> {
  if (!env.MONOBANK_TOKEN) {
    throw new Error('MONOBANK_TOKEN env variable is missing — set it in Cloudflare Pages → Settings → Environment variables.');
  }
  const base = (env.MONOBANK_API ?? DEFAULT_API).replace(/\/$/, '');
  const init: RequestInit = {
    method,
    headers: {
      'X-Token': env.MONOBANK_TOKEN,
      'X-Cms': 'troublebaba-landing',
      'X-Cms-Version': '1.0.0',
      'Content-Type': 'application/json',
    },
  };
  if (body !== undefined) init.body = JSON.stringify(body);

  const res = await fetch(base + path, init);
  const text = await res.text();
  let parsed: unknown = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { /* leave null */ }
  if (!res.ok) {
    const err: any = new Error(`Monobank ${method} ${path} → ${res.status}: ${text.slice(0, 400)}`);
    err.status = res.status;
    err.body = parsed ?? text;
    throw err;
  }
  return parsed as T;
}

export function createInvoice(env: Env, payload: InvoiceCreateRequest) {
  return monoFetch<InvoiceCreateResponse>(env, 'POST', '/api/merchant/invoice/create', payload);
}

export function getInvoiceStatus(env: Env, invoiceId: string) {
  return monoFetch<InvoiceStatusResponse>(env, 'GET', `/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`);
}

export function getPubKey(env: Env) {
  return monoFetch<{ key: string }>(env, 'GET', '/api/merchant/pubkey');
}

/** JSON response helper with sensible defaults. */
export function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status: init.status ?? 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export function bad(status: number, message: string, extra: Record<string, unknown> = {}): Response {
  return json({ ok: false, error: message, ...extra }, { status });
}

/** Resolve the absolute site origin from request or env. */
export function siteOrigin(request: Request, env: Env): string {
  if (env.SITE_URL) return env.SITE_URL.replace(/\/$/, '');
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}
