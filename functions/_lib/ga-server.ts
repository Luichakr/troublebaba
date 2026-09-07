// Server-side GA4 event via Measurement Protocol.
// Used by LS + Paddle webhooks so `purchase` fires even when the buyer
// never lands on our /thank-you (e.g. LS keeps them on their own success
// screen, or Apple Mail preview kills the redirect).
//
// Requires two env vars in Cloudflare Pages:
//   GA_MEASUREMENT_ID  — e.g. G-6JQ23T5RWN
//   GA_API_SECRET      — from GA Admin → Data Streams → your stream → Measurement Protocol → API secrets
//
// If either is missing we no-op and log — never break the webhook.

export interface GaServerEnv {
  GA_MEASUREMENT_ID?: string;
  GA_API_SECRET?: string;
}

interface PurchaseArgs {
  /** Unique transaction id — LS order id or Paddle txn id. */
  transactionId: string;
  /** Buyer email — used to derive a stable client_id (hashed). */
  email?: string | null;
  /** Amount in major units (e.g. 20.00, not cents). */
  value: number;
  /** ISO currency, e.g. UAH / USD / EUR / PLN. */
  currency: string;
  /** Locale of the delivered PDF (uk / ru / pl / en). */
  lang?: string;
  /** LS store id when known — lets us slice revenue by market. */
  storeId?: string;
  /** Payment processor for attribution. */
  processor: 'ls' | 'paddle';
  /** Which CTA button the buyer clicked (hero / price / final-cta / sticky-mobile / header / bonus / …). */
  buyButton?: string;
}

/**
 * Stable per-buyer client_id — GA4 requires one; using the transaction id
 * makes every purchase attributable to a "user" whose sole activity is that
 * one purchase (fine for revenue reports; not for cross-visit analysis).
 * Using a real hashed email would also work — we keep it simple.
 */
function clientIdFor(txnId: string): string {
  return `srv.${txnId}.1`;
}

/**
 * Measurement ID is public — it ships in the page HTML on every request — so
 * we hardcode it as the fallback rather than depend on an env var that can go
 * missing. It silently did: `[vars]` in wrangler.toml is re-applied on every
 * deploy and evicted the same-named secret, so every purchase was dropped and
 * GA reported 0 revenue. env still wins if set, for staging overrides.
 * The API secret has no fallback — that one is genuinely secret.
 */
const GA_MEASUREMENT_ID_FALLBACK = 'G-6JQ23T5RWN';

export async function sendPurchase(env: GaServerEnv, args: PurchaseArgs): Promise<void> {
  const id = env.GA_MEASUREMENT_ID || GA_MEASUREMENT_ID_FALLBACK;
  const secret = env.GA_API_SECRET;
  if (!secret) {
    console.warn('[ga-server] skipped purchase — GA_API_SECRET missing', { txn: args.transactionId });
    return;
  }

  const payload = {
    client_id: clientIdFor(args.transactionId),
    non_personalized_ads: false,
    events: [{
      name: 'purchase',
      params: {
        transaction_id: args.transactionId,
        value: Number(args.value.toFixed(2)),
        currency: args.currency,
        payment_processor: args.processor,
        page_lang: args.lang || 'uk',
        store_id: args.storeId || '',
        buy_button: args.buyButton || 'unknown',
        items: [{
          item_id: 'bento-cake-pdf',
          item_name: 'Bento Cake by TROUBLEBABA — 10 recipes',
          item_category: 'Digital / eBook',
          item_variant: args.lang || 'uk',
          price: Number(args.value.toFixed(2)),
          quantity: 1,
        }],
      },
    }],
  };

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(id)}&api_secret=${encodeURIComponent(secret)}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    // GA Measurement Protocol returns 204 on success and does NOT surface
    // validation errors here — for debugging, POST to /debug/mp/collect
    // (same body) manually from a dev shell.
    if (res.status >= 400) {
      console.warn('[ga-server] purchase send status', res.status, { txn: args.transactionId });
    }
  } catch (e: any) {
    console.warn('[ga-server] purchase fetch failed', { txn: args.transactionId, error: e?.message });
  }
}
