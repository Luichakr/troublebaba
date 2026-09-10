// POST /api/lemonsqueezy/webhook
// Lemon Squeezy calls this on every event. We verify HMAC-SHA256 signature and
// on `order_created` we email the buyer a signed download link for the PDF.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   LS_WEBHOOK_SECRET  (secret)  — signing secret from LS → Settings → Webhooks
//   RESEND_API_KEY     (secret)  — for sending the delivery email
//   RESEND_FROM        optional
//   CRON_SECRET        (secret)  — used to sign the /d/<token> download URL
//   SITE_URL           optional, e.g. "https://troublebaba.com"
//   TELEGRAM_COMMUNITY_URL  optional
//   PDF_BUCKET         R2 binding (bonus counter)

import { sendEmail } from '../../_lib/resend';
import type { ResendEnv } from '../../_lib/resend';
import { signDownloadToken } from '../../_lib/dl';
import { sendMessage, tgEscape } from '../../_lib/telegram';
import type { TGEnv } from '../../_lib/telegram';
import { renderDeliverEmail, pickLang } from '../../_lib/deliver-copy';
import { sendPurchase } from '../../_lib/ga-server';
import type { GaServerEnv } from '../../_lib/ga-server';

type Env = ResendEnv & TGEnv & GaServerEnv & {
  LS_WEBHOOK_SECRET?: string;
  SITE_URL?: string;
  CRON_SECRET?: string;
  TELEGRAM_COMMUNITY_URL?: string;
  /** Comma-separated Telegram chat ids that get a "new sale" ping. */
  TELEGRAM_ADMIN_CHAT_IDS?: string;
  PDF_BUCKET?: R2Bucket;
  DB?: D1Database;
};

// Human-readable names for the four per-currency stores, so the Telegram
// ping says "troublebaba PL · PLN" instead of a bare numeric store id.
const STORE_NAMES: Record<string, string> = {
  '446675': 'troublebaba · UAH',
  '450343': 'troublebaba EN · EUR',
  '452188': 'troublebaba PL · PLN',
  '452190': 'troublebaba RU · USD',
};

const EXPIRY_DAYS = 7;
const MAX_DOWNLOADS = 3;

// Verify Lemon Squeezy webhook signature.
// LS signs the raw request body with HMAC-SHA256 using your webhook secret;
// the hex digest is sent in the `X-Signature` header. Timing-safe compare.
async function verifyLsSignature(secret: string, signature: string | null, rawBody: string): Promise<boolean> {
  if (!secret || !signature) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(rawBody));
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

// Launch-bonus counter — same shape as the Paddle handler.
const BONUS_COUNT_KEY = 'bonus/count';
async function bumpBonusCount(bucket: R2Bucket, orderId: string): Promise<void> {
  const seenKey = `bonus/txn/ls_${orderId}`;
  if (await bucket.head(seenKey)) return;
  await bucket.put(seenKey, '1');
  const cur = await bucket.get(BONUS_COUNT_KEY);
  const n = cur ? parseInt(await cur.text(), 10) || 0 : 0;
  await bucket.put(BONUS_COUNT_KEY, String(n + 1));
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const raw = await request.text();
  const ok = await verifyLsSignature(env.LS_WEBHOOK_SECRET || '', request.headers.get('X-Signature'), raw);
  if (!ok) return new Response('invalid signature', { status: 401 });

  let evt: any;
  try { evt = JSON.parse(raw); } catch { return new Response('bad json', { status: 400 }); }

  const eventName = evt?.meta?.event_name;
  // Only act on the initial paid order. Refunds, dispute events etc. flow past.
  if (eventName === 'order_created') {
    const attrs = evt?.data?.attributes ?? {};
    const orderId = String(evt?.data?.id ?? '');
    const email: string | undefined = attrs.user_email || attrs.customer_email;

    // Custom data (buyer's PDF language + which CTA they clicked) is passed at
    // checkout via ?checkout[custom][lang]=uk&checkout[custom][source]=hero.
    // LS forwards it here as meta.custom_data.{lang,source}.
    const custom = evt?.meta?.custom_data ?? {};
    const lang   = String(custom?.lang   ?? '').toLowerCase().slice(0, 4) || undefined;
    const buyBtn = String(custom?.source ?? '').toLowerCase().slice(0, 32) || undefined;

    if (email && orderId) {
      const origin = env.SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
      const exp = Math.floor(Date.now() / 1000) + EXPIRY_DAYS * 86400;
      const storeId = String(attrs.store_id ?? '');
      const pdfLang = pickLang(lang, storeId);
      const token = await signDownloadToken(env.CRON_SECRET || '', `ls_${orderId}`, exp, pdfLang);
      const link = `${origin}/d/${token}`;
      const mail = renderDeliverEmail({
        lang: pdfLang,
        link,
        expiryDays: EXPIRY_DAYS,
        maxDownloads: MAX_DOWNLOADS,
        communityUrl: env.TELEGRAM_COMMUNITY_URL,
        processor: 'ls',
      });
      const emailRes = await sendEmail(env, {
        to: email,
        subject: mail.subject,
        html: mail.html,
      });
      // Surface Resend failures in CF Pages real-time logs so we notice a
      // silent misconfiguration (missing API key, unverified domain, etc.)
      // instead of returning 200 while no email actually goes out.
      if (!emailRes.ok) {
        console.error('[ls-webhook] sendEmail failed', { orderId, to: email, error: emailRes.error });
      } else {
        console.log('[ls-webhook] email queued', { orderId, id: emailRes.id });
      }
    } else {
      console.warn('[ls-webhook] missing email or orderId', { hasEmail: !!email, orderId });
    }

    // Fire-and-forget bonus counter bump. Failure must not break the webhook.
    if (env.PDF_BUCKET && orderId) {
      try { await bumpBonusCount(env.PDF_BUCKET, orderId); }
      catch (e: any) { console.warn('[bonus] bump failed:', e?.message); }
    }

    // GA4 server-side purchase — reliable revenue tracking, independent of
    // whether the buyer ever hits /thank-you. Best-effort.
    if (orderId) {
      const total    = Number(attrs.total ?? 0) / 100;
      const currency = String(attrs.currency ?? '') || 'USD';
      const storeId  = String(attrs.store_id ?? '');
      const purchaseLang = pickLang(lang, storeId);
      try {
        await sendPurchase(env, {
          transactionId: `ls_${orderId}`,
          email,
          value: total,
          currency,
          lang: purchaseLang,
          storeId,
          processor: 'ls',
          buyButton: buyBtn,
        });
      } catch (e: any) { console.warn('[ga] purchase failed', e?.message); }
    }

    // Telegram "new sale" ping to the owner's group. Best-effort: a Telegram
    // outage must never affect PDF delivery, so every send is wrapped.
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_ADMIN_CHAT_IDS) {
      const chatIds = env.TELEGRAM_ADMIN_CHAT_IDS.split(',').map(s => s.trim()).filter(Boolean);
      const storeId   = String(attrs.store_id ?? '');
      const storeName = STORE_NAMES[storeId] || `store ${storeId}`;
      // LS sends money as integer minor units (800.00 UAH → 80000).
      const total    = (Number(attrs.total ?? 0) / 100).toFixed(2);
      const currency = String(attrs.currency ?? '');
      const text =
        `💰 <b>Новая продажа</b>\n\n` +
        `Магазин: ${tgEscape(storeName)}\n` +
        `Сумма: <b>${tgEscape(total)} ${tgEscape(currency)}</b>\n` +
        `Покупатель: ${tgEscape(email || '—')}\n` +
        `PDF-язык: ${tgEscape(lang || '—')}\n` +
        `Order: #${tgEscape(orderId)}`;
      for (const chatId of chatIds) {
        try { await sendMessage(env, chatId, text, { parse_mode: 'HTML' }); }
        catch (e: any) { console.warn('[tg] sale notify failed', chatId, e?.message); }
      }
    }

    // D1 purchase event — so the operator dashboard can show purchases
    // alongside click_buy without needing GA4 access.
    if (env.DB && orderId) {
      const total    = (Number(attrs.total ?? 0) / 100).toFixed(2);
      const currency = String(attrs.currency ?? '') || 'USD';
      const storeId  = String(attrs.store_id ?? '');
      try {
        await env.DB.prepare(
          `INSERT INTO events (ts, type, source, page_lang, page_path, user_agent, ip_country, ref, extra)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          Date.now(),
          'purchase',
          buyBtn || 'webhook',
          pickLang(lang, storeId),
          null,
          null,
          null,
          null,
          JSON.stringify({ order_id: orderId, total, currency, store_id: storeId, email: email?.slice(0, 60) }),
        ).run();
      } catch (e: any) { console.warn('[d1] purchase write failed', e?.message); }
    }
  }

  return new Response('ok', { status: 200 });
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
