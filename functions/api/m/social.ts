// Admin CRUD for manually-curated social posts (IG / TikTok / etc.).
// Bearer auth via ADMIN_PASS — same gate as /api/m/d.
//
//   GET    /api/m/social            → list all posts (newest first)
//   POST   /api/m/social  {url,title?,thumbnail?} → add one (detects platform,
//                                      tries TikTok oEmbed for cover/title)
//   DELETE /api/m/social?id=NN      → remove one

interface Env {
  DB: D1Database;
  ADMIN_PASS: string;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let m = 0;
  for (let i = 0; i < a.length; i++) m |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return m === 0;
}

function authed(request: Request, env: Env): boolean {
  if (!env.ADMIN_PASS) return false;
  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  return !!token && timingSafeEqual(token, env.ADMIN_PASS);
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function detectPlatform(url: string): string {
  const u = url.toLowerCase();
  if (u.includes('tiktok.com')) return 'tiktok';
  if (u.includes('instagram.com')) return 'instagram';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  return 'other';
}

// TikTok exposes a public oEmbed (no auth) with thumbnail + title.
async function tiktokOembed(url: string): Promise<{ thumbnail?: string; title?: string }> {
  try {
    const r = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TroublebabaBot/1.0)' },
      cf: { cacheTtl: 3600, cacheEverything: true },
    } as RequestInit);
    if (!r.ok) return {};
    const d = await r.json<{ thumbnail_url?: string; title?: string }>();
    return { thumbnail: d.thumbnail_url, title: d.title };
  } catch { return {}; }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!authed(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.DB)              return json({ ok: false, error: 'db not configured' }, 500);
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, platform, url, title, thumbnail_url, sort_ts FROM social_posts ORDER BY sort_ts DESC`,
    ).all();
    return json({ ok: true, posts: results ?? [] });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? 'query failed' }, 500);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!authed(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.DB)              return json({ ok: false, error: 'db not configured' }, 500);

  let body: { url?: string; title?: string; thumbnail?: string };
  try { body = await request.json(); } catch { return json({ ok: false, error: 'bad body' }, 400); }

  const url = String(body.url ?? '').trim();
  if (!/^https?:\/\//i.test(url)) return json({ ok: false, error: 'invalid_url' }, 400);

  const platform = detectPlatform(url);
  let title     = String(body.title ?? '').trim() || null;
  let thumbnail = String(body.thumbnail ?? '').trim() || null;

  // Auto-enrich TikTok via oEmbed when fields not supplied.
  if (platform === 'tiktok' && (!thumbnail || !title)) {
    const o = await tiktokOembed(url);
    thumbnail = thumbnail || o.thumbnail || null;
    title     = title     || o.title     || null;
  }

  const now = Date.now();
  try {
    await env.DB.prepare(
      `INSERT INTO social_posts (platform, url, title, thumbnail_url, ts, sort_ts)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(url) DO UPDATE SET
         title = COALESCE(excluded.title, social_posts.title),
         thumbnail_url = COALESCE(excluded.thumbnail_url, social_posts.thumbnail_url)`,
    ).bind(platform, url, title, thumbnail, now, now).run();
    return json({ ok: true, platform, title, thumbnail });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? 'insert failed' }, 500);
  }
};

export const onRequestDelete: PagesFunction<Env> = async ({ request, env }) => {
  if (!authed(request, env)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.DB)              return json({ ok: false, error: 'db not configured' }, 500);
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ ok: false, error: 'missing id' }, 400);
  try {
    await env.DB.prepare(`DELETE FROM social_posts WHERE id = ?`).bind(id).run();
    return json({ ok: true });
  } catch (e: any) {
    return json({ ok: false, error: e?.message ?? 'delete failed' }, 500);
  }
};
