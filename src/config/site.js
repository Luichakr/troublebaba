// src/config/site.js
// Single source of truth for all site-wide constants.
// Update values here — they propagate to Layout, meta, JSON-LD, footer, buttons, etc.

export const SITE = {
  // Brand & product
  name:        'TROUBLEBABA',
  productName: 'Bento Cake by TROUBLEBABA',

  // Production URL (no trailing slash). Site is hosted on Cloudflare Pages
  // and bound to the apex domain troublebaba.com.
  url:         'https://troublebaba.com',

  // Contact
  // TODO: INSERT VERIFIED CONTACT EMAIL — current value is placeholder
  contactEmail: 'hello@troublebaba.com',

  // Social — main profile URLs
  instagramUrl: 'https://instagram.com/troublebaba',
  tiktokUrl:    'https://tiktok.com/@troublebaba',
  youtubeUrl:   'https://youtube.com/@troublebaba',
  facebookUrl:  'https://facebook.com/troublebaba',

  // YouTube channel ID (UC…24-char) — used by the shorts cron to fetch RSS.
  // The cron actually reads env.YOUTUBE_CHANNEL_ID (set in CF Pages settings);
  // this constant is kept for reference and any future build-time use.
  youtubeChannelId: 'UCGJX7K5IHIWmTPKjMLTXd8w',

  // Featured posts shown in the "Соцсети TROUBLEBABA" home section.
  // TODO: replace with REAL deep-links to specific Reels / TikTok video / YouTube video.
  // Until real URLs are provided, each falls back to the main profile.
  socialPosts: {
    instagram: 'https://instagram.com/troublebaba',
    tiktok:    'https://tiktok.com/@troublebaba',
    youtube:   'https://youtube.com/@troublebaba',
  },

  // Payment
  // TODO: INSERT FINAL GUMROAD / PAYMENT LINK
  paymentUrl:   'https://gumroad.com/l/bentocake',

  // Commerce
  price:       20,            // full bundle — all 10 recipes
  priceSingle: 5,             // one recipe bought separately (ladder entry point)
  currency:    'USD',
  // 10 singles = $50 → bundle $20 saves $30. Used for the price-anchor on recipe pages.
  get bundleSaving() { return this.priceSingle * 10 - this.price; },

  // === Paddle (Merchant of Record) ===
  // Client-side token is PUBLIC by design (embedded in Paddle.js on the frontend).
  // Secrets (PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, RESEND_API_KEY) live in
  // Cloudflare Pages env vars — never in this file.
  paddle: {
    environment: 'sandbox',                       // 'sandbox' | 'production'
    clientToken: 'test_6b6f239298644d456e6a612754e',
    priceBundle: 'pri_01kxe47ghn2jy5eream7989qqz', // $20 — all 10 recipes (one-time)
    priceSingle: '',                              // filled once per-recipe prices exist
  },
  // Download link policy (shown to buyers + enforced by /d/<token>).
  download: { expiryDays: 7, maxDownloads: 3 },

  // Cloudflare Turnstile (bot protection on public forms). siteKey is PUBLIC.
  // The secret lives in CF Pages env as TURNSTILE_SECRET. Empty siteKey =
  // widget off (forms still work; server verify is skipped until secret is set).
  turnstile: { siteKey: '' },

  // === Pre-launch mode ===
  // While true: "Buy" buttons collect e-mails for a launch reminder instead of
  // opening checkout. On launch day flip to false → buttons go live (Monobank).
  presaleMode:  true,
  salesStartISO: '2026-07-10',   // sales start date (shown in banner/notify copy)

  // i18n
  defaultLang:    'uk',
  supportedLangs: ['uk', 'ru', 'pl', 'en', 'es', 'de', 'fr', 'it', 'pt'],

  // Open Graph — 1200×630 horizontal cover composited via scripts/build-og-cover.mjs
  // (run `npm run og:rebuild` to regenerate from public/images/hero-cake.webp).
  ogImage:       '/images/og-cover.webp',
  ogImageWidth:  1200,
  ogImageHeight: 630,
  ogImageType:   'image/webp',

  // Browser chrome
  themeColor: '#F5EFE8',

  // Analytics — Google Analytics 4 Measurement ID.
  // Set to empty string '' to disable analytics in production.
  gaId: 'G-6JQ23T5RWN',
};

// === Bonus counter ===
// Меняй это число вручную когда продаются места.
// Стартует с BONUS_TOTAL, на странице анимацией откручивается до BONUS_REMAINING.
// Когда станет 0 — блок становится серым, кнопка → "Бонус закончился".
export const BONUS_TOTAL     = 20;
export const BONUS_REMAINING = 15;

// Locale → BCP 47 + OG locale mapping
export const LOCALES = {
  uk: { html: 'uk',    og: 'uk_UA' },
  ru: { html: 'ru',    og: 'ru_RU' },
  pl: { html: 'pl',    og: 'pl_PL' },
  en: { html: 'en',    og: 'en_US' },
  es: { html: 'es',    og: 'es_ES' },
  de: { html: 'de',    og: 'de_DE' },
  fr: { html: 'fr',    og: 'fr_FR' },
  it: { html: 'it',    og: 'it_IT' },
  pt: { html: 'pt',    og: 'pt_BR' },
};

// Build a canonical/absolute URL for a given pathname (no leading slash handling needed).
// Example: canonicalFor('privacy') → 'https://luichakr.github.io/troublebaba/privacy'
export function canonicalFor(pathname = '') {
  const base = SITE.url.replace(/\/$/, '');
  if (!pathname || pathname === '/' || pathname === '') return base + '/';
  return base + '/' + pathname.replace(/^\/+/, '').replace(/\/$/, '');
}
