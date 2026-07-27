# TODO — TROUBLEBABA landing

## 🔴 Blocks real revenue (owner-only)

- [ ] **Paddle KYC** → activate production. Login `vendors.paddle.com`, complete Business Verification + Payout details + Tax. After approval: flip `PADDLE_ENV=production` in CF Pages env, swap `PADDLE_API_KEY` for prod key, update `SITE.paddle.priceBundle` in `src/config/site.js` with prod price ID.
- [ ] **Test live flow** at `troublebaba.com/checkout-test` for each PDF language (UK/RU/EN/PL). Confirm delivery email arrives + correct-language PDF downloads.

## 🟡 Owner input required (1-line message to AI unblocks each)

- [ ] Create closed **Telegram community** for buyers → send invite URL to the AI agent. Agent will set `TELEGRAM_COMMUNITY_URL` env + flip `SITE.community.enabled = true`. Bonus block goes live + join link enters delivery emails.
- [ ] Send 2-3 real **Instagram screenshots** of positive comments/DMs (no personal names visible) — agent inserts them as social-proof block above-the-fold.
- [ ] Decide **launch end date** for the `-33%` anchor discount → agent wires a countdown to that fixed date.
- [ ] Confirm **BONUS_TOTAL** (currently 50 launch slots) is the right number, or specify new count.

## 🟢 Roadmap — next AI agent runs these in order (no owner input needed)

### Sprint A — conversion basics (top-5 from competitor audit)

1. [ ] **Price repetition** — the price + CTA now appears ~3-4 times. Professional landings show it 7-9× (after every major block). Insert compact price+CTA rows after: `for whom`, `what's inside`, `preview`, `guarantee`, `FAQ`. Same design as the main pricing card, smaller.
2. [ ] **Instagram social-proof above-the-fold** — badge `@troublebaba · 100k+` + embed of 6-9 latest posts near hero. Owner should provide the post embed HTML from Instagram → agent wires it.
3. [ ] **Author backstory** — new section: portrait photo + 3-paragraph bio ("5+ years UA pastry, tested every recipe with EU-market products, 100k+ IG followers"). Owner provides the photo; agent writes copy in 9 langs.
4. [ ] **Dated launch anchor** — currently `-33% $30 → $20` is perpetual. Rewire to end at a specific ISO date (config in `site.js`). Show inline countdown `-33% ends in 3d 12h`.
5. [ ] **Bundle math on price card** — `800 ₴ ÷ 10 recipes = 80 ₴ per recipe (cheaper than one course lesson)`. One line under the price. Localized.

### Sprint B — translations catch-up

6. [ ] **Extend `INGREDIENTS_BY_SLUG`** in `src/data/flavors.js` from `uk` + `ru` to also cover `pl`, `en`, `es`, `de`, `fr`, `it`, `pt`. Draft translations exist in the audit report — verify with owner before pushing.
7. [ ] **Extend `INGREDIENTS_COPY`** (heading, subline, pdfNote, ctaHint) to the same 7 languages.
8. [ ] **Add `BUNDLE_CARD` entries** in `src/components/FlavorPage.astro` for `es`, `de`, `fr`, `it`, `pt` (each = €18). Currently only uk/ru/pl/en have entries; other locales fall back to `en`.

### Sprint C — trust bootstrap

9. [ ] **Instagram embed lane** (6-9 latest posts) — new section between hero and pricing. Use IG's `<blockquote>` embed. Add domain to CSP.
10. [ ] **"Process transparency" block** — a 3-tile explainer: "Each recipe rewritten 3+ times · Tested on EU-market products · No shortcuts". Owner reviews before publish.
11. [ ] **Reader-repost gallery** — placeholder now; fill later with IG-provided images of buyers who repeated recipes (once we have real ones).
12. [ ] **Move `/free-recipe/` sample onto homepage** as a "peek at the writing style" mini-block.
13. [ ] **FAQ expansion** — grow FAQ to 10-12 questions (from current ~6). Add: "Which currency is charged?", "Do I need special equipment?", "Can I print the PDF?", "Refund policy explained", "How long does the download link last?", "Can I share with a friend?".

### Sprint D — copy sharpening

14. [ ] **Hero-headline rewrite** using the audit's tested formula. Owner should approve final wording per language.
15. [ ] **CTA verbs everywhere carry the price** — every Buy button reads `Get the book — 800 ₴` / `Get the book — $20` etc, never bare "Buy PDF".
16. [ ] **Micro-guarantee** under every CTA: one line `Instant download · Result guaranteed · Yours forever`. Localized.

### Sprint E — post-KYC (blocked until Paddle live)

17. [ ] **Real Paddle production integration** — replace sandbox client token, price ID, webhook secret. Small config change, then run one real purchase to confirm.
18. [ ] **Merge `/checkout-test` into the main flow** — either embed Paddle overlay directly on homepage price CTA, or keep `/checkout-test` under a cleaner URL like `/buy` and redirect there. Language selector + acknowledgement checkbox stay.
19. [ ] **Remove the "sandbox / test card" copy** from checkout page once real payments are on.

### Sprint F — small polish

20. [ ] Localize the JSON-LD Offer to include per-locale prices (currently canonical USD only).
21. [ ] Add a `sticky bottom-bar` price+CTA for desktop (currently mobile-only).
22. [ ] Regenerate PDF preview thumbnails after any PDF edit (`scratchpad/extract-pdf-pages.py` in this repo — needs the source `УКРАЇНСЬКА bento cake.pdf`).
23. [ ] Backfill `flavors.<lang>.js` files for `es`, `de`, `fr`, `it`, `pt` with better lead copy (audit has drafts).
24. [ ] Purge legacy Monobank code paths from `functions/api/checkout/create.ts` and `SITE.priceSingle` — no CTAs touch these now.
25. [ ] Add real analytics dashboard for the bonus counter — currently `/admin/stats` shows tracks but not bonus sales.

---

## Completed since project kickoff (highlights)

- Full landing built in Astro + 9-language i18n.
- 66-page PDF cookbook designed in Canva, split-and-merged for corrections, exported.
- 4 language versions of the PDF uploaded to private R2 (uk/ru/en/pl).
- Gated download endpoint with HMAC-signed tokens, 3-download / 7-day cap.
- Paddle sandbox purchase flow end-to-end (checkout → webhook → email → download).
- Resend + own-domain email delivery (bypasses spam).
- Turnstile bot protection on all public forms.
- Cloudflare MCP integration — agent can now manage R2/Pages env/deploys autonomously.
- 10 SEO recipe pages with ingredient chips (no grams).
- Live purchase counter (R2-backed, 30s edge-cache).
- Localized currency display + non-breaking spaces for ₴/zł.
- Full competitor audit vs international PDF-cookbook landings (see `docs/COMPETITOR-AUDIT.md`).
