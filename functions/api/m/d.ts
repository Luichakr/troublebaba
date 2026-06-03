// Internal metrics endpoint. Bearer auth required (ADMIN_PASS env).

interface Env {
  DB: D1Database;
  /** Plaintext password for the stats dashboard (set as a secret in CF Pages Settings). */
  ADMIN_PASS: string;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function checkAuth(request: Request, env: Env): boolean {
  if (!env.ADMIN_PASS) return false;
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return false;
  return timingSafeEqual(token, env.ADMIN_PASS);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!checkAuth(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.DB)                  return json({ ok: false, error: 'db not configured' }, 500);

  const url = new URL(request.url);
  const days = Math.max(1, Math.min(90, parseInt(url.searchParams.get('days') || '30', 10) || 30));
  const since = Date.now() - days * 86400 * 1000;

  try {
    const [byType, bySource, byLang, byCountry, byDay, total, recent, visitsByLang, visitsTotal] = await Promise.all([
      env.DB.prepare(
        `SELECT type, COUNT(*) AS n FROM events WHERE ts >= ? GROUP BY type ORDER BY n DESC`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT source, COUNT(*) AS n FROM events
         WHERE ts >= ? AND type = 'click_buy' GROUP BY source ORDER BY n DESC`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT page_lang, COUNT(*) AS n FROM events
         WHERE ts >= ? AND type = 'click_buy' GROUP BY page_lang ORDER BY n DESC`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT ip_country, COUNT(*) AS n FROM events
         WHERE ts >= ? AND type = 'click_buy' AND ip_country IS NOT NULL
         GROUP BY ip_country ORDER BY n DESC LIMIT 20`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT date(ts/1000, 'unixepoch') AS day, COUNT(*) AS n FROM events
         WHERE ts >= ? AND type = 'click_buy' GROUP BY day ORDER BY day`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT
           (SELECT COUNT(*) FROM events WHERE type='click_buy') AS total_clicks,
           (SELECT COUNT(*) FROM events WHERE type='click_buy' AND ts >= ?) AS clicks_period,
           (SELECT COUNT(*) FROM events WHERE type='invoice_success') AS total_success`,
      ).bind(since).first(),
      env.DB.prepare(
        `SELECT ts, type, source, page_lang, ip_country, page_path
         FROM events ORDER BY ts DESC LIMIT 100`,
      ).all(),
      env.DB.prepare(
        `SELECT page_lang, COUNT(*) AS n FROM events
         WHERE ts >= ? AND type = 'pageview' GROUP BY page_lang ORDER BY n DESC`,
      ).bind(since).all(),
      env.DB.prepare(
        `SELECT
           (SELECT COUNT(*) FROM events WHERE type='pageview') AS visits_total,
           (SELECT COUNT(*) FROM events WHERE type='pageview' AND ts >= ?) AS visits_period`,
      ).bind(since).first(),
    ]);

    // Waitlist — wrapped so a missing table (before migration 0003 runs) doesn't 500.
    let waitlistTotal = 0;
    let waitlistByLang: unknown[] = [];
    let waitlistRecent: unknown[] = [];
    try {
      const [wTotal, wByLang, wRecent] = await Promise.all([
        env.DB.prepare(`SELECT COUNT(*) AS n FROM waitlist`).first<{ n: number }>(),
        env.DB.prepare(`SELECT lang, COUNT(*) AS n FROM waitlist GROUP BY lang ORDER BY n DESC`).all(),
        env.DB.prepare(`SELECT email, lang, ip_country, ts FROM waitlist ORDER BY ts DESC LIMIT 50`).all(),
      ]);
      waitlistTotal  = wTotal?.n ?? 0;
      waitlistByLang = wByLang.results ?? [];
      waitlistRecent = wRecent.results ?? [];
    } catch { /* waitlist table not created yet */ }

    // Free-recipe leads — wrapped (table from migration 0005). Separate funnel
    // from waitlist: these users asked for content, not just a launch reminder.
    let freeRecipeTotal = 0;
    let freeRecipeByLang: unknown[] = [];
    let freeRecipeRecent: unknown[] = [];
    try {
      const [fTotal, fByLang, fRecent] = await Promise.all([
        env.DB.prepare(`SELECT COUNT(*) AS n FROM free_recipe_leads`).first<{ n: number }>(),
        env.DB.prepare(`SELECT lang, COUNT(*) AS n FROM free_recipe_leads GROUP BY lang ORDER BY n DESC`).all(),
        env.DB.prepare(`SELECT email, lang, ip_country, ts FROM free_recipe_leads ORDER BY ts DESC LIMIT 50`).all(),
      ]);
      freeRecipeTotal  = fTotal?.n ?? 0;
      freeRecipeByLang = fByLang.results ?? [];
      freeRecipeRecent = fRecent.results ?? [];
    } catch { /* free_recipe_leads table not created yet */ }

    // YouTube shorts — wrapped (table from migration 0004).
    let shortsTotal = 0;
    let shortsPosted = 0;
    let shortsLastSync: number | null = null;
    try {
      const sTotals = await env.DB.prepare(
        `SELECT
           (SELECT COUNT(*) FROM youtube_shorts WHERE is_short=1) AS total,
           (SELECT COUNT(*) FROM youtube_shorts WHERE is_short=1 AND posted_at IS NOT NULL) AS posted,
           (SELECT MAX(first_seen_at) FROM youtube_shorts) AS last_sync`,
      ).first<{ total: number; posted: number; last_sync: number | null }>();
      shortsTotal    = sTotals?.total    ?? 0;
      shortsPosted   = sTotals?.posted   ?? 0;
      shortsLastSync = sTotals?.last_sync ?? null;
    } catch { /* youtube_shorts table not created yet */ }

    return json({
      ok: true,
      windowDays: days,
      total,
      visitsTotal,
      byType:       byType.results,
      bySource:     bySource.results,
      byLang:       byLang.results,
      byCountry:    byCountry.results,
      byDay:        byDay.results,
      recent:       recent.results,
      visitsByLang: visitsByLang.results,
      waitlistTotal,
      waitlistByLang,
      waitlistRecent,
      freeRecipeTotal,
      freeRecipeByLang,
      freeRecipeRecent,
      shortsTotal,
      shortsPosted,
      shortsLastSync,
    });
  } catch (e: any) {
    console.error('[admin/stats] error:', e?.message);
    return json({ ok: false, error: 'query failed' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
};
