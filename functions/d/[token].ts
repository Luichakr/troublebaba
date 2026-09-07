// GET /d/<token>          → HTML gate page with a "Download" button. Robots and
//                          link-previewers stop here — no counter tick, no bytes.
// GET /d/<token>?go=1     → the real download. Bumps the counter and streams
//                          the private PDF from R2. Cap 3 downloads / 7 days.
//
// Splitting the two paths matters: Gmail, iMessage and antivirus scanners open
// every emailed link to preview it, and used to burn all 3 attempts before the
// buyer ever saw the file. First reported by a buyer whose 3 attempts were
// gone by the time her family tried to download.

import { verifyDownloadToken } from '../_lib/dl';

// Language-specific PDFs live in R2 as bento-cake-<lang>.pdf. Buyer's lang is
// embedded in the signed token; missing/unknown → uk (Ukrainian original).
const SUPPORTED_LANGS = new Set(['uk', 'ru', 'en', 'pl']);
const DEFAULT_LANG = 'uk';
const fileKey = (lang: string) => `bento-cake-${SUPPORTED_LANGS.has(lang) ? lang : DEFAULT_LANG}.pdf`;
const DL_NAME_BY_LANG: Record<string, string> = {
  uk: 'Bento Cake by TROUBLEBABA — UA.pdf',
  ru: 'Bento Cake by TROUBLEBABA — RU.pdf',
  en: 'Bento Cake by TROUBLEBABA — EN.pdf',
  pl: 'Bento Cake by TROUBLEBABA — PL.pdf',
};
const MAX_DOWNLOADS = 3;

// Localized copy for the gate page and 410 messages. Falls back to uk.
const COPY: Record<string, {
  title: string; heading: string; body: string; button: string;
  saveTip: string; expired: string; limit: string; sizeHint: string;
}> = {
  uk: {
    title: 'Ваш PDF — Bento Cake by TROUBLEBABA',
    heading: 'Ваш збірник готовий',
    body: 'Натисніть кнопку, щоб завантажити PDF. Це персональне посилання — рекомендуємо відразу зберегти файл на пристрій.',
    button: 'Завантажити PDF',
    saveTip: 'Порада: після завантаження збережіть файл у «Файли» / «Завантаження» — так збірник залишиться з вами назавжди.',
    sizeHint: '— висока роздільна здатність: можна друкувати й роздивлятися зі збільшенням. На мобільному інтернеті краще підключитися до Wi-Fi.',
    expired: 'Термін дії посилання минув (7 днів). Напишіть на pr.troublebaba@gmail.com — надішлемо нове.',
    limit:   'Ліміт завантажень вичерпано. Напишіть на pr.troublebaba@gmail.com — надішлемо нове посилання.',
  },
  ru: {
    title: 'Ваш PDF — Bento Cake by TROUBLEBABA',
    heading: 'Ваш сборник готов',
    body: 'Нажмите кнопку, чтобы скачать PDF. Это персональная ссылка — сразу сохраните файл на устройство.',
    button: 'Скачать PDF',
    saveTip: 'Совет: после скачивания сохраните файл в «Файлы» / «Загрузки» — сборник останется у вас навсегда.',
    sizeHint: '— высокое разрешение: можно печатать и рассматривать с увеличением. На мобильном интернете лучше подключиться к Wi-Fi.',
    expired: 'Срок действия ссылки истёк (7 дней). Напишите на pr.troublebaba@gmail.com — вышлем новую.',
    limit:   'Лимит скачиваний исчерпан. Напишите на pr.troublebaba@gmail.com — вышлем новую ссылку.',
  },
  en: {
    title: 'Your PDF — Bento Cake by TROUBLEBABA',
    heading: 'Your collection is ready',
    body: 'Click the button to download the PDF. This is a personal link — please save the file to your device right away.',
    button: 'Download PDF',
    saveTip: 'Tip: after the download, save the file to Files / Downloads — the collection will stay with you forever.',
    sizeHint: '— print-quality resolution: zoom right in or print it out. On mobile data, Wi-Fi is a better bet.',
    expired: 'This link has expired (7 days). Email pr.troublebaba@gmail.com and we’ll send a fresh one.',
    limit:   'Download limit reached. Email pr.troublebaba@gmail.com and we’ll send a fresh link.',
  },
  pl: {
    title: 'Twój PDF — Bento Cake by TROUBLEBABA',
    heading: 'Twój zbiór jest gotowy',
    body: 'Kliknij przycisk, aby pobrać PDF. To osobisty link — zapisz plik od razu na swoim urządzeniu.',
    button: 'Pobierz PDF',
    saveTip: 'Wskazówka: po pobraniu zapisz plik w Plikach / Pobranych — zbiór zostanie z Tobą na zawsze.',
    sizeHint: '— wysoka rozdzielczość: można drukować i oglądać w powiększeniu. Przez internet mobilny lepiej połączyć się z Wi-Fi.',
    expired: 'Link wygasł (7 dni). Napisz do pr.troublebaba@gmail.com — wyślemy nowy.',
    limit:   'Limit pobrań wyczerpany. Napisz do pr.troublebaba@gmail.com — wyślemy nowy link.',
  },
};

interface Env {
  PDF_BUCKET: R2Bucket;
  CRON_SECRET?: string;
}

// Small helper: 410 Gone plain-text.
function gone(msg: string): Response {
  return new Response(msg, { status: 410, headers: { 'content-type': 'text/plain; charset=utf-8' } });
}

// Gate page — a light HTML with one button pointing at the same URL + ?go=1.
// Kept intentionally simple so a Gmail preview scan produces zero counter ticks
// (previewers fetch the HTML, they don't follow the button).
/**
 * "70.5 MB" — the PDF is deliberately heavy: full print resolution so buyers
 * can zoom into every photo or print the collection. Stating the size (and why)
 * turns a scary number into a selling point, and warns mobile users — 87% of
 * our traffic — before a dropped connection burns one of only 3 attempts.
 * Size comes from R2 metadata so it stays correct when the PDF is re-uploaded.
 */
function formatSize(bytes: number, lang: string): string {
  const mb = bytes / (1024 * 1024);
  const unit = lang === 'uk' ? 'МБ' : lang === 'ru' ? 'МБ' : lang === 'pl' ? 'MB' : 'MB';
  // Locale decimal comma for uk/ru/pl, dot for en.
  const num = mb.toFixed(1).replace('.', lang === 'en' ? '.' : ',');
  return `${num} ${unit}`;
}

function gatePage(url: URL, c: typeof COPY['uk'], sizeLabel?: string): Response {
  const goUrl = new URL(url); goUrl.searchParams.set('go', '1');
  const html = `<!doctype html>
<html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex,nofollow">
  <title>${c.title}</title>
  <style>
    body{margin:0;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;background:#F5EFE8;color:#1A1A1A;display:flex;min-height:100dvh;align-items:center;justify-content:center;padding:24px}
    .card{max-width:520px;background:#fff;border-radius:20px;padding:40px 32px;box-shadow:0 8px 32px rgba(139,115,85,.14);text-align:center}
    h1{margin:0 0 12px;font-size:26px;color:#8B7355;font-weight:700}
    p{margin:0 0 24px;line-height:1.55;color:#4a4238;font-size:15px}
    a.btn{display:inline-block;background:#8B7355;color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:16px}
    a.btn:hover{background:#725d43}
    .size{margin:12px 0 0;font-size:13.5px;color:#6b6152;font-weight:600}
    .size span{font-weight:400;color:#8a8175}
    .tip{margin-top:20px;font-size:13px;color:#8a8175}
  </style>
</head><body>
  <div class="card">
    <h1>${c.heading}</h1>
    <p>${c.body}</p>
    <a class="btn" href="${goUrl.pathname}${goUrl.search}" rel="noopener">${c.button}</a>
    ${sizeLabel ? `<p class="size">${sizeLabel} <span>${c.sizeHint}</span></p>` : ''}
    <p class="tip">${c.saveTip}</p>
  </div>
</body></html>`;
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Robots may still fetch us — make sure they don't cache anything permanent.
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, params, env }) => {
  const url = new URL(request.url);
  const token = String((params as any).token || '');
  const v = await verifyDownloadToken(env.CRON_SECRET || '', token);

  // Language picked at checkout drives copy AND file variant; fall back to uk.
  const lang = (v.lang || DEFAULT_LANG).toLowerCase();
  const c = COPY[lang] || COPY[DEFAULT_LANG];

  if (!v.ok) {
    if (v.reason === 'expired') return gone(c.expired);
    return new Response('Invalid link.', { status: 403 });
  }

  // The gate: no ?go=1 → HTML page, no counter tick. This is what Gmail /
  // link previewers hit; they never follow the download button.
  if (url.searchParams.get('go') !== '1') {
    // head() reads only R2 metadata — no bytes transferred, no counter tick —
    // so the page can show the real size without costing the buyer an attempt.
    let sizeLabel: string | undefined;
    try {
      const meta = await env.PDF_BUCKET.head(fileKey(lang));
      if (meta?.size) sizeLabel = formatSize(meta.size, lang);
    } catch { /* size is a nicety — never block the download page over it */ }
    return gatePage(url, c, sizeLabel);
  }

  // Real download path — counter first (so a bug in R2 fetch doesn't let
  // someone bypass the cap).
  const counterKey = `dl-count/${v.sig}`;
  const cur = await env.PDF_BUCKET.get(counterKey);
  const n = cur ? parseInt(await cur.text(), 10) || 0 : 0;
  if (n >= MAX_DOWNLOADS) return gone(c.limit);
  await env.PDF_BUCKET.put(counterKey, String(n + 1));

  const obj = await env.PDF_BUCKET.get(fileKey(lang));
  if (!obj) return new Response('File temporarily unavailable.', { status: 503 });

  const dlName = DL_NAME_BY_LANG[lang] || DL_NAME_BY_LANG[DEFAULT_LANG];
  return new Response(obj.body, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': `attachment; filename="${dlName}"`,
      'content-length': String(obj.size),
      'cache-control': 'no-store',
    },
  });
};

/**
 * Mail clients, antivirus scanners and link checkers probe URLs with HEAD.
 * Without a handler Pages answered 404, so a perfectly good download link
 * looked broken to them. Answer with the same headers the GET would send,
 * minus the body — and without touching the download counter.
 */
export const onRequestHead: PagesFunction<Env> = async ({ request, params, env }) => {
  const url = new URL(request.url);
  const v = await verifyDownloadToken(env.CRON_SECRET || '', String((params as any).token || ''));
  if (!v.ok) return new Response(null, { status: v.reason === 'expired' ? 410 : 403 });

  const lang = (v.lang || DEFAULT_LANG).toLowerCase();
  if (url.searchParams.get('go') !== '1') {
    return new Response(null, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow' } });
  }
  const meta = await env.PDF_BUCKET.head(fileKey(lang));
  if (!meta) return new Response(null, { status: 503 });
  return new Response(null, {
    status: 200,
    headers: {
      'content-type': 'application/pdf',
      'content-length': String(meta.size),
      'cache-control': 'no-store',
    },
  });
};
