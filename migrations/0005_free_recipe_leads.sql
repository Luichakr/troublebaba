-- 0005_free_recipe_leads.sql
-- Lead-magnet capture: emails of people who requested the free bento recipe.
-- Separate from `waitlist` so we can a) target them with a different sequence
-- (they raised hand for content, not just launch reminder), b) avoid polluting
-- the launch list with low-intent grabbers.

CREATE TABLE IF NOT EXISTS free_recipe_leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL UNIQUE,
  lang        TEXT,                       -- ru | uk | pl | en
  source      TEXT,                       -- where the form was: 'free_recipe_page' / 'homepage_hero' / etc.
  ip_country  TEXT,                       -- 2-letter ISO from CF
  ts          INTEGER NOT NULL            -- ms epoch
);

CREATE INDEX IF NOT EXISTS idx_free_recipe_ts   ON free_recipe_leads (ts);
CREATE INDEX IF NOT EXISTS idx_free_recipe_lang ON free_recipe_leads (lang);
