-- Bot users + orders + events for the Telegram sales bot.
-- Run once in CF Dashboard → D1 → troublebaba-events → Console.

CREATE TABLE IF NOT EXISTS bot_users (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id     TEXT    NOT NULL UNIQUE,
  username        TEXT,
  first_name      TEXT,
  last_name       TEXT,
  language_code   TEXT,
  first_seen_ts   INTEGER NOT NULL,
  last_seen_ts    INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bot_orders (
  id                          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id                    TEXT    NOT NULL UNIQUE,
  telegram_id                 TEXT    NOT NULL,
  status                      TEXT    NOT NULL,       -- pending | paid | delivered | failed | manual_review | waiting_card_transfer
  payment_method              TEXT    NOT NULL,       -- monobank_invoice | card_transfer | telegram_stars | manual
  amount                      INTEGER NOT NULL,       -- minor units (kopecks for UAH)
  currency                    TEXT    NOT NULL,       -- 'UAH'|'USD'|...
  invoice_id                  TEXT,                   -- Monobank invoiceId
  mono_reference              TEXT,                   -- tbb-bot-<ts>-<rand>
  card_payment_code           TEXT,                   -- TBB-XXXX (for card transfer fallback)
  card_expected_amount        INTEGER,
  telegram_payment_charge_id  TEXT,
  provider_payment_charge_id  TEXT,
  created_ts                  INTEGER NOT NULL,
  paid_ts                     INTEGER,
  delivered_ts                INTEGER,
  delivery_attempts           INTEGER DEFAULT 0,
  extra                       TEXT
);

CREATE INDEX IF NOT EXISTS idx_bot_orders_telegram_id    ON bot_orders(telegram_id);
CREATE INDEX IF NOT EXISTS idx_bot_orders_status         ON bot_orders(status);
CREATE INDEX IF NOT EXISTS idx_bot_orders_invoice_id     ON bot_orders(invoice_id);
CREATE INDEX IF NOT EXISTS idx_bot_orders_mono_reference ON bot_orders(mono_reference);
CREATE INDEX IF NOT EXISTS idx_bot_orders_card_code      ON bot_orders(card_payment_code);

CREATE TABLE IF NOT EXISTS bot_events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  ts          INTEGER NOT NULL,
  telegram_id TEXT,
  type        TEXT    NOT NULL,
  order_id    TEXT,
  payload     TEXT
);

CREATE INDEX IF NOT EXISTS idx_bot_events_ts          ON bot_events(ts);
CREATE INDEX IF NOT EXISTS idx_bot_events_type        ON bot_events(type);
CREATE INDEX IF NOT EXISTS idx_bot_events_telegram_id ON bot_events(telegram_id);
