// GET /api/bonus/count — how many of the first-N launch-bonus slots remain.
// Backing store: single R2 object `bonus/count` holding the integer count of
// successful transactions (as a UTF-8 string). Read here, incremented from
// the Paddle webhook.
//
// ponytail: no dedupe transaction here — that's the webhook's job.

interface Env { PDF_BUCKET: R2Bucket }

const TOTAL = 50;                 // keep in sync with SITE.bonusForFirst.total
const COUNT_KEY = 'bonus/count';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  let sold = 0;
  try {
    const obj = await env.PDF_BUCKET.get(COUNT_KEY);
    if (obj) sold = parseInt(await obj.text(), 10) || 0;
  } catch { /* fresh install → 0 */ }
  const remaining = Math.max(0, TOTAL - sold);
  return new Response(JSON.stringify({ total: TOTAL, sold, remaining }), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=30',   // 30s edge-friendly cache
    },
  });
};
