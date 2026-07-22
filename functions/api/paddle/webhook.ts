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

type Env = PaddleEnv & ResendEnv & { SITE_URL?: string; CRON_SECRET?: string; TELEGRAM_COMMUNITY_URL?: string };

const EXPIRY_DAYS = 7;
const MAX_DOWNLOADS = 3;

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
    ${communityBlock}
    <p style="font-size:13px;color:#6b6257">Питання? Напишіть у Instagram @troublebaba.</p>
  </div>`;
}

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
      const lang = String(data?.custom_data?.lang ?? '').toLowerCase().slice(0, 4) || undefined;
      const token = await signDownloadToken(env.CRON_SECRET || '', String(data.id || 'txn'), exp, lang);
      const link = `${origin}/d/${token}`;
      await sendEmail(env, {
        to: email,
        subject: 'Ваш PDF — Bento Cake by TROUBLEBABA',
        html: deliverEmailHtml(link, env.TELEGRAM_COMMUNITY_URL),
      });
    }
  }

  // Always 200 quickly so Paddle doesn't retry.
  return new Response('ok', { status: 200 });
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
