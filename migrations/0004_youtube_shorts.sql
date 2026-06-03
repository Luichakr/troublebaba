-- 0004_youtube_shorts.sql
-- Mirror of YouTube channel's recent shorts + "short of the day" rotation state.
-- A daily cron upserts new entries from the channel RSS, then surfaces ONE short
-- per day: the newest unposted one, or — if all known shorts are already posted —
-- the least-recently-posted one (so the feed always shows something fresh-looking).

CREATE TABLE IF NOT EXISTS youtube_shorts (
  video_id      TEXT PRIMARY KEY,        -- YouTube videoId (11 chars)
  title         TEXT NOT NULL,
  thumbnail_url TEXT,                    -- maxresdefault or hqdefault
  published_at  INTEGER NOT NULL,        -- ms epoch (from RSS <published>)
  is_short      INTEGER NOT NULL DEFAULT 0,  -- 1 = confirmed short (canonical contains /shorts/)
  first_seen_at INTEGER NOT NULL,        -- when our cron first discovered it
  posted_at     INTEGER                  -- ms epoch when surfaced on the site; NULL = never
);

-- Quick "next pick" query: newest unposted short.
CREATE INDEX IF NOT EXISTS idx_shorts_unposted
  ON youtube_shorts (is_short, posted_at, published_at);

-- Quick "recent surfaced" query for the feed page.
CREATE INDEX IF NOT EXISTS idx_shorts_posted
  ON youtube_shorts (posted_at DESC);
