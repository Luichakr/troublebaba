-- Pre-launch waitlist: emails collected before sales start (10 Jul 2026).
-- Run once in CF Dashboard → D1 → troublebaba-events → Console.

CREATE TABLE IF NOT EXISTS waitlist (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  lang        TEXT,
  source      TEXT,            -- which block the signup came from
  ip_country  TEXT,
  ts          INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_ts   ON waitlist(ts);
CREATE INDEX IF NOT EXISTS idx_waitlist_lang ON waitlist(lang);
