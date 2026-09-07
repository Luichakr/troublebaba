// GET /api/admin/stats?pass=<ADMIN_PASS>
// Password-gated read-only aggregation over events + bot_orders.

interface Env {
  DB: D1Database;
  ADMIN_PASS?: string;
}

const RANGES = {
  '24h': 24 * 60 * 60 * 1000,
  '7d':  7  * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const pass = url.searchParams.get('pass') || request.headers.get('x-admin-pass') || '';
  if (!env.ADMIN_PASS || pass !== env.ADMIN_PASS) {
    return json({ ok: false, error: 'unauthorized' }, 401);
  }
  if (!env.DB) return json({ ok: false, error: 'DB not configured' }, 500);

  const now = Date.now();
  const rangeKey = (url.searchParams.get('range') as keyof typeof RANGES) || '7d';
  const windowMs = RANGES[rangeKey] ?? RANGES['7d'];
  const since = now - windowMs;

  const [evByType, buyBySource, funnel, byLang, byCountry, orders, ordersTotals, recentOrders] = await Promise.all([
    env.DB.prepare(
      `SELECT type, COUNT(*) n FROM events WHERE ts >= ? GROUP BY type ORDER BY n DESC`
    ).bind(since).all(),
    env.DB.prepare(
      `SELECT COALESCE(source,'(none)') source, COUNT(*) n FROM events
       WHERE ts >= ? AND type='click_buy' GROUP BY source ORDER BY n DESC`
    ).bind(since).all(),
    env.DB.prepare(
      `SELECT type, COUNT(*) n FROM events
       WHERE ts >= ? AND type IN ('click_buy','invoice_create','invoice_success','invoice_failure')
       GROUP BY type`
    ).bind(since).all(),
    env.DB.prepare(
      `SELECT COALESCE(page_lang,'?') lang, COUNT(*) n FROM events
       WHERE ts >= ? AND type='pageview' GROUP BY lang ORDER BY n DESC`
    ).bind(since).all(),
    env.DB.prepare(
      `SELECT COALESCE(ip_country,'?') country, COUNT(*) n FROM events
       WHERE ts >= ? AND type='pageview' GROUP BY country ORDER BY n DESC LIMIT 15`
    ).bind(since).all(),
    env.DB.prepare(
      `SELECT status, currency, COUNT(*) n, COALESCE(SUM(amount),0) sum_minor
       FROM bot_orders WHERE created_ts >= ? GROUP BY status, currency ORDER BY n DESC`
    ).bind(Math.floor(since / 1000)).all(),
    env.DB.prepare(
      `SELECT currency, COUNT(*) n, COALESCE(SUM(amount),0) sum_minor
       FROM bot_orders WHERE status='paid' AND created_ts >= ? GROUP BY currency`
    ).bind(Math.floor(since / 1000)).all(),
    env.DB.prepare(
      `SELECT order_id, telegram_id, status, payment_method, amount, currency, created_ts, paid_ts
       FROM bot_orders ORDER BY created_ts DESC LIMIT 20`
    ).all(),
  ]);

  return json({
    ok: true,
    now,
    range: rangeKey,
    windowMs,
    events: {
      byType: evByType.results ?? [],
      clickBuyBySource: buyBySource.results ?? [],
      funnel: funnel.results ?? [],
      byLang: byLang.results ?? [],
      byCountry: byCountry.results ?? [],
    },
    botOrders: {
      byStatus: orders.results ?? [],
      paidTotals: ordersTotals.results ?? [],
      recent: recentOrders.results ?? [],
    },
  });
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
