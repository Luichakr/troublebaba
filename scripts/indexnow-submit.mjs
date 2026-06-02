#!/usr/bin/env node
/**
 * IndexNow submitter — pings Bing / Yandex / Seznam with the full URL list
 * so they (re)crawl instantly. IndexNow needs NO account: a key file is
 * hosted at /<key>.txt and we POST the URL list referencing it.
 *
 * Google does NOT use IndexNow (it has its own crawl) — but Bing powers
 * ChatGPT/Copilot search, and Yandex matters for RU/UA, so this is worth it.
 *
 * Usage:  node scripts/indexnow-submit.mjs
 * Reads the live sitemap at https://troublebaba.com/sitemap-0.xml.
 */

const HOST = 'troublebaba.com';
const KEY  = '8b7b7054f857267bab62bf743fb93452';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP = `https://${HOST}/sitemap-0.xml`;

async function main() {
  console.log('Fetching sitemap:', SITEMAP);
  const res = await fetch(SITEMAP, { headers: { 'User-Agent': 'indexnow-submit' } });
  if (!res.ok) throw new Error('Sitemap fetch failed: ' + res.status);
  const xml = await res.text();

  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (urlList.length === 0) throw new Error('No <loc> URLs found in sitemap');
  console.log('Found', urlList.length, 'URLs');

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

  const submit = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  console.log('IndexNow response:', submit.status, submit.statusText);
  // 200 / 202 = accepted. 422 = key/url mismatch. 403 = key not found at keyLocation.
  if (submit.status === 403) {
    console.error('403 — key file not reachable yet at', KEY_LOCATION, '— deploy first, then re-run.');
  }
  const text = await submit.text().catch(() => '');
  if (text) console.log('Body:', text.slice(0, 300));
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
