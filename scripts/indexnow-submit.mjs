#!/usr/bin/env node
/**
 * IndexNow submitter — пингует Bing / Yandex / Seznam, чтобы они
 * переобошли изменившиеся страницы. Аккаунт не нужен: ключевой файл лежит
 * на /<key>.txt, а мы POST-им список URL со ссылкой на него.
 *
 * Google IndexNow НЕ использует (у него свой обход) — но на Bing работает
 * поиск ChatGPT/Copilot, а Яндекс важен для RU/UA, так что смысл есть.
 *
 * Дельта считается по ТЕКСТУ страницы, а не по списку URL. Раньше хэш брался
 * от самого адреса, поэтому правка текста статьи не давала никакой дельты:
 * адрес не менялся — значит «отправлять нечего». Теперь берём готовую
 * сборку в dist/, вытаскиваем видимый текст каждой страницы и сравниваем
 * с прошлым запуском. Скрипты, стили и имена ассетов из хэша исключены:
 * иначе любая правка CSS помечала бы все 300 страниц как изменённые.
 *
 * Отправляем только адреса, которые есть в карте сайта: /admin, /m/ и прочее
 * закрытое в неё не попадает и поисковикам не нужно.
 *
 * Usage:
 *   npm run build && npm run indexnow          — только изменившиеся страницы
 *   node scripts/indexnow-submit.mjs --all     — весь список принудительно
 *   node scripts/indexnow-submit.mjs --dry-run — показать, что ушло бы
 *   node scripts/indexnow-submit.mjs --wait-live [--timeout 300]
 *        — сначала дождаться, пока прод отдаст новую сборку (для CI:
 *          пуш в main деплоится Cloudflare Pages не мгновенно, и отправить
 *          заявку раньше деплоя значит позвать робота на старую страницу)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative, sep } from 'node:path';

const HOST = 'troublebaba.com';
const ORIGIN = `https://${HOST}`;
const DIST = 'dist';
const STATE_FILE = '.indexnow-state.json';
const KEY = '8b7b7054f857267bab62bf743fb93452';
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
// IndexNow принимает до 10 000 адресов за раз; шлём частями с запасом.
const BATCH = 500;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const num = (f, d) => { const i = argv.indexOf(f); return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : d; };

/** Видимый текст страницы: без <head>, скриптов, стилей и разметки. */
function pageText(html) {
  return html
    .replace(/<head[\s\S]*?<\/head>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    // Cloudflare Email Obfuscation подменяет почту в футере на «[email protected]».
    // Без этого текст живой страницы никогда не совпадёт с локальной сборкой,
    // и --wait-live будет ждать до таймаута на каждой странице.
    .replace(/\[email[\s\u00a0]*protected\]/gi, ' EMAIL ')
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, ' EMAIL ')
    .replace(/\s+/g, ' ')
    .trim();
}

const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 16);

/** Адреса из карты сайта в dist/ — единственный источник «что можно слать». */
function sitemapUrls() {
  const idx = readFileSync(join(DIST, 'sitemap-index.xml'), 'utf8');
  const parts = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].split('/').pop());
  if (!parts.length) throw new Error('sitemap-index.xml пуст — сборка не сделана?');
  const urls = new Set();
  for (const p of parts) {
    const xml = readFileSync(join(DIST, p), 'utf8');
    // <loc> внутри <url>, а не внутри <xhtml:link> — берём только их.
    for (const m of xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  return urls;
}

/** URL → путь к файлу в dist/ для всех index.html. */
function builtPages() {
  const map = new Map();
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) { walk(full); continue; }
      if (e.name !== 'index.html') continue;
      const rel = relative(DIST, full).split(sep).slice(0, -1).join('/');
      map.set(rel ? `${ORIGIN}/${rel}/` : `${ORIGIN}/`, full);
    }
  };
  walk(DIST);
  return map;
}

async function waitLive(url, expected, timeoutSec) {
  const deadline = Date.now() + timeoutSec * 1000;
  process.stdout.write(`Жду, пока прод отдаст новую сборку (${url.replace(ORIGIN, '')})`);
  while (Date.now() < deadline) {
    try {
      const r = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
      if (r.ok && hash(pageText(await r.text())) === expected) { console.log(' — готово.'); return true; }
    } catch { /* сеть моргнула — просто ещё раз */ }
    process.stdout.write('.');
    await new Promise((r) => setTimeout(r, 15000));
  }
  console.log(' — не дождался.');
  return false;
}

async function main() {
  let allowed;
  try { allowed = sitemapUrls(); }
  catch (e) { throw new Error(`Нет собранной карты сайта в ${DIST}/ — сначала npm run build. (${e.message})`); }

  const pages = builtPages();
  console.log(`Карта сайта: ${allowed.size} URL, собрано страниц: ${pages.size}`);

  const now = {};
  const missing = [];
  for (const url of allowed) {
    const file = pages.get(url);
    if (!file) { missing.push(url); continue; }
    now[url] = hash(pageText(readFileSync(file, 'utf8')));
  }
  if (missing.length) console.warn(`В карте есть, а в сборке нет: ${missing.length} (${missing.slice(0, 3).join(', ')}…)`);

  let prev = {};
  try { prev = JSON.parse(readFileSync(STATE_FILE, 'utf8')); } catch { console.log('Состояния нет — первый запуск.'); }

  const urls = Object.keys(now);
  const added = urls.filter((u) => !(u in prev));
  const edited = urls.filter((u) => u in prev && prev[u] !== now[u]);
  const gone = Object.keys(prev).filter((u) => !(u in now));

  console.log(`Новых: ${added.length}, изменённых: ${edited.length}, исчезло из карты: ${gone.length}`);

  const force = has('--all');
  const toSend = force ? urls : [...added, ...edited];

  if (!toSend.length) {
    console.log('Отправлять нечего: тексты страниц не менялись с прошлого запуска.');
    console.log('Принудительно весь список: node scripts/indexnow-submit.mjs --all');
    return;
  }
  console.log(force ? `Принудительно отправляю все ${toSend.length} URL` : `К отправке: ${toSend.length}`);
  for (const u of toSend.slice(0, 15)) console.log('  ', u.replace(ORIGIN, ''));
  if (toSend.length > 15) console.log(`   … и ещё ${toSend.length - 15}`);

  if (has('--dry-run')) { console.log('--dry-run: ничего не отправлено, состояние не тронуто.'); return; }

  if (has('--wait-live')) {
    const probe = toSend[0];
    if (!(await waitLive(probe, now[probe], num('--timeout', 300)))) {
      console.error('Прод всё ещё отдаёт старую версию — заявку не шлю, чтобы не звать робота на старую страницу.');
      process.exit(1);
    }
  }

  let ok = true;
  for (let i = 0; i < toSend.length; i += BATCH) {
    const chunk = toSend.slice(i, i + BATCH);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: chunk }),
    });
    const body = await res.text().catch(() => '');
    console.log(`Партия ${i / BATCH + 1}: ${chunk.length} URL → ${res.status} ${res.statusText}${body ? ' ' + body.slice(0, 200) : ''}`);
    // 200/202 — принято. 403 — ключевой файл недоступен. 422 — ключ и host не сходятся.
    if (res.status === 403) console.error(`403 — ключевой файл не читается: ${KEY_LOCATION}`);
    if (res.status !== 200 && res.status !== 202) ok = false;
  }

  if (!ok) { console.error('Часть партий не принята — состояние не обновляю, следующий запуск попробует снова.'); process.exit(1); }

  writeFileSync(STATE_FILE, JSON.stringify(now));
  console.log(`Состояние сохранено: ${STATE_FILE} (${urls.length} URL)`);
}

main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
