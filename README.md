# Bento Cake by TROUBLEBABA — landing page

Premium static landing page for a $20 PDF recipe collection ("Bento Cake by TROUBLEBABA — 10 bento cake recipes"). Audience: pastry chefs in Ukraine, Poland, EU.

**Live:** https://troublebaba.com

## Stack

- **Astro 6** (static output)
- **Tailwind CSS v4** (`@theme { --color-* }` tokens in `src/styles/global.css`)
- **i18n** — client-side, 4 languages (uk / ru / pl / en) via `src/i18n/translations.js`
- **Deployment** — GitHub Pages via Actions (`.github/workflows/deploy.yml`)

## Commands

```sh
npm install           # install dependencies
npm run dev           # local dev server at http://localhost:4321
npm run build         # production build → ./dist/
npm run preview       # preview the production build
npm run og:rebuild    # regenerate public/images/og-cover.webp (1200×630)
```

## Project structure

```
bentocake-landing/
├── public/                       Static assets served as-is
│   ├── images/                   Product / hero / recipe photos
│   ├── favicon.svg / .ico
│   ├── apple-touch-icon.png      (generated, 180×180)
│   ├── site.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── build-og-cover.mjs        Generates 1200×630 OG image via sharp
├── src/
│   ├── config/
│   │   └── site.js               ⭐ Single source of truth for all constants
│   ├── i18n/
│   │   └── translations.js       Per-language text (uk/ru/pl/en) + recipes_data + faq_items
│   ├── layouts/
│   │   └── Layout.astro          <head>: meta, OG, canonical, hreflang, JSON-LD
│   ├── pages/
│   │   ├── index.astro           Main landing (single file, ~2000 lines)
│   │   ├── 404.astro             Localized, noindex
│   │   ├── privacy.astro         Localized via JS
│   │   └── terms.astro           Localized via JS
│   ├── scripts/
│   │   └── legal-i18n.ts         Shared i18n bootstrap for 404/privacy/terms
│   └── styles/
│       └── global.css            Tailwind + custom utilities + animations
└── .github/workflows/deploy.yml  GitHub Pages CI
```

## Where to change things

| Want to change… | Edit | Notes |
|---|---|---|
| Price ($20) | `src/config/site.js` → `SITE.price` | Also reflected in JSON-LD Product offer |
| Currency | `src/config/site.js` → `SITE.currency` | |
| Gumroad / payment URL | `src/config/site.js` → `SITE.paymentUrl` | TODO marker until final link |
| Contact email | `src/config/site.js` → `SITE.contactEmail` | Used on /privacy and /terms |
| Bonus counter ("осталось 15 мест") | `src/config/site.js` → `BONUS_REMAINING` | Set 0 to grey out the bonus block |
| Total bonus spots | `src/config/site.js` → `BONUS_TOTAL` | |
| OG image | regenerate via `npm run og:rebuild` | Source: `public/images/hero-cake.webp` |
| Meta title / description per language | `src/i18n/translations.js` → `meta.uk` / `.ru` / `.pl` / `.en` | |
| Recipe names | `src/i18n/translations.js` → `recipes_data` per language | Array of `{ name, desc }` |
| FAQ Q&A | `src/i18n/translations.js` → `faq_items` per language | Also feeds FAQPage JSON-LD |
| Privacy / Terms text | `src/i18n/translations.js` → `privacy_sections` / `terms_sections` | Array of `{ h, p }`, supports `{EMAIL}` placeholder |
| Section text on the landing | `src/i18n/translations.js` → keys with `data-i18n="..."` in `index.astro` | |
| Theme color / favicon color | `src/config/site.js` → `SITE.themeColor`; `public/favicon.svg` | |
| Google Analytics ID | `src/config/site.js` → `SITE.gaId` | Set to `''` to disable. Tag loads from Layout, hits every page. |
| Hero / recipe photos | `public/images/` | Reference relatively in HTML: `images/foo.webp` |

## Adding a new language

1. Add a new block in `src/i18n/translations.js` under `t.xx = { ... }` mirroring an existing one.
2. Add `xx` to `SITE.supportedLangs` in `src/config/site.js`.
3. Add `xx: { html: 'xx', og: 'xx_XX' }` to `LOCALES` in `src/config/site.js`.
4. Add the new code to the language dropdown markup in `src/pages/index.astro` (`#lang-menu`, mobile menu).

## Bonus counter

The bonus section animates a counter from `BONUS_TOTAL` (20) down to `BONUS_REMAINING` (currently 15) when scrolled into view. To update sales status:

1. Edit `BONUS_REMAINING` in `src/config/site.js`
2. Commit, push — GitHub Actions deploys in ~1 min
3. When `BONUS_REMAINING <= 0`, the block automatically greys out, badge shows "Бонус закончился", CTA becomes inactive

## SEO checklist

- ✅ Per-page `<link rel="canonical">` (Layout.astro picks up `path` prop)
- ✅ `hreflang` alternates on home (uk = root, ru/pl/en via `?lang=xx`)
- ✅ JSON-LD: Organization + WebSite always; Product + FAQPage on home; BreadcrumbList on legal pages
- ✅ Open Graph image 1200×630 in WebP
- ✅ Twitter `summary_large_image` card
- ✅ Favicon + apple-touch-icon + webmanifest + `theme-color`
- ✅ `sitemap.xml` with hreflang alternates
- ✅ `robots.txt` — allows all, links sitemap

## Monobank checkout (Cloudflare Pages Functions)

The site processes payments through **Monobank Acquiring API** via Cloudflare Pages Functions living next to the static site (no separate worker).

### Endpoints

| Route | Purpose |
|---|---|
| `POST /api/checkout/create` | Creates an invoice, returns `{ pageUrl, invoiceId }`. Client redirects `window.location` to `pageUrl`. |
| `GET  /api/checkout/status?invoiceId=…` | Proxies to Monobank status. Used by `/thank-you` to verify payment server-side. |
| `POST /api/checkout/webhook` | Receives Monobank status callbacks. Verifies ECDSA `X-Sign` via Web Crypto. Logs to CF Workers logs (extend with email delivery here). |

### Required environment variables

Add these in Cloudflare Pages dashboard → your project → **Settings → Environment variables → Production** (also set for Preview if you use it):

| Variable | Value | Notes |
|---|---|---|
| `MONOBANK_TOKEN` | Merchant X-Token from https://web.monobank.ua (Мерчант) | Required — secret. Without this, `/api/checkout/create` returns 502. |
| `MONOBANK_PUBKEY` | Base64 PEM key from `GET /api/merchant/pubkey` (optional) | Optional optimisation — avoids a key fetch per webhook cold start. Refreshes automatically if mismatch. |
| `MONOBANK_API` | `https://api.monobank.ua` | Optional. Default = production. Use `https://api.monobank.ua` for test tokens too (Monobank uses same host). |
| `SITE_URL` | `https://troublebaba.com` | Optional. Defaults to request origin. |

### Test tokens

Get a test token from https://api.monobank.ua/ (scan QR with monobank app). Test payments do NOT charge a real card. Production tokens are issued from web.monobank.ua (Мерчант section).

### Webhook URL

The create endpoint registers `webHookUrl = ${origin}/api/checkout/webhook`. Make sure your Monobank merchant settings allow that URL (Mono accepts any HTTPS URL on the public internet).

### Price

Currently set in code at `functions/api/checkout/create.ts` → `PRICE_UAH_KOPECKS = 85000` (850 UAH ≈ $20 at rate 42.5). Edit when FX moves materially or you want a round number. Currency is UAH (ccy: 980).

### PDF delivery

The webhook currently only **logs** successful payments to Cloudflare logs. Actual PDF email delivery is a TODO inside `functions/api/checkout/webhook.ts → handleSuccess()`. For now, manually email the PDF after seeing the webhook log entry.

To automate, wire Resend (https://resend.com) inside `handleSuccess` — they have a free tier (3k emails/month). Customer email is in `customerEmails` field that we pass when creating the invoice.

### Local testing

```sh
npx wrangler pages dev dist --binding MONOBANK_TOKEN=test_token_xxx
```

This runs Pages Functions locally against the built `dist/` directory.

## Deployment

**Production: Cloudflare Pages** — auto-builds on every push to `main`.

- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Node version:** 22 (set via `NODE_VERSION=22` env var in Pages settings)
- **Custom domains:** `troublebaba.com` (apex) + `www.troublebaba.com` (redirects to apex via `public/_redirects`)

Cloudflare Pages picks up:
- `public/_headers` — cache + security headers
- `public/_redirects` — www → apex + legacy GitHub Pages redirect
- `public/sitemap.xml`, `robots.txt`, `site.webmanifest` — served as-is

**Legacy GitHub Pages workflow** (`.github/workflows/deploy.yml`) is kept as a manual-trigger backup. To deploy to GitHub Pages from CI: Actions → "Deploy to GitHub Pages (manual backup)" → Run workflow.

To change the domain: update `SITE.url` in `src/config/site.js`, update `Sitemap:` URL in `public/robots.txt`, update sitemap.xml URLs, update Cloudflare Pages custom-domain settings.

## Outstanding TODOs

Search the codebase for `TODO:` to see all. The big ones:

- `SITE.contactEmail` — verify real address before launch
- `SITE.paymentUrl` — replace placeholder Gumroad link with the real one
- Real testimonials (the section was removed; if reinstated, must use real data)
- Analytics (no GA / Pixel currently wired; add via env when ready)

## Don't break

- Do not change the design tokens in `src/styles/global.css` without checking the whole page
- Do not edit hero-cake.webp — it's the source for `og-cover.webp`
- Do not delete `<base href={BASE} />` in Layout.astro — all relative image paths depend on it for GitHub Pages
- Do not refactor `index.astro` into components without testing the i18n loop (`data-i18n` selector queries the whole document)
