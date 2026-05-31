// POST /api/checkout/webhook
// Monobank calls this URL (up to 3 retries until HTTP 200) on every invoice status change.
// We verify the ECDSA signature in `X-Sign`, then log the event.
//
// To actually deliver PDFs on success, wire up an email step inside `handleSuccess`
// (e.g. Resend HTTP API + a R2-stored PDF link). The signature/auth boilerplate
// here is the security boundary — never trust the body without verifying X-Sign.

import { getPubKey, json, bad } from '../../_lib/monobank';
import { importMonoPubKey, verifyWebhook } from '../../_lib/verify';
import type { Env, InvoiceStatusResponse } from '../../_lib/monobank';

async function fetchAndCacheKey(env: Env): Promise<string> {
  // If MONOBANK_PUBKEY env var is set, prefer it (no extra request per cold start).
  if (env.MONOBANK_PUBKEY) return env.MONOBANK_PUBKEY;
  const { key } = await getPubKey(env);
  return key;
}

/** Escape `&`, `<`, `>` for Telegram HTML parse mode. */
function tgEscape(s: string | undefined | null): string {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fmtAmount(kopecks: number, ccy: number): string {
  const sym = ccy === 980 ? 'UAH' : ccy === 840 ? 'USD' : ccy === 978 ? 'EUR' : String(ccy);
  return (kopecks / 100).toFixed(2) + ' ' + sym;
}

function fmtKievTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  // ru-RU + Europe/Kiev → "31 мая 2026 г., 22:45"
  return d.toLocaleString('ru-RU', {
    timeZone: 'Europe/Kiev',
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Post a notification to every chat in TELEGRAM_NOTIFY_CHAT_IDS. Best-effort,
 *  never throws (a Telegram outage must not break the webhook). */
async function notifyTelegram(env: Env, invoice: InvoiceStatusResponse): Promise<void> {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_NOTIFY_CHAT_IDS) return;

  const chatIds = env.TELEGRAM_NOTIFY_CHAT_IDS.split(',').map(s => s.trim()).filter(Boolean);
  if (chatIds.length === 0) return;

  const pi: any = invoice.paymentInfo ?? {};
  const lines = [
    '<b>🍰 Новая продажа</b>',
    'Bento Cake by TROUBLEBABA — PDF',
    '',
    '<b>Сумма:</b> ' + tgEscape(fmtAmount(invoice.finalAmount ?? invoice.amount, invoice.ccy)),
    '<b>Время:</b> ' + tgEscape(fmtKievTime(invoice.modifiedDate)),
    '',
    '<b>Invoice:</b> <code>' + tgEscape(invoice.invoiceId) + '</code>',
    invoice.reference ? '<b>Ref:</b> <code>' + tgEscape(invoice.reference) + '</code>' : '',
    pi.maskedPan  ? '<b>Карта:</b> <code>' + tgEscape(pi.maskedPan) + '</code>' + (pi.paymentSystem ? ' (' + tgEscape(pi.paymentSystem) + ')' : '') : '',
    pi.bank       ? '<b>Банк:</b> ' + tgEscape(pi.bank) : '',
    pi.paymentMethod ? '<b>Метод:</b> ' + tgEscape(pi.paymentMethod) : '',
  ].filter(Boolean).join('\n');

  const url = 'https://api.telegram.org/bot' + env.TELEGRAM_BOT_TOKEN + '/sendMessage';
  await Promise.all(chatIds.map(async chatId => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      });
      if (!res.ok) {
        // Never log the token.
        const errText = (await res.text()).slice(0, 300);
        console.error('[tg-notify] chat=' + chatId + ' status=' + res.status + ' body=' + errText);
      }
    } catch (e: any) {
      console.error('[tg-notify] chat=' + chatId + ' exception=' + (e?.message ?? 'unknown'));
    }
  }));
}

async function handleSuccess(invoice: InvoiceStatusResponse, env: Env): Promise<void> {
  // Log to Cloudflare Workers logs for the operator's wrangler tail / dashboard.
  console.log('[webhook][SUCCESS]', JSON.stringify({
    invoiceId:   invoice.invoiceId,
    amount:      invoice.amount,
    ccy:         invoice.ccy,
    reference:   invoice.reference,
    paymentInfo: invoice.paymentInfo,
  }));

  // Fan out Telegram notifications (best-effort, won't throw).
  await notifyTelegram(env, invoice);

  // TODO: deliver the PDF (Resend / R2 signed URL). See README "Monobank checkout".
}

function handleFailure(invoice: InvoiceStatusResponse): void {
  console.log('[webhook][FAILURE]', JSON.stringify({
    invoiceId:     invoice.invoiceId,
    status:        invoice.status,
    errCode:       invoice.errCode,
    failureReason: invoice.failureReason,
    reference:     invoice.reference,
  }));
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const xSign = request.headers.get('X-Sign') ?? request.headers.get('x-sign');
  if (!xSign) return bad(401, 'Missing X-Sign header');

  // Read the RAW bytes once — both for signature verification AND for JSON parsing.
  const bodyBytes = new Uint8Array(await request.arrayBuffer());

  let valid = false;
  try {
    const keyB64 = await fetchAndCacheKey(env);
    const pubKey = await importMonoPubKey(keyB64);
    valid = await verifyWebhook(pubKey, xSign, bodyBytes);

    // If verification fails, the public key may have rotated. Refresh once and retry.
    if (!valid && env.MONOBANK_PUBKEY) {
      const fresh = await getPubKey(env);
      const refreshed = await importMonoPubKey(fresh.key);
      valid = await verifyWebhook(refreshed, xSign, bodyBytes);
    }
  } catch (e: any) {
    console.error('[webhook] verify error:', e?.message);
    return bad(500, 'Verification error');
  }

  if (!valid) return bad(401, 'Invalid signature');

  let invoice: InvoiceStatusResponse;
  try {
    invoice = JSON.parse(new TextDecoder().decode(bodyBytes));
  } catch {
    return bad(400, 'Body is not valid JSON');
  }

  // Route by terminal status.
  if (invoice.status === 'success') {
    await handleSuccess(invoice, env);
  } else if (invoice.status === 'failure' || invoice.status === 'reversed') {
    handleFailure(invoice);
  } else {
    // intermediate statuses: created, processing, hold — log lightly.
    console.log('[webhook][intermediate]', invoice.invoiceId, invoice.status);
  }

  // Monobank only marks the webhook as delivered on HTTP 200.
  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
};
