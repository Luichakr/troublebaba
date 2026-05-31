// GET /api/checkout/status?invoiceId=...
// Proxies to Monobank's status endpoint so the merchant token never reaches the browser.
// Used by /thank-you to verify the payment server-side before showing success.

import { getInvoiceStatus, bad, json } from '../../_lib/monobank';
import type { Env } from '../../_lib/monobank';

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const invoiceId = new URL(request.url).searchParams.get('invoiceId');
  if (!invoiceId || !/^[A-Za-z0-9_-]{6,64}$/.test(invoiceId)) {
    return bad(400, 'invoiceId is required and must look like a Monobank invoice ID.');
  }

  try {
    const status = await getInvoiceStatus(env, invoiceId);
    // Return only what the client needs (no token leaks, no PII beyond what the user already saw).
    return json({
      ok: true,
      invoiceId:   status.invoiceId,
      status:      status.status,
      amount:      status.amount,
      ccy:         status.ccy,
      finalAmount: status.finalAmount,
      reference:   status.reference,
      modifiedDate: status.modifiedDate,
      failureReason: status.failureReason ?? null,
    });
  } catch (e: any) {
    console.error('[checkout/status] error:', e?.message);
    return bad(502, 'Не удалось проверить статус оплаты.');
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
};
