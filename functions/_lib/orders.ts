// D1 helpers for the Telegram bot.

export interface BotEnv {
  DB?: D1Database;
}

export interface TGUserInput {
  telegram_id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  language_code?: string;
}

export interface BotOrder {
  id?: number;
  order_id: string;
  telegram_id: string;
  status: 'pending' | 'paid' | 'delivered' | 'failed' | 'manual_review' | 'waiting_card_transfer';
  payment_method: 'monobank_invoice' | 'card_transfer' | 'telegram_stars' | 'manual';
  amount: number;
  currency: string;
  invoice_id?: string | null;
  mono_reference?: string | null;
  card_payment_code?: string | null;
  card_expected_amount?: number | null;
  telegram_payment_charge_id?: string | null;
  provider_payment_charge_id?: string | null;
  created_ts: number;
  paid_ts?: number | null;
  delivered_ts?: number | null;
  delivery_attempts?: number;
  extra?: string | null;
}

export async function upsertBotUser(env: BotEnv, u: TGUserInput): Promise<void> {
  if (!env.DB) return;
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO bot_users (telegram_id, username, first_name, last_name, language_code, first_seen_ts, last_seen_ts)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(telegram_id) DO UPDATE SET
       username      = excluded.username,
       first_name    = excluded.first_name,
       last_name     = excluded.last_name,
       language_code = excluded.language_code,
       last_seen_ts  = excluded.last_seen_ts`,
  ).bind(
    u.telegram_id,
    u.username ?? null,
    u.first_name ?? null,
    u.last_name ?? null,
    u.language_code ?? null,
    now,
    now,
  ).run();
}

/** Generate a short, URL-safe random suffix. */
function randSuffix(len = 6): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => (b & 0x1f).toString(32)).join('').slice(0, len);
}

export function newOrderId(): string  { return 'tbb_bot_' + Date.now() + '_' + randSuffix(4); }
export function newMonoReference(): string { return 'tbb-bot-' + Date.now() + '-' + randSuffix(4); }

export async function createOrder(env: BotEnv, o: BotOrder): Promise<void> {
  if (!env.DB) throw new Error('DB binding missing');
  await env.DB.prepare(
    `INSERT INTO bot_orders (
       order_id, telegram_id, status, payment_method, amount, currency,
       invoice_id, mono_reference, card_payment_code, card_expected_amount,
       telegram_payment_charge_id, provider_payment_charge_id,
       created_ts, paid_ts, delivered_ts, delivery_attempts, extra
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    o.order_id, o.telegram_id, o.status, o.payment_method, o.amount, o.currency,
    o.invoice_id ?? null, o.mono_reference ?? null, o.card_payment_code ?? null, o.card_expected_amount ?? null,
    o.telegram_payment_charge_id ?? null, o.provider_payment_charge_id ?? null,
    o.created_ts, o.paid_ts ?? null, o.delivered_ts ?? null, o.delivery_attempts ?? 0, o.extra ?? null,
  ).run();
}

export async function getOrderByMonoReference(env: BotEnv, reference: string): Promise<BotOrder | null> {
  if (!env.DB) return null;
  const row = await env.DB.prepare(`SELECT * FROM bot_orders WHERE mono_reference = ?`).bind(reference).first<BotOrder>();
  return row ?? null;
}

export async function getOrderById(env: BotEnv, orderId: string): Promise<BotOrder | null> {
  if (!env.DB) return null;
  const row = await env.DB.prepare(`SELECT * FROM bot_orders WHERE order_id = ?`).bind(orderId).first<BotOrder>();
  return row ?? null;
}

export async function setOrderPaid(env: BotEnv, orderId: string, invoiceId: string | null, extra: unknown): Promise<void> {
  if (!env.DB) return;
  await env.DB.prepare(
    `UPDATE bot_orders SET status = 'paid', paid_ts = ?, invoice_id = COALESCE(invoice_id, ?), extra = ? WHERE order_id = ?`,
  ).bind(Date.now(), invoiceId, extra ? JSON.stringify(extra).slice(0, 4000) : null, orderId).run();
}

export async function setOrderDelivered(env: BotEnv, orderId: string): Promise<void> {
  if (!env.DB) return;
  await env.DB.prepare(
    `UPDATE bot_orders SET status = 'delivered', delivered_ts = ?, delivery_attempts = delivery_attempts + 1 WHERE order_id = ?`,
  ).bind(Date.now(), orderId).run();
}

export async function bumpDeliveryAttempt(env: BotEnv, orderId: string): Promise<void> {
  if (!env.DB) return;
  await env.DB.prepare(
    `UPDATE bot_orders SET delivery_attempts = delivery_attempts + 1 WHERE order_id = ?`,
  ).bind(orderId).run();
}

export async function setInvoiceId(env: BotEnv, orderId: string, invoiceId: string): Promise<void> {
  if (!env.DB) return;
  await env.DB.prepare(`UPDATE bot_orders SET invoice_id = ? WHERE order_id = ?`).bind(invoiceId, orderId).run();
}

/** Append a row to bot_events (best-effort, swallows errors). */
export async function logBotEvent(env: BotEnv, type: string, telegramId?: string | number, orderId?: string, payload?: unknown): Promise<void> {
  if (!env.DB) return;
  try {
    await env.DB.prepare(
      `INSERT INTO bot_events (ts, telegram_id, type, order_id, payload) VALUES (?, ?, ?, ?, ?)`,
    ).bind(
      Date.now(),
      telegramId != null ? String(telegramId) : null,
      type,
      orderId ?? null,
      payload ? JSON.stringify(payload).slice(0, 4000) : null,
    ).run();
  } catch { /* swallow */ }
}

/** Stats helpers for /stats admin command. */
export async function getStats(env: BotEnv) {
  if (!env.DB) return null;
  const now = Date.now();
  const day  = now - 86400 * 1000;
  const week = now - 7 * 86400 * 1000;
  const [today, last7, totalOrders, totalPaid, recent] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) AS n FROM bot_orders WHERE created_ts >= ?`).bind(day).first<{ n: number }>(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM bot_orders WHERE created_ts >= ?`).bind(week).first<{ n: number }>(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM bot_orders`).first<{ n: number }>(),
    env.DB.prepare(`SELECT COUNT(*) AS n FROM bot_orders WHERE status = 'delivered'`).first<{ n: number }>(),
    env.DB.prepare(`SELECT order_id, telegram_id, status, amount, currency, created_ts FROM bot_orders ORDER BY created_ts DESC LIMIT 5`).all(),
  ]);
  return {
    ordersToday:  today?.n  ?? 0,
    ordersWeek:   last7?.n  ?? 0,
    ordersTotal:  totalOrders?.n ?? 0,
    paidTotal:    totalPaid?.n   ?? 0,
    recent:       (recent.results ?? []) as Array<{ order_id: string; telegram_id: string; status: string; amount: number; currency: string; created_ts: number }>,
  };
}
