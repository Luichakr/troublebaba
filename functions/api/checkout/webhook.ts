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

async function handleSuccess(invoice: InvoiceStatusResponse, env: Env): Promise<void> {
  // TODO: deliver the PDF.
  //
  // Minimal viable path (do this in a separate PR — keep webhook fast):
  //   1. Look up the customer email — either:
  //        a) returned by Monobank in the redirect/status, or
  //        b) carried via our own `reference` field (we generated `tbb-...`)
  //   2. POST to Resend / Sendgrid with a signed download link
  //   3. Mark the invoice as "delivered" in KV / D1 so duplicate webhooks no-op
  //
  // For now we just log. Owner can see the entry in `npx wrangler tail` or
  // Cloudflare dashboard → Workers & Pages → troublebaba → Logs.
  console.log('[webhook][SUCCESS]', JSON.stringify({
    invoiceId:   invoice.invoiceId,
    amount:      invoice.amount,
    ccy:         invoice.ccy,
    reference:   invoice.reference,
    paymentInfo: invoice.paymentInfo,
  }));
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
