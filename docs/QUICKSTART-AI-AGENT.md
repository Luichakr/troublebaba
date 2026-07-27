# Quick-start for a new AI agent

If you are the AI picking up this project on a fresh machine, do these in order.

## 1. Read these three files first — in this exact order

1. `HANDOVER.md` (project state, tech stack, env vars, common commands)
2. `TODO.md` (what to build next, sprints A → F)
3. `docs/COMPETITOR-AUDIT.md` (why the top-5 fixes exist)

## 2. Set up the local environment

```bash
git status                        # confirm you're on `main`, clean
npm install                       # ~30 sec
npm run dev                       # http://localhost:4321
```

## 3. Wire Cloudflare access (once per machine)

Owner will pass the account email. Then in a terminal:

```bash
claude mcp list                   # confirm the 4 cloudflare-* servers are registered
claude mcp login plugin:cloudflare:cloudflare-api
claude mcp login plugin:cloudflare:cloudflare-bindings
claude mcp login plugin:cloudflare:cloudflare-builds
claude mcp login plugin:cloudflare:cloudflare-observability
# each opens a browser tab → owner clicks Allow
```

Also:
```bash
wrangler login                    # opens browser; owner clicks Allow
                                  # you must be logged in as leechansb@gmail.com
                                  # confirm with: wrangler whoami
```

After that, you can autonomously:
- Read/write R2 objects (`wrangler r2 object put/delete`, or via CF MCP).
- Manage Pages env vars via CF-API MCP.
- Retry deploys via CF Pages API.
- Query production logs via observability MCP.

## 4. Know the boundaries

You can:
- ✅ Edit any code, translations, styles, config.
- ✅ Push to `main` — Cloudflare Pages auto-deploys.
- ✅ Upload/delete R2 objects.
- ✅ Change Cloudflare Pages env vars via MCP.
- ✅ Retry deploys.

You should NOT (owner-only actions):
- ❌ Log in as the owner anywhere (Paddle KYC, bank details, tax info).
- ❌ Enter Paddle production API keys — owner puts them in CF Pages env; you only reference them via `env.PADDLE_API_KEY`.
- ❌ Accept Terms of Service on the owner's behalf.
- ❌ Create Telegram groups/channels (owner does it, you wire the URL in).
- ❌ Sign OAuth on any new integration.

## 5. Ponytail mode is active

The previous agent's default: **the shortest working diff wins**. If the change is not requested, don't add it. Prefer stdlib and native platform features over new deps. Prefer editing existing files to creating new ones. One-line comments only when a why is truly non-obvious.

## 6. Deploy check after every push

```bash
# git push origin main
# then ~1 minute later:
curl -sI https://troublebaba.com/                        # 200
curl -sI https://troublebaba.com/api/bonus/count         # 200 + JSON
```

If a deploy fails: use `mcp__plugin_cloudflare_cloudflare-api__execute` to fetch the latest deployment via `/accounts/{accountId}/pages/projects/troublebaba/deployments/{id}/history/logs`.

## 7. Sanity checklist before signing off

- [ ] Every commit built cleanly (`npm run build` returns exit 0).
- [ ] No `console.log` left in production code paths.
- [ ] `TURNSTILE_SECRET`, `CRON_SECRET`, `PADDLE_API_KEY` never printed in output.
- [ ] Every user-visible string exists in all 9 locales OR gracefully falls back.
- [ ] `SITE.presaleMode` is still `false` — Buy CTAs go to `/checkout-test`.

## 8. Contact chain

- Owner (business questions, screenshots, Instagram): messages in this chat.
- Cloudflare / GitHub: MCP-driven, no owner input needed once authenticated.
- Paddle: KYC + prices → owner only. Everything else is automated via webhook.
