# TROUBLEBABA · Bento Cake Landing — Handover

> Knowledge base for a new AI agent + owner picking up this project on a fresh
> computer. Read this file top-to-bottom before touching anything.

**Product:** a paid PDF cookbook — 10 bento cake recipes — sold globally.
**Price:** $20 USD base, localized: 800 ₴ / 80 zł / €18 / $20 depending on visitor's language.
**Owner:** Ukrainian pastry blogger (@troublebaba on Instagram, 100k+ followers).

## 1 · Project state at handover

The site is **LIVE at [troublebaba.com](https://troublebaba.com)** in a "live-test" phase:
- Real customers can go through the full purchase flow.
- Paddle is in **sandbox** (test cards only, no real money). Owner needs to complete Paddle KYC to accept real payments — see §7.
- Once KYC lands: flip nothing else, real cards will start working (Paddle switches sandbox → production behind the same integration).

**What is built and working:**
- 9-language i18n (uk / ru / pl / en / es / de / fr / it / pt), full SEO.
- Per-locale currency display on landing (UAH / RUB→USD / PLN / EUR).
- Price anchor + `-33%` badge (bundle-only, no single-recipe sales).
- Live-updating "first-50 bonus" counter — reads real R2 counter, decrements on each successful Paddle transaction.
- 6 "safe" PDF preview spreads (cover, welcome, product-guide chapters, tool inventory, scaling table) — no recipe method leaked.
- 10 per-recipe SEO pages under `/recipes/<slug>/` and `/<lang>/recipes/<slug>/` with photo + selling copy + ingredient names (no grams) + explicit "in the PDF you get X" note.
- Horizontal-scroll "Other flavors" row on every recipe page.
- **UK + RU** flavor pages have ingredient chip-lists and full "what's in the PDF" copy. Other 7 languages fall back to old shorter copy — pending translation.
- Turnstile bot protection on public forms (waitlist, free-recipe).
- Paddle-sandbox checkout at `/checkout-test`: mandatory language selection + legal-acknowledgement checkbox before Buy activates. UI language switcher (UA/RU/EN/PL) at top of that page.
- Post-purchase email from `hello@troublebaba.com` (Resend + own domain verified) with signed download link → gated `/d/<token>` endpoint → PDF served from private R2. Cap: 3 downloads / 7 days per link. PDF variant chosen by language embedded in token.
- Cloudflare Pages Functions handle: waitlist, free-recipe lead, Monobank (legacy, unused), Paddle webhook, R2 delivery, bonus counter, YouTube shorts cron.
- Telegram community bonus block: scaffolded but dormant. Enables the moment owner supplies a chat invite URL — see §7.

## 2 · Tech stack

- **Framework:** Astro 5 (static output; server-only stuff runs as Cloudflare Pages Functions).
- **Styling:** Tailwind (utility classes + a few custom fonts loaded via `@fontsource`).
- **Hosting:** Cloudflare Pages (project `troublebaba`), auto-deploys on push to `main` on GitHub `Luichakr/troublebaba`.
- **Serverless:** Cloudflare Pages Functions in `functions/`.
- **Storage:**
  - R2 bucket `troublebaba-files` — private, holds `bento-cake-<lang>.pdf` (uk/ru/en/pl) + counter objects.
  - D1 database `troublebaba-events` — event tracking, waitlist emails, free-recipe leads, YouTube-shorts cache.
- **Payments:** Paddle Billing (Merchant of Record). Currently sandbox. Real prices are USD-canonical; Paddle auto-converts at checkout.
- **Email:** Resend, sending from a verified custom domain `hello@troublebaba.com`.
- **Bot protection:** Cloudflare Turnstile.

## 3 · Repo layout (files you'll touch)

```
src/
  config/site.js           — single source of truth for prices, URLs, feature flags
  i18n/translations.js     — 9-language string table + BONUS_TOTAL constant
  data/flavors.js          — 10 recipes: names, layers, lead copy, learn bullets,
                             ingredient lists (uk+ru), "in the PDF" copy
  data/flavors.<lang>.js   — es/de/fr/it/pt overrides (name/layers/lead only)
  components/
    HomePage.astro         — main landing (long file, ~2000 lines)
    FlavorPage.astro       — /recipes/<slug>/ template
    FreeRecipe.astro       — /free-recipe/ landing (Turnstile-protected)
  pages/
    checkout-test.astro    — Paddle sandbox flow, language switcher, ack checkbox
    recipes/[slug].astro   — uk recipe pages
    [lang]/recipes/[slug].astro — other-locale recipe pages
    (blog, /shorts, /admin/stats, /about, /contact — SEO/support pages)

functions/                 — Cloudflare Pages Functions (see §6)
public/
  images/                  — hero + recipe cover + author + PDF preview spreads
  images/pdf-preview/      — 6 safe PDF page thumbnails (auto-generated, ok to
                             regenerate via scratchpad/extract-pdf-pages.py if
                             you have the PDF locally)
  _headers                 — CSP + HSTS + caching headers
  _redirects               — www→apex + old-URL redirects

wrangler.toml              — Cloudflare Pages config: bindings + non-secret env
```

## 4 · Environment variables (Cloudflare Pages)

Every secret listed here MUST live in **CF Pages → Settings → Variables and secrets**
for the `troublebaba` project. Only two are plain-text; the rest are Encrypted.

| Name | Type | What for |
|------|------|----------|
| `PADDLE_ENV` | Plaintext | `sandbox` or `production`. Flip after KYC. |
| `PADDLE_API_KEY` | Secret | Paddle server API key (for looking up customer email). |
| `PADDLE_WEBHOOK_SECRET` | Secret | Signature for `/api/paddle/webhook`. |
| `TURNSTILE_SECRET` | Secret | Server-side Turnstile verify. Site key is in `src/config/site.js`. |
| `RESEND_API_KEY` | Secret | Email delivery (Resend). |
| `RESEND_FROM` | Plaintext | `Bento Cake by TROUBLEBABA <hello@troublebaba.com>`. |
| `CRON_SECRET` | Secret | Used to sign `/d/<token>` download links. **Do not rotate** — old links break. |
| `MONOBANK_TOKEN` | Secret | Legacy, currently unused. |
| `ADMIN_PASS` | Secret | Password gate for `/admin/stats` dashboard. |
| `YOUTUBE_CHANNEL_ID` | Secret | Cron pulls latest YouTube shorts. |
| `TELEGRAM_COMMUNITY_URL` | Secret | Not set yet. When set + `SITE.community.enabled = true`, the buyers' Telegram invite appears in the delivery email + a bonus card on the site. |

Also in `wrangler.toml`:
- R2 binding `PDF_BUCKET` → bucket `troublebaba-files`.
- D1 binding `DB` → database `troublebaba-events`.

## 5 · Local dev on a fresh Mac

```bash
git clone git@github.com:Luichakr/troublebaba.git
cd troublebaba
npm install
npm run dev        # http://localhost:4321
```

To build for production locally:
```bash
npm run build      # produces dist/
```

**Wrangler CLI (for R2 uploads, one-off ops):**
```bash
brew install wrangler        # or: npm i -g wrangler
wrangler login               # OAuth flow → sign in as leechansb@gmail.com
                             # NOT bidbidders1 — that's a different CF account.
wrangler whoami              # confirm account = leechansb@gmail.com
                             # account ID f87fe24ddb19df03a7d7e8fb9b4e86e6
```

**R2 upload example:**
```bash
wrangler r2 object put "troublebaba-files/bento-cake-uk.pdf" \
  --file "/path/to/ua.pdf" --content-type application/pdf --remote
```

**MCP setup for a new Claude Code agent** — see §9.

## 6 · Cloudflare Pages Functions map

Each file below is auto-deployed as an edge function on push.

| Endpoint | File | Purpose |
|---|---|---|
| `POST /api/waitlist` | `functions/api/waitlist.ts` | Presale email capture. Verifies Turnstile. Writes to D1. |
| `POST /api/free-recipe` | `functions/api/free-recipe.ts` | Free-recipe lead magnet. Turnstile + D1. |
| `POST /api/track` | `functions/api/track.ts` | Click/event tracking → D1. Used by GA-parallel dashboard. |
| `POST /api/paddle/webhook` | `functions/api/paddle/webhook.ts` | Verifies Paddle signature → sends delivery email → increments bonus counter (idempotent per txn ID). |
| `GET /d/<token>` | `functions/d/[token].ts` | Verifies signed token (HMAC via `CRON_SECRET`) + expiry + per-link download cap (3× / 7 days), streams `bento-cake-<lang>.pdf` from R2. |
| `GET /api/bonus/count` | `functions/api/bonus/count.ts` | Returns `{ total: 50, sold, remaining }` — read from R2 counter. 30-second edge cache. |
| `POST /api/checkout/create` | `functions/api/checkout/create.ts` | Legacy Monobank invoice endpoint. No CTA reaches it now. |
| `POST /api/telegram/webhook` | `functions/api/telegram/webhook.ts` | Old Telegram-bot buy flow (bot mode, unused). |
| `GET /api/cron/youtube-sync` | `functions/api/cron/youtube-sync.ts` | Ran by an external cron on the owner's Mac; refreshes YouTube shorts cache in D1. |
| `GET /api/shorts/*` | `functions/api/shorts/*.ts` | Serves the shorts feed to the homepage widget. |
| `GET /api/admin/stats` | `functions/api/admin/stats.ts` | Password-gated dashboard reads. |
| Utilities | `functions/_lib/*.ts` | Signed-token helpers (`dl.ts`), Paddle sig verification (`paddle.ts`), Resend wrapper (`resend.ts`), Turnstile verify (`turnstile.ts`), etc. |

## 7 · Owner action items (things ONLY the owner can do)

These block real revenue. Every other pending task is code work an AI agent can do autonomously.

1. **Paddle KYC → activate production.**
   Login `vendors.paddle.com` → complete Business Verification (name / country / ID document) → Payout details (bank) → Tax info → Submit.
   Paddle review = up to 2 business days.
   After approval: change `PADDLE_ENV` from `sandbox` to `production` in CF Pages env; swap `PADDLE_API_KEY` for the production key; create a production price ID and update `SITE.paddle.priceBundle` in `src/config/site.js`.

2. **Create a closed Telegram chat/channel for buyers.**
   Set up a private Telegram group. Copy the invite link (`https://t.me/+...`).
   Give the URL to the AI agent → agent sets `TELEGRAM_COMMUNITY_URL` env in CF Pages + flips `SITE.community.enabled = true`. Bonus block goes live on the site AND the join link starts appearing in delivery emails.

3. **Test the live flow end-to-end at least once per language.**
   Go to `troublebaba.com/checkout-test?ui=uk` → pick each PDF language (UK, RU, EN, PL) in turn → complete Paddle sandbox purchase with test card `4242 4242 4242 4242` → confirm email arrives at your inbox from `hello@troublebaba.com` → confirm PDF downloads and is the right language.

4. **Optional: real Instagram screenshots for social proof.**
   Send 2-3 real screenshots of comments/DMs from your @troublebaba account (no names visible) — agent will place them as an IG-embed block on the homepage.

## 8 · Roadmap after handover (what to build next)

Full gap analysis vs professional international PDF-cookbook landings was
completed on handover day and is stored in `docs/COMPETITOR-AUDIT.md`.

**Top 5 next fixes** (in order of expected conversion impact):
1. Show the price 7-9 times on the landing (currently ~3-4). Add a price+CTA row after every major section (`for whom`, `what's inside`, `preview`, `guarantee`, `FAQ`).
2. Put Instagram social-proof block (@troublebaba · 100k+ followers · embed of 6-9 latest posts) above-the-fold.
3. Add author backstory section (photo + 3-line bio + "5+ years UA pastry, 100k+ IG").
4. Attach a real end-date to the `-33%` launch anchor (currently perpetual). Countdown to a fixed date.
5. Show "bundle math" on the price card: "10 recipes × 80 ₴ = cheaper than one course lesson."

Longer-tail items — see `TODO.md`.

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

Optional but useful: `wrangler login` (also leechansb@gmail.com) — lets the agent upload files to R2 directly from bash without the CF API roundtrip.

Once authenticated, the agent can autonomously:
- Read/write R2 objects (uploads, deletes, list).
- Manage Pages env variables.
- Retry failed deployments.
- Query Workers observability logs to debug production issues.

## 10 · Common commands cheatsheet

```bash
# Local dev
npm run dev                                     # dev server, HMR

# Build + verify
npm run build && du -sh dist                    # produce prod bundle

# R2 (owner-side)
wrangler r2 object list troublebaba-files       # (via CF MCP; wrangler alone has no list)
wrangler r2 object put "troublebaba-files/<key>" --file <path> --remote
wrangler r2 object delete "troublebaba-files/<key>" --remote

# Git flow — always push to main; Pages auto-deploys
git add -A && git commit -m "..." && git push origin main

# Deployment health check
curl -sI https://troublebaba.com/api/bonus/count
```

## 11 · Debugging

- **Deploy failed?** Cloudflare Pages → project `troublebaba` → Deployments → view logs.
- **Function 500?** MCP `mcp__plugin_cloudflare_cloudflare-observability__query_worker_observability` gets structured logs. Filter by `$metadata.trigger` includes `/api/…`.
- **Email not arriving?** Check Resend dashboard → domain must be `troublebaba.com` (verified). If sends fail, DKIM/SPF might have drifted — re-verify via Resend UI.
- **Turnstile 403 in prod but not in dev?** Local dev has no `TURNSTILE_SECRET` set → the verify wrapper returns `true` (fail-open). Production has the secret → fails closed. Always retest after touching form JS.

## 12 · Repository essentials

- **Git remote:** `git@github.com:Luichakr/troublebaba.git` (branch `main`).
- **Cloudflare account:** `leechansb@gmail.com`, ID `f87fe24ddb19df03a7d7e8fb9b4e86e6`.
- **Pages project:** `troublebaba`.
- **Domain:** `troublebaba.com` (apex + `www.` redirects to apex).

---

Questions or gaps in this doc? Ask the previous agent to update it before signing off.
