// Thin wrapper over the Telegram Bot API for Cloudflare Pages Functions.
// Runtime: V8 isolate — only fetch + Web Crypto are available.

export interface TGEnv {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_WEBHOOK_SECRET?: string;
  TELEGRAM_ADMIN_CHAT_IDS?: string;
  /** Backwards-compat with the older single-purpose name used by the Monobank webhook. */
  TELEGRAM_NOTIFY_CHAT_IDS?: string;
}

const API = 'https://api.telegram.org/bot';

/** Escape `&`, `<`, `>` for parse_mode=HTML. */
export function tgEscape(s: string | number | undefined | null): string {
  if (s == null) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
}
export type InlineKeyboard = InlineKeyboardButton[][];

interface SendMessageOpts {
  reply_markup?: { inline_keyboard: InlineKeyboard };
  parse_mode?: 'HTML' | 'MarkdownV2';
  disable_web_page_preview?: boolean;
  reply_to_message_id?: number;
}

async function callTG<T = any>(env: TGEnv, method: string, payload: any): Promise<T> {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is missing');
  const res = await fetch(API + env.TELEGRAM_BOT_TOKEN + '/' + method, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json<{ ok: boolean; result?: T; description?: string }>();
  if (!data.ok) {
    // Never log the token itself.
    throw new Error('tg.' + method + ' failed: ' + (data.description ?? res.status));
  }
  return data.result as T;
}

export function sendMessage(env: TGEnv, chatId: string | number, text: string, opts: SendMessageOpts = {}) {
  return callTG(env, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: opts.parse_mode ?? 'HTML',
    disable_web_page_preview: opts.disable_web_page_preview ?? true,
    reply_markup: opts.reply_markup,
    reply_to_message_id: opts.reply_to_message_id,
  });
}

export function editMessageText(env: TGEnv, chatId: string | number, messageId: number, text: string, opts: SendMessageOpts = {}) {
  return callTG(env, 'editMessageText', {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: opts.parse_mode ?? 'HTML',
    disable_web_page_preview: opts.disable_web_page_preview ?? true,
    reply_markup: opts.reply_markup,
  });
}

export function answerCallbackQuery(env: TGEnv, callbackQueryId: string, text?: string) {
  return callTG(env, 'answerCallbackQuery', {
    callback_query_id: callbackQueryId,
    text,
    show_alert: false,
  });
}

export interface SendDocumentOpts {
  caption?: string;
  parse_mode?: 'HTML' | 'MarkdownV2';
  protect_content?: boolean;
  reply_markup?: { inline_keyboard: InlineKeyboard };
}

/** sendDocument by file_id (already uploaded to Telegram) or by URL. */
export function sendDocument(env: TGEnv, chatId: string | number, file: { fileId?: string; url?: string }, opts: SendDocumentOpts = {}) {
  if (!file.fileId && !file.url) throw new Error('sendDocument: provide fileId or url');
  return callTG<{
    message_id: number;
    document: { file_id: string; file_unique_id: string; file_name?: string; file_size?: number; mime_type?: string };
  }>(env, 'sendDocument', {
    chat_id: chatId,
    document: file.fileId ?? file.url,
    caption: opts.caption,
    parse_mode: opts.parse_mode ?? 'HTML',
    protect_content: opts.protect_content ?? true,
    reply_markup: opts.reply_markup,
  });
}

/** Parse admin IDs from env (comma-separated). Falls back to legacy `TELEGRAM_NOTIFY_CHAT_IDS`. */
export function getAdminChatIds(env: TGEnv): string[] {
  const raw = env.TELEGRAM_ADMIN_CHAT_IDS ?? env.TELEGRAM_NOTIFY_CHAT_IDS ?? '';
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

export function isAdmin(env: TGEnv, telegramId: string | number): boolean {
  const list = getAdminChatIds(env);
  return list.includes(String(telegramId));
}

/** Verify Telegram's `X-Telegram-Bot-Api-Secret-Token` header. */
export function verifyWebhookSecret(env: TGEnv, request: Request): boolean {
  if (!env.TELEGRAM_WEBHOOK_SECRET) return true; // not configured → accept (warn in caller)
  const got = request.headers.get('x-telegram-bot-api-secret-token') ?? '';
  return got === env.TELEGRAM_WEBHOOK_SECRET;
}
