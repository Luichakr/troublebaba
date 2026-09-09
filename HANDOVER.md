# TROUBLEBABA · Bento Cake Landing — Handover

> Knowledge base for a new AI agent + owner picking up this project on a fresh
> computer. Read this file top-to-bottom before touching anything.
> Updated: 9 September 2026.

**Product:** a paid PDF cookbook — 10 bento cake recipes — sold globally.
**Price:** $20 USD base, localized: 800 ₴ / 80 zł / €18 / $20 depending on visitor's language.
**Owner:** Ukrainian pastry blogger (@troublebaba on Instagram, 100k+ followers).

## 1 · Project state

The site is **LIVE at [troublebaba.com](https://troublebaba.com)** and processing real payments via Lemon Squeezy.

**What is built and working:**
- 9-language i18n (uk / ru / pl / en / es / de / fr / it / pt), full SEO with canonical trailing slashes and hreflang.
- Per-locale currency display on landing (UAH / USD / PLN / EUR).
- Price anchor + `-33%` badge (bundle-only, no single-recipe sales).
- Live-updating "first-50 bonus" counter — reads real R2 counter, decrements on each successful LS transaction.
- 6 "safe" PDF preview spreads (cover, welcome, product-guide chapters, tool inventory, scaling table) — no recipe method leaked.
- 10 per-recipe SEO pages under `/recipes/<slug>/` and `/<lang>/recipes/<slug>/` with photo + selling copy + ingredient names (no grams).
- Horizontal-scroll "Other flavors" row on every recipe page.
- 51 customer reviews per language (9 JSON files) with AggregateRating + individual Review JSON-LD in Product schema.
- Blog: 15–16 articles per language (varies by locale), blog rule: "never teaches cooking technique" — see `CLAUDE.md`.
- Turnstile bot protection on public forms (waitlist, free-recipe).
- Lemon Squeezy checkout via redirect: the buy button links to the LS-hosted checkout page for the visitor's currency. No on-site checkout form.
- Post-purchase email from `hello@troublebaba.com` (Resend + own domain verified) with signed download link → gated `/d/<token>` endpoint → PDF served from private R2. Cap: 3 downloads / 7 days per link. PDF variant chosen by language embedded in token.
- Cloudflare Pages Functions handle: waitlist, free-recipe lead, LS webhook, Paddle webhook (legacy), R2 delivery, bonus counter, YouTube shorts cron, event tracking, geo-detection.
- Geo-detection: `/api/geo` returns visitor country from `cf-ipcountry` header. Used for `HIDE_BY_COUNTRY` (hides UA-only PDF download button from RU IPs).
- IndexNow: `npm run indexnow` submits changed pages to Bing/Yandex. Delta computed from visible page text, not URL list. State file `.indexnow-state.json`.
- `llms.txt` generator: dynamic Astro route pulling 9 prices, 10 flavors, 16 blog articles for AI search engines.

## 2 · Tech stack

- **Framework:** Astro 6 (static output; server-only stuff runs as Cloudflare Pages Functions).
- **Styling:** Tailwind 4 via `@tailwindcss/vite`. Fonts loaded from Google Fonts:
  Playfair Display (`.font-cabinet`), Manrope (`.font-outfit`, body), Caveat (`.font-signature`).
  Note: CSS class names say `cabinet` and `outfit` but the actual fonts are Playfair Display and Manrope. This is intentional — class names stayed from the original design tokens.
- **Hosting:** Cloudflare Pages (project `troublebaba`), auto-deploys on push to `main` on GitHub `Luichakr/troublebaba`.
- **Serverless:** Cloudflare Pages Functions in `functions/`.
- **Storage:**
  - R2 bucket `troublebaba-files` — private, holds `bento-cake-<lang>.pdf` (uk/ru/en/pl) + counter objects.
  - D1 database `troublebaba-events` — event tracking (clicks, page views, geo), waitlist emails, free-recipe leads, YouTube-shorts cache.
- **Payments:** **Lemon Squeezy is the active Merchant of Record** — four stores,
  one per display currency (UAH / USD / PLN / EUR), picked by the page language
  the buyer clicked from. All four stores share one webhook secret and POST to
  `/api/lemonsqueezy/webhook`. Paddle Billing is wired in parallel (sandbox only, unused).
- **Email:** Resend, sending from a verified custom domain `hello@troublebaba.com`.
  Delivery email copy lives in `functions/_lib/deliver-copy.ts` (4 languages: uk/ru/en/pl).
- **Bot protection:** Cloudflare Turnstile.

## 3 · Repo layout (files you'll touch)

```
src/
  config/site.js           — single source of truth for prices, URLs, feature flags,
                             LS store IDs, checkout URLs
  i18n/translations.js     — 9-language string table + BONUS_TOTAL constant
  data/flavors.js          — 10 recipes: names, layers, lead copy, ingredient lists
  data/flavors.<lang>.js   — es/de/fr/it/pt overrides (name/layers/lead only)
  data/reviews/<lang>.json — 51 reviews per language with name + text + rating
  data/flavor-review-keys.js — word roots for matching reviews to flavor pages
  components/
    HomePage.astro         — main landing (~2000 lines)
    FlavorPage.astro       — /recipes/<slug>/ template
    SiteHeader.astro       — language switcher (availableLangs/fallbackPath props
                             for articles not in all locales)
  layouts/
    Layout.astro           — <head>, canonical, hreflang, Product + Review JSON-LD,
                             GA4 loader, OG tags
  content/blog/<lang>/     — Markdown blog articles (15-16 per language)
  pages/
    blog/[slug].astro      — uk blog pages
    [lang]/blog/[slug].astro — other-locale blog pages
    recipes/[slug].astro   — uk recipe pages
    [lang]/recipes/[slug].astro — other-locale recipe pages
    llms.txt.ts            — generated llms.txt for AI search engines

functions/                 — Cloudflare Pages Functions (see §6)
scripts/
  indexnow-submit.mjs     — IndexNow delta submission (--wait-live, --dry-run, --all)

public/
  images/                  — hero + recipe cover + author + PDF preview spreads
  _headers                 — CSP + HSTS + caching headers
  _redirects               — www→apex + old-URL redirects (cream-for-lettering → which-cream)
  indexnow-key.txt         — IndexNow verification key

CLAUDE.md                  — AI agent instructions, blog rules, design constraints
DESIGN.md                  — design system: palette (#8B7355 accent), fonts, density
TODO.md (in parent Торты/) — current backlog (25 open tasks as of 9 Sept 2026)
```

## 4 · Environment variables (Cloudflare Pages)

Every secret listed here MUST live in **CF Pages → Settings → Variables and secrets**
for the `troublebaba` project.

| Name | Type | What for |
|------|------|----------|
| `LS_API_KEY` | Secret | Lemon Squeezy server API key (for order lookups). |
| `LS_WEBHOOK_SECRET` | Secret | Signature for `/api/lemonsqueezy/webhook`. Shared across all 4 stores. |
| `PADDLE_ENV` | Plaintext | `sandbox` — Paddle is wired but not active. |
| `PADDLE_API_KEY` | Secret | Paddle server API key (sandbox, unused). |
| `PADDLE_WEBHOOK_SECRET` | Secret | Signature for `/api/paddle/webhook` (sandbox). |
| `TURNSTILE_SECRET` | Secret | Server-side Turnstile verify. Site key is in `src/config/site.js`. |
| `RESEND_API_KEY` | Secret | Email delivery (Resend). |
| `RESEND_FROM` | Plaintext | `Bento Cake by TROUBLEBABA <hello@troublebaba.com>`. |
| `CRON_SECRET` | Secret | Signs `/d/<token>` download links. **Do not rotate** — old links break. |
| `ADMIN_PASS` | Secret | Password gate for `/admin/stats` dashboard. |
| `YOUTUBE_CHANNEL_ID` | Secret | Cron pulls latest YouTube shorts. |
| `TELEGRAM_COMMUNITY_URL` | Secret | Not set yet. When set + `SITE.community.enabled = true`, the buyers' Telegram invite appears in the delivery email. |

Also in `wrangler.toml`:
- R2 binding `PDF_BUCKET` → bucket `troublebaba-files`.
- D1 binding `DB` → database `troublebaba-events`.

## 5 · Local dev on a fresh Mac

```bash
git clone git@github.com:Luichakr/troublebaba.git
cd troublebaba
npm install          # Node ≥ 22.12
npm run dev          # http://localhost:4321
```

To build for production locally:
```bash
npm run build        # produces dist/, 321 pages
npm run indexnow     # submit changed pages to Bing/Yandex (after deploy)
```

**Wrangler CLI (for R2 uploads, one-off ops):**
```bash
brew install wrangler        # or: npm i -g wrangler
wrangler login               # OAuth flow → sign in as leechansb@gmail.com
                             # NOT bidbidders1 — that's a different CF account.
wrangler whoami              # confirm account = leechansb@gmail.com
                             # account ID f87fe24ddb19df03a7d7e8fb9b4e86e6
```

## 6 · Cloudflare Pages Functions map

Each file below is auto-deployed as an edge function on push.

| Endpoint | File | Purpose |
|---|---|---|
| `POST /api/waitlist` | `functions/api/waitlist.ts` | Presale email capture. Verifies Turnstile. Writes to D1. |
| `POST /api/free-recipe` | `functions/api/free-recipe.ts` | Free-recipe lead magnet. Turnstile + D1. |
| `POST /api/track` | `functions/api/track.ts` | Click/event tracking → D1. Stores `ip_country` from `cf.country`. |
| `GET /api/geo` | `functions/api/geo.ts` | Returns visitor country code from `cf-ipcountry`. Used client-side for HIDE_BY_COUNTRY. |
| `POST /api/lemonsqueezy/webhook` | `functions/api/lemonsqueezy/webhook.ts` | **Active payment processor.** Verifies LS signature → sends delivery email → increments bonus counter (idempotent per order ID). |
| `POST /api/paddle/webhook` | `functions/api/paddle/webhook.ts` | Legacy (sandbox). Same flow as LS webhook but for Paddle. |
| `GET /d/<token>` | `functions/d/[token].ts` | Verifies signed token (HMAC via `CRON_SECRET`) + expiry + per-link download cap (3× / 7 days), streams `bento-cake-<lang>.pdf` from R2. |
| `GET /api/bonus/count` | `functions/api/bonus/count.ts` | Returns `{ total: 50, sold, remaining }` — read from R2 counter. 30-second edge cache. |
| `GET /api/cron/youtube-sync` | `functions/api/cron/youtube-sync.ts` | Ran by an external cron on the owner's Mac; refreshes YouTube shorts cache in D1. |
| `GET /api/shorts/*` | `functions/api/shorts/*.ts` | Serves the shorts feed to the homepage widget. |
| `GET /api/admin/stats` | `functions/api/admin/stats.ts` | Password-gated dashboard reads. |
| Utilities | `functions/_lib/*.ts` | Signed-token helpers (`dl.ts`), LS/Paddle sig verification, Resend wrapper (`resend.ts`), Turnstile verify (`turnstile.ts`), delivery email copy (`deliver-copy.ts` — 4 langs). |

## 7 · Owner action items

1. **GitHub token scope `workflow`** — IndexNow CI/CD workflow file exists locally but can't be pushed. Either add via GitHub web UI or grant the token `workflow` scope.
2. **YouTube video descriptions** — 240 videos with zero outbound links to troublebaba.com. Biggest authority-building opportunity.
3. **Instagram/TikTok screenshot block** — real comment screenshots for social proof on homepage.
4. **LS payout currencies** — all 4 stores use one PLN bank account, causing double conversion on UAH/USD/EUR sales (~1-2% per hop). A USD account (Wise/Revolut) would save one conversion.

Full backlog: `TODO.md` in the parent `Торты/` directory (25 open tasks as of 9 Sept 2026).

## 8 · Lemon Squeezy store structure

| Store | Currency | Languages | Checkout URL pattern |
|---|---|---|---|
| `troublebaba` (446675) | UAH 800 | uk | `troublebaba.lemonsqueezy.com/checkout/buy/…` |
| `troublebaba-ru` | USD 20 | ru | `troublebaba-ru.lemonsqueezy.com/checkout/buy/…` |
| `troublebaba-pl` | PLN 80 | pl | `troublebaba-pl.lemonsqueezy.com/checkout/buy/…` |
| `troublebaba-en` | EUR 18 | en, es, de, fr, it, pt | `troublebaba-en.lemonsqueezy.com/checkout/buy/…` |

All stores share one `LS_WEBHOOK_SECRET`. The webhook at `/api/lemonsqueezy/webhook` handles all four.
Checkout URLs are defined in `src/config/site.js` → `checkout.checkoutByLang`.

## 9 · Fresh AI-agent setup

The new agent must have Cloudflare MCP access to work autonomously. In a terminal:

```bash
claude mcp list                   # confirm servers are registered
# authorize the 4 Cloudflare servers via OAuth:
claude mcp login plugin:cloudflare:cloudflare-api
claude mcp login plugin:cloudflare:cloudflare-bindings
claude mcp login plugin:cloudflare:cloudflare-builds
claude mcp login plugin:cloudflare:cloudflare-observability
```
Each command opens a browser tab — sign in as **leechansb@gmail.com** and Allow.

Also read before starting:
- `CLAUDE.md` — agent instructions, blog content rules, design constraints, skill table.
- `DESIGN.md` — palette, fonts, spacing, motion guidelines.
- `TODO.md` (in parent `Торты/`) — current backlog with priorities.

## 10 · Common commands cheatsheet

```bash
npm run dev                                     # dev server, HMR
npm run build && du -sh dist                    # produce prod bundle
npm run indexnow                                # submit changed pages (after deploy)
npm run indexnow -- --dry-run                   # preview what would be submitted
npm run indexnow -- --all                       # force-submit all pages

# R2 (owner-side)
wrangler r2 object put "troublebaba-files/<key>" --file <path> --remote
wrangler r2 object delete "troublebaba-files/<key>" --remote

# Git flow — always push to main; Pages auto-deploys
git add <files> && git commit -m "..." && git push origin main

# Deployment health check
curl -sI https://troublebaba.com/api/bonus/count
```

## 11 · Debugging

- **Deploy failed?** Cloudflare Pages → project `troublebaba` → Deployments → view logs.
- **Function 500?** MCP `query_worker_observability` gets structured logs.
- **Email not arriving?** Check Resend dashboard → domain must be `troublebaba.com` (verified). If sends fail, DKIM/SPF might have drifted — re-verify via Resend UI.
- **Turnstile 403 in prod but not in dev?** Local dev has no `TURNSTILE_SECRET` set → the verify wrapper returns `true` (fail-open). Production has the secret → fails closed.
- **IndexNow delta empty after text change?** Likely Cloudflare Email Obfuscation: the script normalizes `[email protected]` patterns. Run `npm run indexnow -- --dry-run` to check.

## 12 · Repository essentials

- **Git remote:** `git@github.com:Luichakr/troublebaba.git` (branch `main`).
- **Cloudflare account:** `leechansb@gmail.com`, ID `f87fe24ddb19df03a7d7e8fb9b4e86e6`.
- **Pages project:** `troublebaba`.
- **Domain:** `troublebaba.com` (apex + `www.` redirects to apex).
