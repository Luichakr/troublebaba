// POST /api/checkout/create
// Creates a Monobank invoice for the Bento Cake PDF and returns { pageUrl, invoiceId }.
// Client redirects window.location to pageUrl.

import { createInvoice, bad, json, siteOrigin } from '../../_lib/monobank';
import type { Env, InvoiceCreateRequest } from '../../_lib/monobank';

interface RequestBody {
  /** Optional language to preserve via redirectUrl. */
  lang?: 'uk' | 'ru' | 'pl' | 'en';
  /** Optional email — passed to Monobank as customerEmails for receipt. */
  email?: string;
}

/** Bento Cake price in UAH kopecks. Tweak via repo edit (no env-var needed). */
const PRICE_UAH_KOPECKS = 85000;   // 850 UAH ≈ $20 at rate 42.5 (edit if FX moves a lot)
const PRODUCT_NAME      = 'Bento Cake by TROUBLEBABA — 10 рецептів (PDF)';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  let body: RequestBody = {};
  try {
    if (request.headers.get('content-type')?.includes('application/json')) {
      body = await request.json<RequestBody>();
    }
  } catch { /* tolerate empty body */ }

  const lang = (['uk', 'ru', 'pl', 'en'] as const).includes(body.lang as any) ? body.lang! : 'uk';
  const origin = siteOrigin(request, env);

  // Build language-aware redirect URLs.
  // /thank-you and /payment-failed are static Astro routes that read ?invoiceId server-side.
  const redirectUrl = lang === 'uk'
    ? `${origin}/thank-you?invoiceId={invoiceId}`
    : `${origin}/${lang}/thank-you?invoiceId={invoiceId}`;
  const webHookUrl = `${origin}/api/checkout/webhook`;

  // Generate our own reference for matching the invoice to our internal record.
  const reference = `tbb-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`;

  const payload: InvoiceCreateRequest = {
    amount: PRICE_UAH_KOPECKS,
    ccy: 980,                                    // UAH
    paymentType: 'debit',
    validity: 3600,                              // 1 hour to pay
    redirectUrl: redirectUrl.replace('{invoiceId}', 'pending'),  // Monobank also passes invoiceId in URL itself
    webHookUrl,
    merchantPaymInfo: {
      reference,
      destination: PRODUCT_NAME,
      basketOrder: [
        {
          name: PRODUCT_NAME,
          qty:  1,
          sum:  PRICE_UAH_KOPECKS,
          unit: 'шт.',
          code: 'troublebaba-bento-cake-pdf',
        },
      ],
      ...(body.email ? { customerEmails: [body.email] } : {}),
    },
  };

  try {
    const invoice = await createInvoice(env, payload);
    return json({
      ok: true,
      invoiceId: invoice.invoiceId,
      pageUrl:   invoice.pageUrl,
      reference,
    });
  } catch (e: any) {
    // Don't leak the merchant token or full Monobank error to the client.
    console.error('[checkout/create] error:', e?.message);
    return bad(502, 'Не удалось создать оплату. Попробуйте ещё раз через минуту.', {
      detail: e?.body && typeof e.body === 'object' ? (e.body as any).errText ?? null : null,
    });
  }
};

// Reject other methods explicitly.
export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
};
