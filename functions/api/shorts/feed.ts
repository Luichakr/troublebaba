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
    // ?all=1 → every known short (archive view). Default → only surfaced ones
    // (homepage "short of the day" rotation), newest-surfaced first.
    const all = url.searchParams.get('all') === '1';
    // NB: we intentionally do NOT gate on is_short. The in-Worker shorts
    // detector is unreliable (YouTube serves the consent wall to CF egress
    // IPs, so the canonical /shorts/ rewrite often isn't visible). The channel
    // is short-form anyway and every thumbnail renders inside a 9:16 frame,
    // so we surface all known uploads.
    const { results } = all
      ? await env.DB.prepare(
          `SELECT video_id, title, thumbnail_url, published_at, posted_at
             FROM youtube_shorts
             ORDER BY published_at DESC
             LIMIT ?`,
        ).bind(limit).all<Row>()
      : await env.DB.prepare(
          `SELECT video_id, title, thumbnail_url, published_at, posted_at
             FROM youtube_shorts
             WHERE posted_at IS NOT NULL
             ORDER BY posted_at DESC
             LIMIT ?`,
        ).bind(limit).all<Row>();

    const rows = results ?? [];
    const map = (r: Row) => ({
      platform:    'youtube',
      videoId:     r.video_id,
      title:       r.title,
      thumbnail:   r.thumbnail_url,
      publishedAt: r.published_at,
      postedAt:    r.posted_at,
      url:         `https://www.youtube.com/shorts/${r.video_id}`,
    });

    let items = rows.map(map);

    // Archive view (all=1) also merges manually-curated IG/TikTok posts,
    // interleaved with YouTube by date. Homepage rotation (default) stays
    // YouTube-only so the "short of the day" logic is unambiguous.
    if (all) {
      try {
        const social = await env.DB.prepare(
          `SELECT platform, url, title, thumbnail_url, sort_ts FROM social_posts
             ORDER BY sort_ts DESC LIMIT ?`,
        ).bind(limit).all<{ platform: string; url: string; title: string | null; thumbnail_url: string | null; sort_ts: number }>();
        const socialItems = (social.results ?? []).map(s => ({
          platform:    s.platform,
          videoId:     null as string | null,
          title:       s.title ?? '',
          thumbnail:   s.thumbnail_url,
          publishedAt: s.sort_ts,
          postedAt:    s.sort_ts,
          url:         s.url,
        }));
        items = [...items, ...socialItems]
          .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0))
          .slice(0, limit);
      } catch { /* social_posts table not created yet — YouTube-only */ }
    }

    return json({
      ok:      true,
      current: items[0] ?? null,
      recent:  items.slice(1),
    });
  } catch (e: any) {
    console.error('[shorts/feed] error:', e?.message);
    return json({ ok: true, current: null, recent: [] }); // graceful: empty feed
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'GET' } });
