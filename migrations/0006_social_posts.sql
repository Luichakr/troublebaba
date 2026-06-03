-- 0006_social_posts.sql
-- Manually-curated social posts (Instagram / TikTok / others) that can't be
-- auto-pulled the way the YouTube RSS feed is. The admin pastes a post URL in
-- the /m/d dashboard; it's stored here and merged into the public feed shown
-- on /shorts/ and the blog hub.

CREATE TABLE IF NOT EXISTS social_posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  platform      TEXT NOT NULL,            -- instagram | tiktok | youtube | other
  url           TEXT NOT NULL UNIQUE,     -- canonical post URL (used as link + dedupe key)
  title         TEXT,                     -- optional caption/title
  thumbnail_url TEXT,                     -- cover image (TikTok via oEmbed; IG = optional manual)
  ts            INTEGER NOT NULL,         -- when added (ms epoch)
  sort_ts       INTEGER NOT NULL          -- ordering key (defaults to ts; lets us reorder later)
);

CREATE INDEX IF NOT EXISTS idx_social_posts_sort ON social_posts (sort_ts DESC);
