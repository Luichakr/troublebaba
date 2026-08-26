// Admin: mint a fresh download link for a buyer who lost theirs or hit the
// counter. Bearer auth via ADMIN_PASS — same gate as /api/m/d.
//
//   POST /api/m/relink  { "order": "9279711", "lang": "ru", "days"?: 7 }
//     → { ok: true, url: "https://troublebaba.com/d/<token>", expiresAt: 1234567890 }
//
// Fields:
//   order  — LS order id (numeric, e.g. from webhook payload data.id).
//            Prefixed to "ls_<order>" to match what the LS webhook signs.
//   lang   — pdf language: uk | ru | en | pl (default uk).
//   days   — optional link lifetime in days (default 7, max 30).
//
// The token embeds its own expiry + HMAC signature; the download endpoint
// derives the per-link counter key from the signature, so every relink
// automatically gets a fresh 3-download budget.

import { signDownloadToken } from '../../_lib/dl';

interface Env {
  ADMIN_PASS: string;
  CRON_SECRET?: string;
  SITE_URL?: string;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

function checkAuth(request: Request, env: Env): boolean {
  if (!env.ADMIN_PASS) return false;
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return !!token && timingSafeEqual(token, env.ADMIN_PASS);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const ALLOWED_LANGS = new Set(['uk', 'ru', 'en', 'pl']);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env))       return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.CRON_SECRET)               return json({ ok: false, error: 'CRON_SECRET not configured' }, 500);

  let body: any;
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }

  const orderRaw = body?.order;
  const order = typeof orderRaw === 'number' ? String(orderRaw)
              : typeof orderRaw === 'string' ? orderRaw.trim() : '';
  if (!order || !/^[A-Za-z0-9_-]{1,64}$/.test(order)) {
    return json({ ok: false, error: 'missing or invalid order id' }, 400);
  }

  const lang = typeof body?.lang === 'string' ? body.lang.toLowerCase() : 'uk';
  if (!ALLOWED_LANGS.has(lang)) return json({ ok: false, error: 'invalid lang' }, 400);

  const days = Number.isFinite(body?.days) ? Math.max(1, Math.min(30, Number(body.days))) : 7;
  const expiresAt = Math.floor(Date.now() / 1000) + days * 86400;

  const prefix = `ls_${order}`;
  const token  = await signDownloadToken(env.CRON_SECRET, prefix, expiresAt, lang);
  const origin = env.SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
  const url    = `${origin}/d/${token}`;

  return json({ ok: true, url, expiresAt, order, lang, days });
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
