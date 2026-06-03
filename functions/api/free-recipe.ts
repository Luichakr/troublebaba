// POST /api/free-recipe
//
// Captures an email for the free bento recipe lead magnet. Modeled on
// /api/waitlist but separate table — these leads are warmer (asked for
// content, not just a launch reminder) and worth a different follow-up.
//
// Returns 200 with { ok: true, stored } even when DB is missing, so the form
// UX never breaks. Real failures (invalid email) return 400.

interface Env { DB?: D1Database }

interface Body { email?: string; lang?: string; source?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body;
  try { body = await request.json<Body>(); }
  catch { return json({ ok: false, error: 'bad body' }, 400); }

  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 254);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'invalid_email' }, 400);

  if (!env.DB) {
    console.warn('[free-recipe] DB binding missing — email dropped:',
      email.replace(/(.{2}).*(@.*)/, '$1***$2'));
    return json({ ok: true, stored: false });
  }

  const lang   = String(body.lang ?? '').slice(0, 4) || null;
  const source = String(body.source ?? '').slice(0, 64) || 'free_recipe_page';
  const cf = (request as Request & { cf?: { country?: string } }).cf ?? {};

  try {
    await env.DB.prepare(
      `INSERT INTO free_recipe_leads (email, lang, source, ip_country, ts)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(email) DO UPDATE SET
         lang   = excluded.lang,
         source = excluded.source`,
    ).bind(
      email,
      lang,
      source,
      String(cf.country ?? '').slice(0, 2) || null,
      Date.now(),
    ).run();
    return json({ ok: true, stored: true });
  } catch (e: any) {
    console.error('[free-recipe] insert error:', e?.message);
    return json({ ok: false, error: 'insert_failed' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
