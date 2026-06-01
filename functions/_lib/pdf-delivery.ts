// PDF delivery to Telegram with protect_content + personalised caption.
// Uses PDF_FILE_ID (preferred) or PDF_FILE_URL (fallback).

import { sendDocument } from './telegram';
import type { TGEnv } from './telegram';
import { setOrderDelivered, bumpDeliveryAttempt, logBotEvent } from './orders';
import type { BotEnv, BotOrder } from './orders';
import { COPY } from './bot-copy';

export interface PdfEnv extends TGEnv, BotEnv {
  PDF_FILE_ID?:  string;
  PDF_FILE_URL?: string;
}

/** Send the PDF to the buyer. Idempotent: skips if order already delivered.
 *  Returns { delivered, fileId, error }. */
export async function deliverPdfToTelegram(env: PdfEnv, order: BotOrder, username?: string): Promise<{
  delivered: boolean;
  fileId?: string;
  error?: string;
}> {
  if (order.status === 'delivered') {
    return { delivered: true };          // already delivered — idempotent no-op
  }
  if (!env.PDF_FILE_ID && !env.PDF_FILE_URL) {
    await bumpDeliveryAttempt(env, order.order_id);
    await logBotEvent(env, 'bot_pdf_delivery_failed', order.telegram_id, order.order_id, { reason: 'pdf_not_configured' });
    return { delivered: false, error: 'PDF_FILE_ID / PDF_FILE_URL not configured in env' };
  }

  const caption = COPY.pdfCaption(order.order_id, order.telegram_id, username);

  try {
    const sent = await sendDocument(
      env,
      order.telegram_id,
      { fileId: env.PDF_FILE_ID, url: env.PDF_FILE_URL },
      { caption, parse_mode: 'HTML', protect_content: true },
    );
    await setOrderDelivered(env, order.order_id);
    await logBotEvent(env, 'bot_pdf_delivered', order.telegram_id, order.order_id, {
      file_id: sent?.document?.file_id,
    });
    return { delivered: true, fileId: sent?.document?.file_id };
  } catch (e: any) {
    await bumpDeliveryAttempt(env, order.order_id);
    await logBotEvent(env, 'bot_pdf_delivery_failed', order.telegram_id, order.order_id, { error: e?.message });
    return { delivered: false, error: e?.message ?? 'unknown error' };
  }
}
