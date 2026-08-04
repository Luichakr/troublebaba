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
  // We only sell the full 10-recipe bundle. Per-recipe / mini-bundle sales
  // are OFF (owner decision). `priceSingle` + `bundleSaving` are kept as
  // constants for legacy backend code paths that are no longer wired to any
  // customer CTA; do not surface them in UI.
  price:       20,            // full bundle — all 10 recipes
  priceSingle: 5,             // legacy — not sold, unused in UI
  currency:    'USD',
  get bundleSaving() { return this.priceSingle * 10 - this.price; },

  // === Paddle (Merchant of Record) ===
  // Client-side token is PUBLIC by design (embedded in Paddle.js on the frontend).
  // Secrets (PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, RESEND_API_KEY) live in
  // Cloudflare Pages env vars — never in this file.
  paddle: {
    // LIVE.
    // Product: pro_01kz6tacby2h5y54q0khk6cx0n (Bento Cake — 10 recipes (PDF))
    // Price:   pri_01kz6tq6zt1jk79g9197shxcz1
    //          base $20 USD + overrides UA 800 UAH, PL 80 PLN, DE/FR €18
    // Sandbox kept commented below for quick revert if needed.
    environment: 'production',                     // 'sandbox' | 'production'
    clientToken: 'live_ce46dcadd5e72f0a4253adbbe91',
    priceBundle: 'pri_01kz6tq6zt1jk79g9197shxcz1',
    // Sandbox fallback (do not delete — reference for regression testing):
    //   environment: 'sandbox'
    //   clientToken: 'test_6b6f239298644d456e6a612754e'
    //   priceBundle: 'pri_01kxe47ghn2jy5eream7989qqz'
    priceSingle: '',                              // filled once per-recipe prices exist
  },
  // Download link policy (shown to buyers + enforced by /d/<token>).
  download: { expiryDays: 7, maxDownloads: 3 },

  // Languages the PDF is actually translated into. Other UI locales still get
  // full-site SEO, but the "PDF available in ..." notice tells buyers which
  // languages they can pick at checkout.
  pdfLanguages: ['uk', 'ru', 'en', 'pl'],

  // Post-purchase bonus: closed Telegram community for buyers. Owner creates
  // the chat/channel; when the invite URL is stored in Pages env as
  // TELEGRAM_COMMUNITY_URL, flip `community.enabled` to true and the bonus
  // card appears on the site AND the link is included in the delivery email.
  community: { enabled: false },

  // Cloudflare Turnstile (bot protection on public forms). siteKey is PUBLIC.
  // The secret lives in CF Pages env as TURNSTILE_SECRET. Empty siteKey =
  // widget off (forms still work; server verify is skipped until secret is set).
  turnstile: { siteKey: '0x4AAAAAAD2eDZRgRtekKm70' },

  // === Pre-launch mode ===
  // While true: "Buy" buttons collect e-mails for a launch reminder instead of
  // opening checkout. On launch day flip to false → buttons go live (Monobank).
  presaleMode:  false,
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
// BONUS_TOTAL is the launch-bonus slots (first-N promo). The counter is now
// LIVE: the client fetches /api/bonus/count on load and animates from TOTAL
// down to (TOTAL − sold). BONUS_REMAINING below is the SSR/no-JS fallback
// only — real value comes from the endpoint. Server side lives in
// functions/api/bonus/count.ts (keep TOTAL there in sync).
export const BONUS_TOTAL     = 50;
export const BONUS_REMAINING = 50;

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
