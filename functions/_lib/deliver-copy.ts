// Localized delivery email: same visual, four languages (uk / ru / en / pl).
// Called from LS and Paddle webhooks after payment.

export type DeliverLang = 'uk' | 'ru' | 'en' | 'pl';

function isSupported(v: string): v is DeliverLang {
  return v === 'uk' || v === 'ru' || v === 'en' || v === 'pl';
}

// LS store_id → PDF language. Keeps the fallback correct even when the
// checkout didn't forward ?custom[lang] for some reason.
const STORE_LANG: Record<string, DeliverLang> = {
  '446675': 'uk', // troublebaba · UAH
  '450343': 'en', // troublebaba EN · EUR
  '452188': 'pl', // troublebaba PL · PLN
  '452190': 'ru', // troublebaba RU · USD
};

export function pickLang(raw?: string | null, storeId?: string | null): DeliverLang {
  const norm = String(raw ?? '').toLowerCase().slice(0, 2);
  if (isSupported(norm)) return norm;
  if (storeId && STORE_LANG[storeId]) return STORE_LANG[storeId];
  return 'uk';
}

interface CopyStrings {
  subject: string;
  heading: string;
  intro: string;
  cta: string;
  fallbackLink: string;
  expiryNote: (days: number, downloads: number) => string;
  receiptLs: string;
  receiptPaddle: string;
  communityCta: string;
  communitySub: string;
  questions: (email: string) => string;
}

const COPY: Record<DeliverLang, CopyStrings> = {
  uk: {
    subject: 'Ваш PDF — Bento Cake by TROUBLEBABA',
    heading: 'Дякуємо за покупку! 🍰',
    intro: 'Ваш збірник «Bento Cake by TROUBLEBABA — 10 рецептів» готовий до завантаження.',
    cta: 'Завантажити PDF',
    fallbackLink: 'Якщо кнопка не працює, скопіюйте посилання:',
    expiryNote: (d, n) => `⏳ Посилання персональне: діє <b>${d} днів</b> і розраховане на <b>${n} завантаження</b>. Будь ласка, збережіть файл на свій пристрій одразу.`,
    receiptLs: 'Окремим листом Lemon Squeezy надішле офіційний чек за покупку — це нормально, зберігайте його.',
    receiptPaddle: 'Окремим листом від Paddle прийде офіційний чек за покупку — це нормально, зберігайте його.',
    communityCta: '✦ Приєднатися до Telegram-чату покупців',
    communitySub: 'Закритий чат TROUBLEBABA: питання авторці, фото ваших робіт, оновлення збірника.',
    questions: (e) => `Питання? Напишіть на <a href="mailto:${e}" style="color:#8B7355">${e}</a>.`,
  },
  ru: {
    subject: 'Ваш PDF — Bento Cake by TROUBLEBABA',
    heading: 'Спасибо за покупку! 🍰',
    intro: 'Ваш сборник «Bento Cake by TROUBLEBABA — 10 рецептов» готов к скачиванию.',
    cta: 'Скачать PDF',
    fallbackLink: 'Если кнопка не работает, скопируйте ссылку:',
    expiryNote: (d, n) => `⏳ Ссылка персональная: действует <b>${d} дней</b> и рассчитана на <b>${n} скачивания</b>. Пожалуйста, сохраните файл на устройство сразу.`,
    receiptLs: 'Отдельным письмом Lemon Squeezy пришлёт официальный чек за покупку — это нормально, сохраните его.',
    receiptPaddle: 'Отдельным письмом от Paddle придёт официальный чек за покупку — это нормально, сохраните его.',
    communityCta: '✦ Присоединиться к Telegram-чату покупателей',
    communitySub: 'Закрытый чат TROUBLEBABA: вопросы автору, фото ваших работ, обновления сборника.',
    questions: (e) => `Вопросы? Напишите на <a href="mailto:${e}" style="color:#8B7355">${e}</a>.`,
  },
  en: {
    subject: 'Your PDF — Bento Cake by TROUBLEBABA',
    heading: 'Thanks for your purchase! 🍰',
    intro: 'Your collection “Bento Cake by TROUBLEBABA — 10 recipes” is ready to download.',
    cta: 'Download PDF',
    fallbackLink: 'If the button doesn’t work, copy the link:',
    expiryNote: (d, n) => `⏳ This link is personal: valid for <b>${d} days</b> and up to <b>${n} downloads</b>. Please save the file to your device right away.`,
    receiptLs: 'Lemon Squeezy will send the official receipt in a separate email — that’s normal, keep it for your records.',
    receiptPaddle: 'Paddle will send the official receipt in a separate email — that’s normal, keep it for your records.',
    communityCta: '✦ Join the buyers’ Telegram chat',
    communitySub: 'Private TROUBLEBABA chat: questions for the author, photos of your bakes, collection updates.',
    questions: (e) => `Questions? Email <a href="mailto:${e}" style="color:#8B7355">${e}</a>.`,
  },
  pl: {
    subject: 'Twój PDF — Bento Cake by TROUBLEBABA',
    heading: 'Dziękujemy za zakup! 🍰',
    intro: 'Twój zbiór „Bento Cake by TROUBLEBABA — 10 przepisów” jest gotowy do pobrania.',
    cta: 'Pobierz PDF',
    fallbackLink: 'Jeśli przycisk nie działa, skopiuj link:',
    expiryNote: (d, n) => `⏳ Link jest osobisty: ważny <b>${d} dni</b> i obsługuje do <b>${n} pobrań</b>. Zapisz plik na urządzeniu od razu.`,
    receiptLs: 'Osobnym mailem Lemon Squeezy prześle oficjalny paragon za zakup — to normalne, zachowaj go.',
    receiptPaddle: 'Osobnym mailem od Paddle przyjdzie oficjalny paragon za zakup — to normalne, zachowaj go.',
    communityCta: '✦ Dołącz do Telegram-czatu kupujących',
    communitySub: 'Zamknięty czat TROUBLEBABA: pytania do autorki, zdjęcia Waszych wypieków, aktualizacje zbioru.',
    questions: (e) => `Pytania? Napisz na <a href="mailto:${e}" style="color:#8B7355">${e}</a>.`,
  },
};

interface RenderOpts {
  lang: DeliverLang;
  link: string;
  expiryDays: number;
  maxDownloads: number;
  communityUrl?: string;
  supportEmail?: string;
  /** Which processor sent them here — controls the "official receipt" wording. */
  processor: 'ls' | 'paddle';
}

export function renderDeliverEmail(opts: RenderOpts): { subject: string; html: string } {
  const c = COPY[opts.lang];
  const support = opts.supportEmail || 'pr.troublebaba@gmail.com';
  const communityBlock = opts.communityUrl
    ? `<p style="margin:24px 0 0">
         <a href="${opts.communityUrl}" style="background:#f0e6d2;color:#1A1A1A;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:700;display:inline-block;border:1px solid #d9c7a3">
           ${c.communityCta}
         </a>
       </p>
       <p style="font-size:12px;color:#8a8175;margin-top:8px">${c.communitySub}</p>`
    : '';
  const receiptLine = opts.processor === 'paddle' ? c.receiptPaddle : c.receiptLs;
  const html = `
  <div style="font-family:system-ui,-apple-system,sans-serif;max-width:520px;margin:0 auto;color:#1A1A1A">
    <h2 style="color:#8B7355">${c.heading}</h2>
    <p>${c.intro}</p>
    <p style="margin:28px 0">
      <a href="${opts.link}" style="background:#8B7355;color:#fff;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700;display:inline-block">
        ${c.cta}
      </a>
    </p>
    <p style="font-size:13px;color:#6b6257">${c.fallbackLink}<br>${opts.link}</p>
    <p style="font-size:13px;color:#8a6d3b;background:#fbf6ec;border:1px solid #ecdcc0;border-radius:10px;padding:12px 14px">
      ${c.expiryNote(opts.expiryDays, opts.maxDownloads)}
    </p>
    <p style="font-size:13px;color:#6b6257;margin-top:20px">${receiptLine}</p>
    ${communityBlock}
    <p style="font-size:13px;color:#6b6257">${c.questions(support)}</p>
  </div>`;
  return { subject: c.subject, html };
}
