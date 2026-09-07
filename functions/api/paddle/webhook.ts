// POST /api/paddle/webhook
// Paddle calls this on every event. We verify the signature, and on a completed
// transaction email the buyer a download link for the PDF.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   PADDLE_WEBHOOK_SECRET  (secret)  — from Paddle → Notifications → your destination
//   PADDLE_API_KEY         (secret)  — to look up the customer email
//   PADDLE_ENV             sandbox|production
//   RESEND_API_KEY         (secret)
//   RESEND_FROM            optional, e.g. "Bento Cake <onboarding@resend.dev>"
//   SITE_URL               optional, e.g. "https://troublebaba.com" (else request origin)

import { verifyPaddleSignature, getCustomerEmail } from '../../_lib/paddle';
import type { PaddleEnv } from '../../_lib/paddle';
import { sendEmail } from '../../_lib/resend';
import type { ResendEnv } from '../../_lib/resend';
import { signDownloadToken } from '../../_lib/dl';
import { renderDeliverEmail, pickLang } from '../../_lib/deliver-copy';
import { sendPurchase } from '../../_lib/ga-server';
import type { GaServerEnv } from '../../_lib/ga-server';

type Env = PaddleEnv & ResendEnv & GaServerEnv & { SITE_URL?: string; CRON_SECRET?: string; TELEGRAM_COMMUNITY_URL?: string; PDF_BUCKET?: R2Bucket };

// Launch-bonus counter (first-50 promo). Increments idempotently — the same
// Paddle transaction id can arrive twice and we count it once.
const BONUS_COUNT_KEY = 'bonus/count';
async function bumpBonusCount(bucket: R2Bucket, txnId: string): Promise<void> {
  const seenKey = `bonus/txn/${txnId}`;
  if (await bucket.head(seenKey)) return;
  await bucket.put(seenKey, '1');
  const cur = await bucket.get(BONUS_COUNT_KEY);
  const n = cur ? parseInt(await cur.text(), 10) || 0 : 0;
  await bucket.put(BONUS_COUNT_KEY, String(n + 1));
}

const EXPIRY_DAYS = 7;
const MAX_DOWNLOADS = 3;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const raw = await request.text();

  const ok = await verifyPaddleSignature(env.PADDLE_WEBHOOK_SECRET || '', request.headers.get('Paddle-Signature'), raw);
  if (!ok) {
    return new Response('invalid signature', { status: 401 });
  }

  let evt: any;
  try { evt = JSON.parse(raw); } catch { return new Response('bad json', { status: 400 }); }

  // Only act on a completed transaction.
  if (evt?.event_type === 'transaction.completed') {
    const data = evt.data ?? {};
    let email: string | null = data?.customer?.email ?? data?.billing_details?.email ?? null;
    if (!email && data?.customer_id) {
      email = await getCustomerEmail(env, data.customer_id);
    }

    if (email) {
      const origin = env.SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
      const exp = Math.floor(Date.now() / 1000) + EXPIRY_DAYS * 86400;
      const pdfLang = pickLang(data?.custom_data?.lang);
      const token = await signDownloadToken(env.CRON_SECRET || '', String(data.id || 'txn'), exp, pdfLang);
      const link = `${origin}/d/${token}`;
      const mail = renderDeliverEmail({
        lang: pdfLang,
        link,
        expiryDays: EXPIRY_DAYS,
        maxDownloads: MAX_DOWNLOADS,
        communityUrl: env.TELEGRAM_COMMUNITY_URL,
        processor: 'paddle',
      });
      await sendEmail(env, {
        to: email,
        subject: mail.subject,
        html: mail.html,
      });
    }

    // Fire-and-forget bonus counter bump. Failure must not break checkout.
    if (env.PDF_BUCKET && data?.id) {
      try { await bumpBonusCount(env.PDF_BUCKET, String(data.id)); }
      catch (e: any) { console.warn('[bonus] bump failed:', e?.message); }
    }

    // GA4 server-side purchase — reliable revenue tracking. Best-effort.
    if (data?.id) {
      // Paddle sends money as integer minor units in details.totals.total.
      const totalMinor = Number(data?.details?.totals?.total ?? data?.details?.line_items?.[0]?.totals?.total ?? 0);
      const currency = String(data?.currency_code ?? data?.details?.totals?.currency_code ?? 'USD');
      const purchaseLang = pickLang(data?.custom_data?.lang);
      try {
        await sendPurchase(env, {
          transactionId: `pdl_${data.id}`,
          email: null,
          value: totalMinor / 100,
          currency,
          lang: purchaseLang,
          processor: 'paddle',
        });
      } catch (e: any) { console.warn('[ga] purchase failed', e?.message); }
    }
  }

  // Always 200 quickly so Paddle doesn't retry.
  return new Response('ok', { status: 200 });
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
