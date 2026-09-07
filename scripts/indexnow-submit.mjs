#!/usr/bin/env node
/**
 * IndexNow submitter — pings Bing / Yandex / Seznam with the full URL list
 * so they (re)crawl instantly. IndexNow needs NO account: a key file is
 * hosted at /<key>.txt and we POST the URL list referencing it.
 *
 * Google does NOT use IndexNow (it has its own crawl) — but Bing powers
 * ChatGPT/Copilot search, and Yandex matters for RU/UA, so this is worth it.
 *
 * Usage:  node scripts/indexnow-submit.mjs         — только новые/изменённые URL
 *         node scripts/indexnow-submit.mjs --all   — принудительно весь список
 *
 * Читает sitemap-index.xml и обходит все его части: карта разбита на куски
 * по 80 URL (entryLimit в astro.config.mjs), поэтому читать только
 * sitemap-0.xml значит потерять больше половины адресов.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname } from 'node:path';

const HOST = 'troublebaba.com';
// Кэш ранее отправленных URL. IndexNow ждёт только новые и изменённые адреса:
// повторная отправка одного и того же списка из 267 URL при каждом запуске —
// повод для оператора ограничить ключ или молча игнорировать заявки.
const STATE_FILE = '.indexnow-state.json';
const KEY  = '8b7b7054f857267bab62bf743fb93452';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_INDEX = `https://${HOST}/sitemap-index.xml`;

async function main() {
  console.log('Читаю индекс карты:', SITEMAP_INDEX);
  const idxRes = await fetch(SITEMAP_INDEX, { headers: { 'User-Agent': 'indexnow-submit' } });
  if (!idxRes.ok) throw new Error('Sitemap index fetch failed: ' + idxRes.status);
  const idxXml = await idxRes.text();

  const parts = [...idxXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  if (parts.length === 0) throw new Error('В sitemap-index.xml нет ни одной части');
  console.log('Частей карты:', parts.length);

  const urlList = [];
  for (const part of parts) {
    const r = await fetch(part, { headers: { 'User-Agent': 'indexnow-submit' } });
    if (!r.ok) { console.warn('  пропускаю', part, '—', r.status); continue; }
    const xml = await r.text();
    const found = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    console.log('  ', part.split('/').pop(), '→', found.length, 'URL');
    urlList.push(...found);
  }
  if (urlList.length === 0) throw new Error('Ни одного URL не собрано');
  console.log('Всего URL:', urlList.length);

  // Дельта: отправляем только то, чего не было в прошлый раз.
  let prev = {};
  try { prev = JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch { /* первый запуск */ }

  const nowHashes = Object.fromEntries(
    urlList.map(u => [u, createHash('sha1').update(u).digest('hex').slice(0, 12)])
  );
  const changed = urlList.filter(u => prev[u] !== nowHashes[u]);
  const force = process.argv.includes('--all');

  if (!force && changed.length === 0) {
    console.log('Нечего отправлять: список URL не менялся с прошлого запуска.');
    console.log('Принудительно отправить всё: node scripts/indexnow-submit.mjs --all');
    return;
  }

  const toSend = force ? urlList : changed;
  console.log(force
    ? `Принудительная отправка всех ${toSend.length} URL`
    : `Новых / изменённых URL: ${toSend.length} из ${urlList.length}`);

  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: toSend };

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

  // Состояние пишем только после успешной отправки, иначе при ошибке
  // следующий запуск снова посчитает эти URL новыми.
  if (submit.status === 200 || submit.status === 202) {
    try {
      mkdirSync(dirname(STATE_FILE) === '.' ? '.' : dirname(STATE_FILE), { recursive: true });
      writeFileSync(STATE_FILE, JSON.stringify(nowHashes, null, 0));
      console.log('Состояние сохранено:', STATE_FILE);
    } catch (e) { console.warn('Не удалось записать состояние:', e.message); }
  }
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
