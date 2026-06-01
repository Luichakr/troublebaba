// POST /api/telegram/webhook
// Main Telegram bot entrypoint. Handles /start, the inline-keyboard menu,
// info sections, FAQ, the buy flow (creates a Monobank invoice), and a few
// admin commands.
//
// One-time setup (after deploy + env vars are set):
//   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?\
//        url=https://troublebaba.com/api/telegram/webhook&\
//        secret_token=<TELEGRAM_WEBHOOK_SECRET>&\
//        allowed_updates=%5B%22message%22%2C%22callback_query%22%5D"

import { createInvoice }   from '../../_lib/monobank';
import type { Env as MonoEnv, InvoiceCreateRequest } from '../../_lib/monobank';
import {
  sendMessage, editMessageText, answerCallbackQuery, tgEscape,
  verifyWebhookSecret, getAdminChatIds, isAdmin,
} from '../../_lib/telegram';
import type { TGEnv } from '../../_lib/telegram';
import {
  upsertBotUser, createOrder, getOrderById, setInvoiceId,
  newOrderId, newMonoReference, logBotEvent, getStats,
} from '../../_lib/orders';
import type { BotEnv } from '../../_lib/orders';
import { COPY, FAQ, recipesList } from '../../_lib/bot-copy';
import { deliverPdfToTelegram } from '../../_lib/pdf-delivery';
import type { PdfEnv } from '../../_lib/pdf-delivery';

type Env = MonoEnv & TGEnv & BotEnv & PdfEnv & { SITE_URL?: string };

const PRICE_UAH_KOPECKS = 85000;
const PRODUCT_NAME = 'Bento Cake by TROUBLEBABA — PDF';

// ─── Menu builders ────────────────────────────────────────────────────────────
const mainMenu = () => ({
  inline_keyboard: [
    [{ text: '🍰 Купить PDF', callback_data: 'buy' }],
    [{ text: '📖 Что внутри',  callback_data: 'inside' },
     { text: '🧁 10 рецептов', callback_data: 'recipes' }],
    [{ text: '👩‍🍳 Кто автор',  callback_data: 'author' },
     { text: '📱 Соцсети',     callback_data: 'socials' }],
    [{ text: '❓ FAQ',          callback_data: 'faq' },
     { text: '💬 Поддержка',    callback_data: 'support' }],
    [{ text: '🌐 Открыть сайт', url: 'https://troublebaba.com/' }],
  ],
});
const backToMenu = () => ({ inline_keyboard: [[{ text: '⬅️ В меню', callback_data: 'menu' }]] });
const buyOrBack = () => ({
  inline_keyboard: [
    [{ text: '🍰 Купить PDF', callback_data: 'buy' }],
    [{ text: '⬅️ В меню',     callback_data: 'menu' }],
  ],
});

const faqMenu = () => ({
  inline_keyboard: [
    ...FAQ.map((f, i) => [{ text: (i + 1) + '. ' + f.q, callback_data: 'faq_' + i }]),
    [{ text: '🍰 Купить PDF', callback_data: 'buy' }],
    [{ text: '⬅️ В меню',     callback_data: 'menu' }],
  ],
});
const faqAnswerMenu = () => ({
  inline_keyboard: [
    [{ text: '🍰 Купить PDF', callback_data: 'buy' }],
    [{ text: '⬅️ К вопросам', callback_data: 'faq' }],
    [{ text: '⬅️ В меню',     callback_data: 'menu' }],
  ],
});

const socialsMenu = (env: Env) => {
  const rows: { text: string; url: string }[][] = [];
  const ig = 'https://instagram.com/troublebaba';
  const tt = 'https://tiktok.com/@troublebaba';
  const yt = 'https://youtube.com/@troublebaba';
  const fb = 'https://facebook.com/troublebaba';
  rows.push([{ text: 'Instagram', url: ig }, { text: 'TikTok', url: tt }]);
  rows.push([{ text: 'YouTube',   url: yt }, { text: 'Facebook', url: fb }]);
  return { inline_keyboard: [...rows, [{ text: '⬅️ В меню', callback_data: 'menu' }]] };
};

// ─── Buy flow ─────────────────────────────────────────────────────────────────
async function handleBuy(env: Env, chatId: number, telegramId: string, username?: string): Promise<void> {
  if (!env.MONOBANK_TOKEN) {
    await sendMessage(env, chatId, COPY.buyError, { reply_markup: backToMenu() });
    return;
  }
  await sendMessage(env, chatId, COPY.buyCreating);

  const order_id  = newOrderId();
  const reference = newMonoReference();
  const origin    = (env.SITE_URL ?? 'https://troublebaba.com').replace(/\/$/, '');

  try {
    await createOrder(env, {
      order_id,
      telegram_id: telegramId,
      status: 'pending',
      payment_method: 'monobank_invoice',
      amount: PRICE_UAH_KOPECKS,
      currency: 'UAH',
      mono_reference: reference,
      created_ts: Date.now(),
      delivery_attempts: 0,
      extra: JSON.stringify({ username }),
    });

    const payload: InvoiceCreateRequest = {
      amount: PRICE_UAH_KOPECKS,
      ccy: 980,
      paymentType: 'debit',
      validity: 3600,
      redirectUrl: origin + '/thank-you?invoiceId={invoiceId}',
      webHookUrl:  origin + '/api/checkout/webhook',
      merchantPaymInfo: {
        reference,
        destination: PRODUCT_NAME,
        basketOrder: [{ name: PRODUCT_NAME, qty: 1, sum: PRICE_UAH_KOPECKS, unit: 'шт.', code: 'troublebaba-bento-cake-pdf' }],
      },
    };
    const invoice = await createInvoice(env, payload);
    await setInvoiceId(env, order_id, invoice.invoiceId);

    await logBotEvent(env, 'bot_invoice_create', telegramId, order_id, { invoice_id: invoice.invoiceId });

    await sendMessage(env, chatId,
      COPY.buyAsk + '\n\n<code>' + tgEscape(order_id) + '</code>',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: '💳 Оплатить', url: invoice.pageUrl }],
            [{ text: '⬅️ В меню',  callback_data: 'menu' }],
          ],
        },
      },
    );
  } catch (e: any) {
    console.error('[bot.buy]', e?.message);
    await sendMessage(env, chatId, COPY.buyError, { reply_markup: backToMenu() });
  }
}

// ─── Callback router ──────────────────────────────────────────────────────────
async function handleCallback(env: Env, cb: any): Promise<void> {
  const data: string = cb.data ?? '';
  const chatId: number = cb.message?.chat?.id;
  const messageId: number = cb.message?.message_id;
  const telegramId: string = String(cb.from.id);
  const username: string | undefined = cb.from.username;

  // Always ack so the spinner disappears on the client.
  answerCallbackQuery(env, cb.id).catch(() => {});

  const edit = (text: string, kb: any) =>
    editMessageText(env, chatId, messageId, text, { reply_markup: kb }).catch(() =>
      sendMessage(env, chatId, text, { reply_markup: kb }),
    );

  await logBotEvent(env, 'bot_menu_click', telegramId, undefined, { data });

  switch (true) {
    case data === 'menu':
      return void edit(COPY.start(cb.from.first_name), mainMenu());

    case data === 'inside':
      return void edit(COPY.whatsInside, buyOrBack());

    case data === 'recipes':
      return void edit(recipesList(), buyOrBack());

    case data === 'author':
      return void edit(COPY.author, {
        inline_keyboard: [
          [{ text: '📱 Соцсети',     callback_data: 'socials' }],
          [{ text: '🍰 Купить PDF',  callback_data: 'buy' }],
          [{ text: '⬅️ В меню',     callback_data: 'menu' }],
        ],
      });

    case data === 'socials':
      return void edit(COPY.socialsTitle, socialsMenu(env));

    case data === 'faq':
      return void edit(COPY.faqTitle, faqMenu());

    case /^faq_(\d+)$/.test(data): {
      const idx = parseInt(data.replace('faq_', ''), 10);
      const f = FAQ[idx];
      if (!f) return void edit(COPY.faqTitle, faqMenu());
      return void edit('<b>' + tgEscape(f.q) + '</b>\n\n' + tgEscape(f.a), faqAnswerMenu());
    }

    case data === 'support':
      return void edit(COPY.support, backToMenu());

    case data === 'buy':
      await handleBuy(env, chatId, telegramId, username);
      return;
  }
}

// ─── Message router (text commands + admin docs) ──────────────────────────────
async function handleMessage(env: Env, msg: any): Promise<void> {
  const chatId: number = msg.chat.id;
  const telegramId: string = String(msg.from.id);
  const text: string = (msg.text ?? '').slice(0, 1000);

  // Admin uploads a PDF document → reply with file_id so they can copy it into env.
  if (msg.document && isAdmin(env, telegramId)) {
    const fileId = msg.document.file_id;
    const fileName = msg.document.file_name ?? 'file';
    await sendMessage(env, chatId,
      '<b>file_id получен ✅</b>\n\n' +
      'Имя: <code>' + tgEscape(fileName) + '</code>\n' +
      'mime: <code>' + tgEscape(msg.document.mime_type ?? '—') + '</code>\n\n' +
      '<b>file_id:</b>\n<code>' + tgEscape(fileId) + '</code>\n\n' +
      'Скопируй в Cloudflare Pages → Settings → Variables → <code>PDF_FILE_ID</code>, потом редеплой.',
    );
    return;
  }

  if (text.startsWith('/start')) {
    await sendMessage(env, chatId, COPY.start(msg.from.first_name), { reply_markup: mainMenu() });
    await logBotEvent(env, 'bot_start', telegramId);
    return;
  }

  if (text.startsWith('/menu')) {
    await sendMessage(env, chatId, COPY.start(msg.from.first_name), { reply_markup: mainMenu() });
    return;
  }

  // ── Admin commands ──
  if (text.startsWith('/stats') && isAdmin(env, telegramId)) {
    const s = await getStats(env);
    if (!s) { await sendMessage(env, chatId, 'D1 binding не настроен.'); return; }
    const last = s.recent.map(r =>
      '• <code>' + tgEscape(r.order_id) + '</code> — ' + r.status + ' — ' + (r.amount / 100).toFixed(2) + ' ' + r.currency,
    ).join('\n') || '—';
    await sendMessage(env, chatId,
      COPY.admin.statsTitle + '\n\n' +
      'Заказов сегодня: <b>' + s.ordersToday + '</b>\n' +
      'За 7 дней: <b>' + s.ordersWeek + '</b>\n' +
      'Всего: <b>' + s.ordersTotal + '</b>\n' +
      'Доставленных PDF: <b>' + s.paidTotal + '</b>\n\n' +
      '<b>Последние:</b>\n' + last,
    );
    return;
  }

  if (text.startsWith('/order ') && isAdmin(env, telegramId)) {
    const id = text.split(/\s+/)[1]?.trim();
    if (!id) return;
    const o = await getOrderById(env, id);
    if (!o) { await sendMessage(env, chatId, 'Order не найден.'); return; }
    await sendMessage(env, chatId,
      '<b>' + tgEscape(o.order_id) + '</b>\n' +
      'status: ' + o.status + '\n' +
      'tg: ' + o.telegram_id + '\n' +
      'method: ' + o.payment_method + '\n' +
      'amount: ' + (o.amount / 100).toFixed(2) + ' ' + o.currency + '\n' +
      'invoice: <code>' + tgEscape(o.invoice_id ?? '—') + '</code>\n' +
      'created: ' + new Date(o.created_ts).toISOString() + '\n' +
      'paid: '    + (o.paid_ts ? new Date(o.paid_ts).toISOString() : '—') + '\n' +
      'delivered:' + (o.delivered_ts ? new Date(o.delivered_ts).toISOString() : '—'),
    );
    return;
  }

  if (text.startsWith('/resend ') && isAdmin(env, telegramId)) {
    const id = text.split(/\s+/)[1]?.trim();
    if (!id) return;
    const o = await getOrderById(env, id);
    if (!o) { await sendMessage(env, chatId, 'Order не найден.'); return; }
    if (o.status !== 'paid' && o.status !== 'delivered') {
      await sendMessage(env, chatId, 'Order не оплачен. Текущий статус: ' + o.status);
      return;
    }
    // Force re-delivery: temporarily flip status to 'paid' so the idempotency guard inside
    // deliverPdfToTelegram doesn't no-op.
    o.status = 'paid';
    const r = await deliverPdfToTelegram(env, o);
    await sendMessage(env, chatId, r.delivered
      ? 'PDF переслан ✅' + (r.fileId ? '\nfile_id: <code>' + tgEscape(r.fileId) + '</code>' : '')
      : 'Ошибка: ' + (r.error ?? 'unknown'),
    );
    return;
  }

  if (text.startsWith('/admin') && isAdmin(env, telegramId)) {
    await sendMessage(env, chatId,
      '<b>Админ-команды</b>\n\n' +
      '/stats — общая статистика\n' +
      '/order ORDER_ID — детали заказа\n' +
      '/resend ORDER_ID — повторно отправить PDF\n\n' +
      'Чтобы получить file_id PDF — просто загрузи документ в этот чат.',
    );
    return;
  }

  // Default: show menu
  await sendMessage(env, chatId, COPY.start(msg.from.first_name), { reply_markup: mainMenu() });
}

// ─── Entrypoint ────────────────────────────────────────────────────────────────
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!verifyWebhookSecret(env, request)) {
    return new Response('forbidden', { status: 401 });
  }

  let update: any;
  try { update = await request.json(); } catch { return new Response('bad json', { status: 400 }); }

  try {
    // Upsert the user as soon as we see them.
    const from = update.message?.from ?? update.callback_query?.from;
    if (from) {
      await upsertBotUser(env, {
        telegram_id: String(from.id),
        username: from.username,
        first_name: from.first_name,
        last_name:  from.last_name,
        language_code: from.language_code,
      });
    }

    if (update.callback_query) {
      await handleCallback(env, update.callback_query);
    } else if (update.message) {
      await handleMessage(env, update.message);
    }
  } catch (e: any) {
    console.error('[tg-webhook]', e?.message);
  }

  // Telegram only retries on non-2xx. Always 200 unless secret check failed.
  return new Response('ok');
};

export const onRequest: PagesFunction<Env> = ({ request }) => {
  return new Response(`Method ${request.method} not allowed`, { status: 405, headers: { Allow: 'POST' } });
};
