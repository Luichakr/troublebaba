// POST /api/track
// Lightweight event logger writing to Cloudflare D1.
// Public endpoint (no auth) — anyone can write events. That's OK for our use
// because the events are low-value (click counters), and the read side
// (/api/admin/stats) requires the admin password.
//
// Expected body shape:
//   { type: 'click_buy', source: 'hero', lang: 'ru', path: '/ru/', ref: 'https://...' }

interface Env {
  /** D1 binding configured in Cloudflare Pages → Settings → Functions → Bindings. */
  DB: D1Database;
}

interface TrackBody {
  type:   string;
  source?: string;
  lang?:   string;
  path?:   string;
  ref?:    string;
  extra?:  unknown;
}

const ALLOWED_TYPES = new Set([
  'click_buy', 'invoice_create', 'invoice_success', 'invoice_failure',
  'lead_submit', 'language_switch', 'faq_open',
  'social_card_click', 'social_profile_click',
  'pageview',
]);

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) {
    // Binding not yet configured — return 200 so the client doesn't choke,
    // but log to console for the operator. The events are non-critical.
    console.warn('[track] DB binding missing — event dropped');
    return new Response(JSON.stringify({ ok: false, error: 'DB not configured' }), {
      status: 200,                  // success-shaped to keep the client happy
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: TrackBody;
  try {
    body = await request.json<TrackBody>();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'bad body' }), { status: 400 });
  }

  if (!body?.type || !ALLOWED_TYPES.has(body.type)) {
    return new Response(JSON.stringify({ ok: false, error: 'bad type' }), { status: 400 });
  }

  const cf = (request as Request & { cf?: { country?: string } }).cf ?? {};
  const userAgent = (request.headers.get('user-agent') || '').slice(0, 240);

  try {
    await env.DB.prepare(
      `INSERT INTO events (ts, type, source, page_lang, page_path, user_agent, ip_country, ref, extra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      Date.now(),
      body.type,
      String(body.source ?? '').slice(0, 64) || null,
      String(body.lang   ?? '').slice(0, 4)  || null,
      String(body.path   ?? '').slice(0, 240) || null,
      userAgent || null,
      String(cf.country ?? '').slice(0, 2)   || null,
      String(body.ref    ?? '').slice(0, 240) || null,
      body.extra ? JSON.stringify(body.extra).slice(0, 1000) : null,
    ).run();
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e: any) {
    console.error('[track] insert error:', e?.message);
    return new Response(JSON.stringify({ ok: false, error: 'insert failed' }), { status: 500 });
  }
};

// Block other methods.
export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
};
