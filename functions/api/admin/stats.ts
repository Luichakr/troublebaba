// GET /api/admin/stats?days=7
// Returns aggregated stats from the D1 events table.
// Auth: Authorization: Bearer <ADMIN_PASS env var>.

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
    const [byType, bySource, byLang, byCountry, byDay, total, recent] = await Promise.all([
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
    ]);

    return json({
      ok: true,
      windowDays: days,
      total,
      byType:    byType.results,
      bySource:  bySource.results,
      byLang:    byLang.results,
      byCountry: byCountry.results,
      byDay:     byDay.results,
      recent:    recent.results,
    });
  } catch (e: any) {
    console.error('[admin/stats] error:', e?.message);
    return json({ ok: false, error: 'query failed' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
};
