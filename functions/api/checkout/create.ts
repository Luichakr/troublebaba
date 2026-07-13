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
  /** Product to buy: 'bundle' (all 10, default) or a single recipe slug. */
  product?: string;
  /** Recipe slug when product === 'single' (kept separate for clarity). */
  slug?: string;
}

/** Prices in UAH kopecks. Tweak via repo edit (no env-var needed). */
const BUNDLE_UAH_KOPECKS = 85000;   // 850 UAH ≈ $20 at rate 42.5 (edit if FX moves a lot)
const SINGLE_UAH_KOPECKS = 21000;   // 210 UAH ≈ $5  — one recipe (ladder entry point)
const BUNDLE_NAME        = 'Bento Cake by TROUBLEBABA — 10 рецептів (PDF)';

/** Resolve the order from the request: bundle (default) or a single recipe.
 *  A single-recipe order is only accepted when a non-empty slug is supplied;
 *  anything else falls back to the bundle so checkout can never break. */
function resolveProduct(body: RequestBody): { price: number; name: string; code: string; kind: 'bundle' | 'single' } {
  const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '') : '';
  const wantsSingle = (body.product === 'single' || body.product === slug) && slug.length > 0;
  if (wantsSingle) {
    return {
      price: SINGLE_UAH_KOPECKS,
      name:  `Bento Cake by TROUBLEBABA — рецепт «${slug}» (PDF)`,
      code:  `troublebaba-recipe-${slug}`,
      kind:  'single',
    };
  }
  return { price: BUNDLE_UAH_KOPECKS, name: BUNDLE_NAME, code: 'troublebaba-bento-cake-pdf', kind: 'bundle' };
}

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

  const item = resolveProduct(body);

  // Generate our own reference for matching the invoice to our internal record.
  // Prefix encodes the product kind so the webhook/delivery can route correctly.
  const reference = `tbb-${item.kind}-${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`;

  const payload: InvoiceCreateRequest = {
    amount: item.price,
    ccy: 980,                                    // UAH
    paymentType: 'debit',
    validity: 3600,                              // 1 hour to pay
    redirectUrl: redirectUrl.replace('{invoiceId}', 'pending'),  // Monobank also passes invoiceId in URL itself
    webHookUrl,
    merchantPaymInfo: {
      reference,
      destination: item.name,
      basketOrder: [
        {
          name: item.name,
          qty:  1,
          sum:  item.price,
          unit: 'шт.',
          code: item.code,
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
