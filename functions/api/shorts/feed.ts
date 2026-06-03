// GET /api/shorts/feed
//
// Public read endpoint that powers the on-site shorts strip.
// Returns the current "short of the day" (most-recently surfaced one) plus the
// previous N surfaced shorts so the feed always has something to render.
//
// Cached at the edge for 10 minutes — the daily cron rotates once per day so a
// 10-minute staleness window is harmless and dramatically reduces DB hits.

interface Env { DB?: D1Database }

interface Row {
  video_id:      string;
  title:         string;
  thumbnail_url: string | null;
  published_at:  number;
  posted_at:     number | null;
}

const CACHE_TTL = 600; // 10 min

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type':  'application/json',
      'Cache-Control': `public, max-age=${CACHE_TTL}, s-maxage=${CACHE_TTL}`,
    },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.DB) return json({ ok: true, current: null, recent: [] });

  try {
    const url = new URL(request.url);
    // Default 7 (1 hero + 6 thumbnails); archive page passes ?limit=50.
    const limit = Math.max(1, Math.min(60, parseInt(url.searchParams.get('limit') || '7', 10) || 7));
    const { results } = await env.DB.prepare(
      `SELECT video_id, title, thumbnail_url, published_at, posted_at
         FROM youtube_shorts
         WHERE is_short = 1 AND posted_at IS NOT NULL
         ORDER BY posted_at DESC
         LIMIT ?`,
    ).bind(limit).all<Row>();

    const rows = results ?? [];
    const map = (r: Row) => ({
      videoId:     r.video_id,
      title:       r.title,
      thumbnail:   r.thumbnail_url,
      publishedAt: r.published_at,
      postedAt:    r.posted_at,
      url:         `https://www.youtube.com/shorts/${r.video_id}`,
    });

    return json({
      ok:      true,
      current: rows[0] ? map(rows[0]) : null,
      recent:  rows.slice(1).map(map),
    });
  } catch (e: any) {
    console.error('[shorts/feed] error:', e?.message);
    return json({ ok: true, current: null, recent: [] }); // graceful: empty feed
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
