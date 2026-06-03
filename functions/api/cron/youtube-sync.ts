// POST /api/cron/youtube-sync
//
// Daily job — fetched by GitHub Actions (or any cron service) with a Bearer
// secret. Pulls the channel's recent uploads from RSS, classifies new ones as
// shorts vs long-form, and rotates the "short of the day":
//
//   1. Newest known short that has never been surfaced → mark posted_at = now.
//   2. If every known short is already posted at least once → pick the one
//      whose posted_at is OLDEST and re-surface it (FIFO recycling), so the
//      site never goes empty just because the channel stopped publishing.
//
// The DB stores a 15-deep window (whatever the RSS exposes). Older shorts age
// out organically.

import { fetchFeed, isShort } from '../../_lib/youtube';

interface Env {
  DB?: D1Database;
  /** Channel ID — UC… 24 chars. Set as plain env in CF Pages settings. */
  YOUTUBE_CHANNEL_ID?: string;
  /** Bearer secret shared with the GitHub Actions workflow. */
  CRON_SECRET?: string;
}

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Auth — Bearer must match CRON_SECRET.
  if (!env.CRON_SECRET) return json({ ok: false, error: 'cron secret not configured' }, 500);
  const token = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!timingSafeEqual(token, env.CRON_SECRET)) return json({ ok: false, error: 'unauthorized' }, 401);

  if (!env.DB)                 return json({ ok: false, error: 'db not configured' }, 500);
  if (!env.YOUTUBE_CHANNEL_ID) return json({ ok: false, error: 'channel id not configured' }, 500);

  const now = Date.now();
  let added = 0, classified = 0;

  try {
    // 1) Pull feed (15 latest uploads).
    const entries = await fetchFeed(env.YOUTUBE_CHANNEL_ID);

    // 2) Which of these are NEW to us? Skip classification for known ones.
    const ids = entries.map(e => e.videoId);
    const placeholders = ids.map(() => '?').join(',');
    const known = ids.length
      ? await env.DB.prepare(
          `SELECT video_id FROM youtube_shorts WHERE video_id IN (${placeholders})`,
        ).bind(...ids).all<{ video_id: string }>()
      : { results: [] as { video_id: string }[] };
    const knownSet = new Set((known.results ?? []).map(r => r.video_id));

    // 3) For each new entry, classify (HTTP fetch per video) and upsert.
    //    Existing entries: refresh title in case it changed.
    for (const e of entries) {
      const isNew = !knownSet.has(e.videoId);
      let shortFlag = 0;
      if (isNew) {
        try {
          shortFlag = (await isShort(e.videoId)) ? 1 : 0;
          classified++;
        } catch {
          // If detection fails we still record the entry; future cron retries.
          shortFlag = 0;
        }
        added++;
      }

      await env.DB.prepare(
        `INSERT INTO youtube_shorts
           (video_id, title, thumbnail_url, published_at, is_short, first_seen_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(video_id) DO UPDATE SET
           title = excluded.title`,
      ).bind(e.videoId, e.title, e.thumbnail, e.publishedAt, shortFlag, now).run();
    }

    // 4) Rotate: pick the next short to surface today.
    //    Preference: never-surfaced (posted_at IS NULL), newest first.
    //    Fallback:    least-recently-surfaced.
    // We don't gate on is_short — in-Worker detection is unreliable (consent
    // wall on CF egress IPs). The channel is short-form; surface any upload.
    let pick = await env.DB.prepare(
      `SELECT video_id FROM youtube_shorts
         WHERE posted_at IS NULL
         ORDER BY published_at DESC LIMIT 1`,
    ).first<{ video_id: string }>();

    let recycled = false;
    if (!pick) {
      pick = await env.DB.prepare(
        `SELECT video_id FROM youtube_shorts
           ORDER BY posted_at ASC LIMIT 1`,
      ).first<{ video_id: string }>();
      recycled = !!pick;
    }

    if (pick) {
      await env.DB.prepare(
        `UPDATE youtube_shorts SET posted_at = ? WHERE video_id = ?`,
      ).bind(now, pick.video_id).run();
    }

    return json({
      ok:           true,
      feed_count:   entries.length,
      new_added:    added,
      classified,
      surfaced:     pick?.video_id ?? null,
      recycled,
    });
  } catch (e: any) {
    console.error('[cron/youtube-sync] error:', e?.message);
    return json({ ok: false, error: e?.message ?? 'unknown' }, 500);
  }
};

export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
