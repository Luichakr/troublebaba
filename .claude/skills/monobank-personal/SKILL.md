---
name: monobank-personal
description: Monobank Personal Open API (api.monobank.ua) — currency rates, client info, account statements, webhooks for personal accounts. NOT the merchant Acquiring API (see monobank-acquiring skill for that).
---

# Monobank Personal Open API

Public Open API for personal / private accounts. Used to receive notifications, pull statements, and read public data like FX rates.

**Source:** https://api.monobank.ua/docs/index.html (v250818)
**Reference captured:** May 2026, from official swagger docs.

> Not to be confused with `monobank-acquiring` (this repo also has that skill) — that one is for merchants accepting payments. THIS skill is for personal accounts authenticated by a user token from https://api.monobank.ua/.

## When to use

- Reading FX rates (no auth needed)
- Receiving incoming-transaction webhooks on a personal monobank account
- Pulling a personal account statement for reconciliation
- Reading client/account info for a user authenticated via QR code

For **merchant acquiring** (creating invoices, accepting card payments on a website) use the **`monobank-acquiring`** skill instead.

## Auth

- **Public endpoints** (`/bank/*`): no token.
- **Personal endpoints** (`/personal/*`): require `X-Token` header. Token issued to the user from https://api.monobank.ua/ via QR-code authorization in the monobank mobile app.
- **Rate limit:** Personal endpoints are limited to **1 request per 60 seconds** per token. Plan accordingly.

## Endpoints

### GET /bank/currency — Currency rates (public)

Base list of FX rates. Cached on Monobank side, refreshes ~once per 5 minutes.

**Response:**
```json
[
  {
    "currencyCodeA": 840,
    "currencyCodeB": 980,
    "date": 1552392228,
    "rateSell": 27,
    "rateBuy": 27.2,
    "rateCross": 27.1
  }
]
```

| Field | Type | Note |
|---|---|---|
| currencyCodeA | int | ISO 4217 numeric. 840=USD, 978=EUR, 980=UAH |
| currencyCodeB | int | ISO 4217 numeric (paired currency) |
| date | int | Unix timestamp |
| rateSell | number | Bank sells A for B at this rate (optional) |
| rateBuy | number | Bank buys A for B at this rate (optional) |
| rateCross | number | Cross rate (optional, when buy/sell not posted) |

### GET /bank/sync — Public bank info (public)

Returns `serverKeyId`, `serverPubKey`, `serverTimeMsec`. Used for syncing public keys.

### GET /personal/client-info — Client info (X-Token required)

**Headers:** `X-Token: <user token>`

**Response:**
```json
{
  "clientId": "3MSwRMtczs",
  "name": "Mazepa Ivan",
  "webHookUrl": "https://example.com/some_random_data_for_security",
  "permissions": "psf",
  "accounts": [ { /* ... */ } ],
  "jars": [ { /* ... */ } ],
  "managedClients": [ { /* ... */ } ]
}
```

| Field | Type | Note |
|---|---|---|
| clientId | string | Stable client ID |
| name | string | Full name |
| webHookUrl | string | URL Monobank POSTs notifications to |
| permissions | string | Granted scopes (e.g. `psf`) |
| accounts | array | List of personal accounts |
| jars | array | List of savings "jars" |
| managedClients | array | Sub-clients this user controls |

### POST /personal/webhook — Set webhook URL (X-Token required)

Registers a callback URL that Monobank will POST to whenever a transaction occurs on the user's accounts.

**Verification handshake:**
- When you POST a new webHookUrl, Monobank sends a `GET` to that URL. Your server MUST respond `200 OK` with no body.
- Then real events arrive as `POST` with body `{ type: "StatementItem", data: { account, statementItem: {...} } }`.
- Mono retries up to 3 times over ~5 + 60 + 600 seconds until it gets `200 OK`. If all retries fail, the webhook is disabled.

**Body:**
```json
{ "webHookUrl": "https://example.com/some_random_data_for_security" }
```

Use a long random suffix as path component — it's the only thing protecting your endpoint from spam.

### GET /personal/statement/{account}/{from}/{to} — Statement (X-Token required)

Pull account statement for a time range.

**Path params:**
| Param | Type | Note |
|---|---|---|
| account | string | Account ID from `/personal/client-info`, or `0` for default |
| from | int | Unix timestamp (start) |
| to | int | Unix timestamp (end). Optional, defaults to now |

**Constraints:** Max range = 31 days + 1 hour (2682000 seconds). Same rate limit as other personal endpoints (1 request / 60s).

**Response:**
```json
[
  {
    "id": "ZuWxqWkEXVw=",
    "time": 1554466347,
    "description": "Покупка щастя",
    "mcc": 7997,
    "originalMcc": 7997,
    "hold": false,
    "amount": -95000,
    "operationAmount": -95000,
    "currencyCode": 980,
    "commissionRate": 0,
    "cashbackAmount": 19000,
    "balance": 10050000,
    "comment": "За каву",
    "receiptId": "XXXX-XXXX-XXXX-XXXX",
    "invoiceId": "2103.в.27",
    "counterEdrpou": "3096889574",
    "counterIban": "UA083999980000003556392010014041",
    "counterName": "ТОВАРИСТВО З ОБМЕЖЕНОЮ ВІДПОВІДАЛЬНІСТЮ «БОРЕНА»"
  }
]
```

| Field | Type | Note |
|---|---|---|
| id | string | Transaction ID |
| time | int | Unix timestamp |
| description | string | Merchant or description |
| mcc | int | Merchant Category Code (post-correction) |
| originalMcc | int | MCC as originally sent |
| hold | bool | Is amount still on hold |
| amount | int | Amount in minor units (kopecks), with sign |
| operationAmount | int | Operation amount (may differ for FX) |
| currencyCode | int | ISO 4217 |
| commissionRate | int | Commission in minor units |
| cashbackAmount | int | Cashback in minor units |
| balance | int | Account balance after operation (minor units) |
| comment | string | Comment from sender/payer |
| receiptId | string | Receipt ID (optional) |
| invoiceId | string | Invoice ID for merchant linkage (optional) |
| counterEdrpou | string | Counterparty company code |
| counterIban | string | Counterparty IBAN |
| counterName | string | Counterparty legal name |

## Errors

Standard HTTP codes. Common:
- `400` — bad request (e.g. range exceeds 31 days)
- `403` — invalid token
- `429` — rate limit (1/60s)

## Tips for this project

If we ever need a fallback reconciliation flow alongside the acquiring webhook:

1. Use the merchant's personal monobank token (read-only mode) to pull `/personal/statement`
2. Match by `invoiceId` field (it's populated when payment came through acquiring)
3. Cross-check against our `/api/checkout/status` cache

But for normal operation, the **acquiring webhook** (already wired in `functions/api/checkout/webhook.ts`) is the primary source of truth. This personal API is just an audit/escape-hatch tool.

Do NOT call this from the public website — it's authenticated with the merchant's personal token, which must never reach a browser.
