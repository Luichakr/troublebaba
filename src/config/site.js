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

  // Social
  instagramUrl: 'https://instagram.com/troublebaba',
  tiktokUrl:    'https://tiktok.com/@troublebaba',
  youtubeUrl:   'https://youtube.com/@troublebaba',
  facebookUrl:  'https://facebook.com/troublebaba',

  // Payment
  // TODO: INSERT FINAL GUMROAD / PAYMENT LINK
  paymentUrl:   'https://gumroad.com/l/bentocake',

  // Commerce
  price:    20,
  currency: 'USD',

  // i18n
  defaultLang:    'uk',
  supportedLangs: ['uk', 'ru', 'pl', 'en'],

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
};

// Build a canonical/absolute URL for a given pathname (no leading slash handling needed).
// Example: canonicalFor('privacy') → 'https://luichakr.github.io/troublebaba/privacy'
export function canonicalFor(pathname = '') {
  const base = SITE.url.replace(/\/$/, '');
  if (!pathname || pathname === '/' || pathname === '') return base + '/';
  return base + '/' + pathname.replace(/^\/+/, '').replace(/\/$/, '');
}
