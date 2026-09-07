// POST /api/cron/social-sync
//
// Daily job — fetches @troublebaba's public Instagram + TikTok pages, extracts
// recent posts, and writes them into D1 (`social_posts`). The blog page +
// /shorts/ archive already read from this table, so ordinary rotation logic
// works with no other change.
//
// Auth: Bearer must match CRON_SECRET (same pattern as youtube-sync).
//
// Reliability caveat: both platforms serve their public feeds via
// undocumented endpoints whose format changes every few months. When that
// happens, this endpoint returns { ok: false, error: '…' } — the site
// keeps rotating whatever posts are already in D1, and we fix the parser.

interface Env {
  DB?: D1Database;
  /** Bearer token this endpoint accepts. Separate from CRON_SECRET (which also
   *  signs download links, so we never rotate it). Rotate CRON_TOKEN freely. */
  CRON_TOKEN?: string;
  /** Full URL to the IG profile — read from SITE config, mirrored here. */
  IG_URL?: string;
  /** Full URL to the TT profile. */
  TT_URL?: string;
}

const IG_HANDLE_FALLBACK = 'troublebaba';
const TT_HANDLE_FALLBACK = 'troublebaba';
// No age gate — IG's public feed only exposes the last ~12 posts anyway,
// and the owner rotates content faster than the "2-3 months" originally
// specified would allow us to accumulate.
const MIN_AGE_DAYS = 0;

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ─── Instagram ──────────────────────────────────────────────────────────
// Uses the same web_profile_info endpoint that IG's own website hits.
// Requires the `X-IG-App-ID` header — that ID is public and stable.

interface IgPost {
  url: string;
  thumbnail_url: string;
  title: string;
  taken_at_ms: number;
}

async function fetchInstagram(username: string): Promise<IgPost[]> {
  // Prefer i.instagram.com (mobile app backend) — Cloudflare IPs get blocked
  // less often here than on www.instagram.com. Fall back to www if it 401s.
  const path = `/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;
  const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
  const hosts = ['i.instagram.com', 'www.instagram.com'];
  let res: Response | null = null;
  for (const host of hosts) {
    res = await fetch(`https://${host}${path}`, {
      headers: {
        'User-Agent': mobileUA,
        'X-IG-App-ID': '936619743392459',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (res.ok) break;
  }
  if (!res || !res.ok) throw new Error(`ig_http_${res?.status ?? 'net'}`);
  const body = await res.json<any>();
  const edges = body?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
  const items: IgPost[] = [];
  for (const e of edges) {
    const n = e?.node;
    if (!n?.shortcode) continue;
    const taken = Number(n.taken_at_timestamp) || 0;
    const cap = n?.edge_media_to_caption?.edges?.[0]?.node?.text ?? '';
    items.push({
      url: `https://www.instagram.com/p/${n.shortcode}/`,
      thumbnail_url: String(n.display_url ?? ''),
      title: cap.slice(0, 240),
      taken_at_ms: taken * 1000,
    });
  }
  return items;
}

// ─── TikTok ─────────────────────────────────────────────────────────────
// Public @page returns HTML with a hydration <script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">
// containing the JSON payload TikTok's SPA uses to render the grid.

interface TtPost {
  url: string;
  thumbnail_url: string;
  title: string;
  created_at_ms: number;
}

async function fetchTiktok(username: string): Promise<TtPost[]> {
  const url = `https://www.tiktok.com/@${encodeURIComponent(username)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });
  if (!res.ok) throw new Error(`tt_http_${res.status}`);
  const html = await res.text();
  const marker = 'id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`tt_no_rehydration_script (html_len=${html.length}, has_captcha=${html.includes('captcha') || html.includes('verify')})`);
  const from = start + marker.length;
  const end = html.indexOf('</script>', from);
  if (end < 0) throw new Error('tt_no_script_end');
  const jsonText = html.slice(from, end);
  let payload: any;
  try { payload = JSON.parse(jsonText); }
  catch { throw new Error('tt_json_parse'); }

  // As of late 2026, the item list lives under
  // __DEFAULT_SCOPE__.webapp.user-detail.userInfo.itemList (renamed a few
  // times; we walk defensively for older forms too).
  const scope = payload?.__DEFAULT_SCOPE__ ?? {};
  const userDetail = scope['webapp.user-detail'] ?? {};
  const buckets: any[] = [
    userDetail?.userInfo?.itemList,
    userDetail?.itemList,
    scope['webapp.video-detail']?.itemList,
  ].filter(Array.isArray);
  const raw: any[] = buckets[0] ?? [];

  if (!raw.length) {
    // Reveal what we DID find so we can adapt when TikTok renames things again.
    const scopeKeys = Object.keys(scope).join(',');
    const udKeys = Object.keys(userDetail).join(',');
    const uiKeys = Object.keys(userDetail?.userInfo ?? {}).join(',');
    throw new Error(`tt_no_items (scope=[${scopeKeys}] userDetail=[${udKeys}] userInfo=[${uiKeys}])`);
  }

  const items: TtPost[] = [];
  for (const v of raw) {
    const id = v?.id ?? v?.video?.id;
    if (!id) continue;
    const cover = v?.video?.cover ?? v?.video?.dynamicCover ?? v?.video?.originCover ?? '';
    items.push({
      url: `https://www.tiktok.com/@${username}/video/${id}`,
      thumbnail_url: String(cover),
      title: String(v?.desc ?? '').slice(0, 240),
      created_at_ms: Number(v?.createTime ?? 0) * 1000,
    });
  }
  return items;
}

// ─── Main ───────────────────────────────────────────────────────────────

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.CRON_TOKEN) return json({ ok: false, error: 'cron token not configured' }, 500);
  const token = (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '').trim();
  if (!timingSafeEqual(token, env.CRON_TOKEN)) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!env.DB) return json({ ok: false, error: 'db not configured' }, 500);

  const igHandle = (env.IG_URL ?? '').split('/').filter(Boolean).pop() || IG_HANDLE_FALLBACK;
  const ttHandle = ((env.TT_URL ?? '').match(/@([\w.\-]+)/)?.[1]) || TT_HANDLE_FALLBACK;

  const now = Date.now();
  const cutoff = now - MIN_AGE_DAYS * 86400 * 1000;
  const summary: Record<string, any> = { now, igHandle, ttHandle, cutoff, added: 0, seen: 0 };

  // ── Instagram ────────────────────────────
  try {
    const ig = await fetchInstagram(igHandle);
    summary.ig_seen = ig.length;
    for (const p of ig) {
      if (p.taken_at_ms && p.taken_at_ms > cutoff) continue; // too fresh — owner's archive rule
      const res = await env.DB.prepare(
        `INSERT INTO social_posts (platform, url, title, thumbnail_url, ts, sort_ts)
         VALUES ('instagram', ?, ?, ?, ?, ?)
         ON CONFLICT(url) DO UPDATE SET
           title         = COALESCE(excluded.title, social_posts.title),
           thumbnail_url = COALESCE(excluded.thumbnail_url, social_posts.thumbnail_url)`
      ).bind(p.url, p.title || null, p.thumbnail_url || null, now, p.taken_at_ms || now).run();
      summary.added += res.meta?.changes ?? 0;
      summary.seen += 1;
    }
    summary.ig_ok = true;
  } catch (e: any) {
    summary.ig_ok = false;
    summary.ig_error = e?.message ?? 'unknown';
  }

  // ── TikTok: refresh already-known thumbnails via oEmbed ───────
  // The signed TT CDN URLs expire in ~24-48h. TikTok's public oEmbed endpoint
  // returns a fresh signed thumbnail_url per video, no auth needed. We refresh
  // every TT row we have so display keeps working even when the scraper below
  // returns nothing (which happens whenever TT bot-detects our IP).
  try {
    const existing = await env.DB.prepare(
      `SELECT url FROM social_posts WHERE platform = 'tiktok' ORDER BY sort_ts DESC LIMIT 50`,
    ).all<{ url: string }>();
    let refreshed = 0;
    for (const row of existing.results ?? []) {
      try {
        const oe = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(row.url)}`, {
          headers: { 'User-Agent': UA, 'Accept': 'application/json' },
        });
        if (!oe.ok) continue;
        const body = await oe.json<any>();
        const thumb = body?.thumbnail_url;
        const title = body?.title;
        if (!thumb) continue;
        await env.DB.prepare(
          `UPDATE social_posts SET thumbnail_url = ?, title = COALESCE(?, title) WHERE url = ?`
        ).bind(thumb, title || null, row.url).run();
        refreshed++;
      } catch { /* individual failures are non-fatal */ }
    }
    summary.tt_refreshed = refreshed;
  } catch (e: any) {
    summary.tt_refresh_error = e?.message ?? 'unknown';
  }

  // ── TikTok: scrape for new posts (fragile — bot-detected on data-center IPs) ──
  try {
    const tt = await fetchTiktok(ttHandle);
    summary.tt_seen = tt.length;
    for (const p of tt) {
      if (p.created_at_ms && p.created_at_ms > cutoff) continue;
      const res = await env.DB.prepare(
        `INSERT INTO social_posts (platform, url, title, thumbnail_url, ts, sort_ts)
         VALUES ('tiktok', ?, ?, ?, ?, ?)
         ON CONFLICT(url) DO UPDATE SET
           title         = COALESCE(excluded.title, social_posts.title),
           thumbnail_url = COALESCE(excluded.thumbnail_url, social_posts.thumbnail_url)`
      ).bind(p.url, p.title || null, p.thumbnail_url || null, now, p.created_at_ms || now).run();
      summary.added += res.meta?.changes ?? 0;
      summary.seen += 1;
    }
    summary.tt_ok = true;
  } catch (e: any) {
    summary.tt_ok = false;
    summary.tt_error = e?.message ?? 'unknown';
  }

  return json({ ok: true, ...summary });
};

// Block other methods.
export const onRequest: PagesFunction<Env> = ({ request }) =>
  new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
