-- D1 schema for click + funnel tracking.
-- Run once after creating the D1 database in Cloudflare:
--   npx wrangler d1 execute troublebaba-events --remote --file=migrations/0001_init.sql
-- or paste this SQL into the CF dashboard → D1 → Console.

CREATE TABLE IF NOT EXISTS events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          INTEGER NOT NULL,             -- unix milliseconds
  type        TEXT    NOT NULL,             -- e.g. 'click_buy', 'invoice_create', 'invoice_success'
  source      TEXT,                         -- e.g. 'header', 'hero', 'bonus', 'price', 'final-cta', 'sticky-mobile'
  page_lang   TEXT,                         -- 'uk' | 'ru' | 'pl' | 'en'
  page_path   TEXT,
  user_agent  TEXT,
  ip_country  TEXT,                         -- ISO-2 country code from Cloudflare
  ref         TEXT,                         -- document.referrer (truncated)
  extra       TEXT                          -- optional JSON for extra fields
);

CREATE INDEX IF NOT EXISTS idx_events_ts       ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_type     ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_type_src ON events(type, source);
CREATE INDEX IF NOT EXISTS idx_events_lang     ON events(page_lang);
