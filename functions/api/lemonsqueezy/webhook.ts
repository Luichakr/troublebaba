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

type Env = ResendEnv & {
  LS_WEBHOOK_SECRET?: string;
  SITE_URL?: string;
  CRON_SECRET?: string;
  TELEGRAM_COMMUNITY_URL?: string;
  PDF_BUCKET?: R2Bucket;
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

function deliverEmailHtml(link: string, communityUrl?: string): string {
  const communityBlock = communityUrl
    ? `<p style="margin:24px 0 0">
         <a href="${communityUrl}" style="background:#f0e6d2;color:#1A1A1A;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;display:inline-block;border:1px solid #d9c7a3">
           ✦ Приєднатися до Telegram-чату покупців
         </a>
       </p>
       <p style="font-size:12px;color:#8a8175;margin-top:8px">Закритий чат TROUBLEBABA: питання авторці, фото ваших робіт, оновлення збірника.</p>`
    : '';
  return `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;color:#1A1A1A">
    <h2 style="color:#8B7355">Дякуємо за покупку! 🍰</h2>
    <p>Ваш збірник «Bento Cake by TROUBLEBABA — 10 рецептів» готовий до завантаження.</p>
    <p style="margin:28px 0">
      <a href="${link}" style="background:#8B7355;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;display:inline-block">
        Завантажити PDF
      </a>
    </p>
    <p style="font-size:13px;color:#6b6257">Якщо кнопка не працює, скопіюйте посилання:<br>${link}</p>
    <p style="font-size:13px;color:#8a6d3b;background:#fbf6ec;border:1px solid #ecdcc0;border-radius:10px;padding:12px 14px">
      ⏳ Посилання персональне: діє <b>${EXPIRY_DAYS} днів</b> і розраховане на <b>${MAX_DOWNLOADS} завантаження</b>. Будь ласка, збережіть файл на свій пристрій одразу.
    </p>
    <p style="font-size:13px;color:#6b6257;margin-top:20px">
      Окремим листом Lemon Squeezy надішле офіційний чек за покупку — це нормально, зберігайте його.
    </p>
    ${communityBlock}
    <p style="font-size:13px;color:#6b6257">Питання? Напишіть на <a href="mailto:pr.troublebaba@gmail.com" style="color:#8B7355">pr.troublebaba@gmail.com</a>.</p>
  </div>`;
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

    // Custom data (buyer's PDF language) is passed at checkout via
    // ?checkout[custom][lang]=uk — LS forwards it here.
    const custom = evt?.meta?.custom_data ?? {};
    const lang = String(custom?.lang ?? '').toLowerCase().slice(0, 4) || undefined;

    if (email && orderId) {
      const origin = env.SITE_URL?.replace(/\/$/, '') || new URL(request.url).origin;
      const exp = Math.floor(Date.now() / 1000) + EXPIRY_DAYS * 86400;
      const token = await signDownloadToken(env.CRON_SECRET || '', `ls_${orderId}`, exp, lang);
      const link = `${origin}/d/${token}`;
      await sendEmail(env, {
        to: email,
        subject: 'Ваш PDF — Bento Cake by TROUBLEBABA',
        html: deliverEmailHtml(link, env.TELEGRAM_COMMUNITY_URL),
      });
    }

    // Fire-and-forget bonus counter bump. Failure must not break the webhook.
    if (env.PDF_BUCKET && orderId) {
      try { await bumpBonusCount(env.PDF_BUCKET, orderId); }
      catch (e: any) { console.warn('[bonus] bump failed:', e?.message); }
    }
  }

  return new Response('ok', { status: 200 });
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
