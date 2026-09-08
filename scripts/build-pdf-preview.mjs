#!/usr/bin/env node
/**
 * Собирает листалку страниц PDF: выбранные страницы читаемые, остальные
 * размыты так, что текст не восстановить.
 *
 * Запуск:  npm run pdf:preview            все языки из конфига
 *          npm run pdf:preview -- uk ru   только эти
 *
 * Что читает: scripts/pdf-preview.config.json — там пути к PDF и список
 * страниц, которые можно показывать. Список правится руками, скрипт
 * перегенерирует всё заново.
 *
 * Что пишет: public/images/pdf-preview/<lang>/p<N>.webp — все страницы,
 *            src/data/pdf-preview.json — манифест для компонента
 *            (сколько страниц у языка и какие из них читаемые).
 *
 * ── ДВА ПУТИ, И ОНИ НЕ РАВНОЦЕННЫ ──────────────────────────────────
 * Если рядом с <lang>.pdf лежит <lang>-preview.pdf (его делает
 * scripts/pdf-preview-substitute.py), рендерим из него. Там текст книги
 * УДАЛЁН из самого PDF и заменён уведомлением об авторском праве, то
 * есть секрета в файле нет вообще — и блюр нужен только для вида.
 * Поэтому страница размывается по полному разрешению, мягко.
 * Это основной путь: защита не зависит от того, насколько стойким
 * окажется размытие.
 *
 * Если подменённого файла нет, работает старый путь: страница сначала
 * уменьшается в ~17 раз (текст гибнет здесь), потом растягивается
 * обратно и размывается. Он тоже надёжен, но выглядит хуже — блюр
 * по восстановленной из 64 px основе получается вязким, не мягким.
 * Размывать оригинал в полном размере БЕЗ подмены нельзя: гауссово
 * размытие — свёртка с известным ядром, у текста сильные априорные
 * признаки, и деконволюция такое читает.
 *
 * ── ПРО «ДОРОГОЕ» СТЕКЛО ────────────────────────────────────────────
 * Одного blur() для материала недостаточно — получается плоское мыло.
 * Стекло у Apple складывается из пяти вещей, и здесь собраны все:
 *   большой радиус · поднятая насыщенность (vibrancy) · молочный тинт ·
 *   мелкое зерно · световой блик по верхней кромке.
 * Зерно и блик — не украшение: без них ровная заливка выдаёт подделку,
 * а с ними глаз читает поверхность как физическое стекло.
 *
 * Поверх стекла ложится короткий знак «© TROUBLEBABA · troublebaba.com».
 * Он резкий и единственный читаемый текст на закрытой странице: под
 * стеклянной сигмой уведомление из PDF не вытягивается даже шарпом,
 * поэтому адресат сообщения — обычный посетитель, а не «взломщик».
 *
 */
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CFG = JSON.parse(readFileSync(join(ROOT, 'scripts/pdf-preview.config.json'), 'utf8'));
const OUT_DIR = join(ROOT, 'public/images/pdf-preview');
const MANIFEST = join(ROOT, 'src/data/pdf-preview.json');
const G = CFG.glass ?? {};

function have(bin) {
  try { execFileSync('which', [bin], { stdio: 'pipe' }); return true; } catch { return false; }
}
if (!have('pdftoppm') || !have('pdfinfo')) {
  console.error('Нужен poppler (pdftoppm, pdfinfo). Поставить:  brew install poppler');
  process.exit(1);
}

const pageCount = (pdf) => {
  const out = execFileSync('pdfinfo', [pdf], { encoding: 'utf8' });
  const m = out.match(/^Pages:\s+(\d+)/m);
  if (!m) throw new Error(`не удалось прочитать число страниц: ${pdf}`);
  return Number(m[1]);
};

// Слой подмены: страница-уведомление в тех же пропорциях, что и разворот
// книги. Кегли считаются от ширины вывода, чтобы конфиг можно было менять,
// не пересчитывая вёрстку руками.
const xmlEscape = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const svgWrap = (w, h, inner) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${inner}</svg>`);

// Полное уведомление. Кегли отмерены на 560 px и масштабируются, поэтому
// blurOutWidth можно менять, не пересчитывая вёрстку руками. Крупный
// кегль переживает размытие лучше мелкого — отсюда большой заголовок.
function noticeLayer(lang, w, h, opacity) {
  const d = CFG.decoy?.[lang];
  if (!d || !opacity) return null;
  const k = w / 560;
  const x = Math.round(40 * k);
  const t = (y, size, weight, text) =>
    `<text x="${x}" y="${(y * k).toFixed(0)}" font-weight="${weight}" font-size="${(size * k).toFixed(1)}">${xmlEscape(text)}</text>`;

  const rows = [];
  const title = (d.title ?? '').split(' ');            // заголовок в две строки
  rows.push(t(130, 44, 800, title.slice(0, 1).join(' ')));
  if (title.length > 1) rows.push(t(180, 44, 800, title.slice(1).join(' ')));
  (d.body ?? []).filter(Boolean).forEach((line, i) => rows.push(t(236 + i * 34, 23, 700, line)));
  rows.push(t(420, 34, 800, d.url ?? ''));
  rows.push(t(478, 28, 800, d.sign ?? ''));

  return svgWrap(w, h, `<g font-family="sans-serif" fill="#1a140e" fill-opacity="${opacity}">${rows.join('')}</g>`);
}

// Короткий знак для обычного посетителя — низ страницы, как на превью
// стоковой картинки. Отдельно от уведомления: длинный текст про «вы
// добрались до этого слоя» адресован не ему.
function markLayer(lang, w, h, opacity) {
  const d = CFG.decoy?.[lang];
  if (!d || !opacity) return null;
  const k = w / 560;
  const s = 17 * k;
  return svgWrap(w, h,
    `<text x="${(w / 2).toFixed(0)}" y="${(h - 34 * k).toFixed(0)}" text-anchor="middle"` +
    ` font-family="sans-serif" font-weight="700" font-size="${s.toFixed(1)}"` +
    ` letter-spacing="${(0.06 * s).toFixed(2)}" fill="#1a140e" fill-opacity="${opacity}">` +
    `${xmlEscape(`${d.sign ?? ''} · ${d.url ?? ''}`)}</text>`);
}

// Слои материала.
const tintLayer  = (w, h, color, a) => svgWrap(w, h, `<rect width="${w}" height="${h}" fill="${color}" fill-opacity="${a}"/>`);
const sheenLayer = (w, h, top, bottom) => svgWrap(w, h,
  `<defs><linearGradient id="s" x1="0" y1="0" x2="0.3" y2="1">` +
  `<stop offset="0" stop-color="#fff" stop-opacity="${top}"/>` +
  `<stop offset="0.45" stop-color="#fff" stop-opacity="0"/>` +
  `<stop offset="1" stop-color="#fff" stop-opacity="${bottom}"/></linearGradient></defs>` +
  `<rect width="${w}" height="${h}" fill="url(#s)"/>`);
const grainLayer = (w, h, sigma) =>
  sharp({ create: { width: w, height: h, channels: 3, noise: { type: 'gaussian', mean: 128, sigma } } }).png().toBuffer();

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const langs = Object.keys(CFG.sources).filter((l) => !only.length || only.includes(l));

// Манифест наращиваем, а не перезаписываем: запуск для одного языка не
// должен стирать из него остальные.
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
let totalBytes = 0;

for (const lang of langs) {
  const original = resolve(ROOT, CFG.sources[lang]);
  // Если текст уже подменён в PDF (pdf-preview-substitute.py), рендерим
  // из подменённого: тогда уничтожать информацию уменьшением не нужно,
  // и блюр может быть честным полноразмерным.
  const substituted = original.replace(/\.pdf$/i, '-preview.pdf');
  const pdf = existsSync(substituted) ? substituted : original;
  const isSubstituted = pdf === substituted;
  if (!existsSync(pdf)) {
    console.error(`  ${lang}: нет файла ${CFG.sources[lang]} — пропущен, картинки не тронуты`);
    continue;
  }

  const total = pageCount(pdf);
  const visible = (CFG.visible[lang] ?? []).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const bad = (CFG.visible[lang] ?? []).filter((p) => p < 1 || p > total);
  if (bad.length) console.error(`  ${lang}: страниц ${bad.join(', ')} в файле нет (всего ${total}) — пропущены`);

  const dst = join(OUT_DIR, lang);
  mkdirSync(dst, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), `pdfprev-${lang}-`));

  try {
    // Рендерим всю книгу одним вызовом: 66 запусков pdftoppm на файле в
    // 70 МБ — это 66 разборов документа.
    execFileSync('pdftoppm', [
      '-png', '-r', '150', '-scale-to-x', String(CFG.clearWidth), '-scale-to-y', '-1', pdf, join(tmp, 'p'),
    ], { stdio: 'pipe' });

    const rendered = readdirSync(tmp).filter((f) => f.endsWith('.png')).sort();
    if (rendered.length !== total) {
      throw new Error(`отрендерено ${rendered.length} из ${total} страниц`);
    }

    // Пропорция страницы берётся из первого рендера, а не задаётся
    // константой: у другого PDF формат может оказаться не A4.
    const probe = await sharp(join(tmp, rendered[0])).metadata();
    const outW = isSubstituted ? CFG.clearWidth : CFG.blurOutWidth;
    const outH = Math.round(outW * probe.height / probe.width);

    let clearBytes = 0, blurBytes = 0;
    for (const file of rendered) {
      const n = Number(file.match(/p-?0*(\d+)\.png$/)[1]);
      const out = join(dst, `p${n}.webp`);
      if (visible.includes(n)) {
        const i = await sharp(join(tmp, file))
          .resize({ width: CFG.clearWidth })
          .webp({ quality: CFG.clearQuality })
          .toFile(out);
        clearBytes += i.size;
      } else {
        // Текст книги уже удалён из PDF, если рендерим из -preview.pdf:
        // тогда уменьшать страницу незачем и блюр идёт по полному
        // разрешению — он мягкий, а не «каша из пятен».
        // Для языка без подмены остаётся старый путь: сначала уничтожаем
        // текст уменьшением в 17 раз, и только потом размываем.
        const base = isSubstituted
          ? await sharp(join(tmp, file)).resize({ width: outW }).toBuffer()
          : await sharp(join(tmp, file))
              .resize({ width: CFG.blurDestroyWidth })
              .resize({ width: outW, kernel: 'lanczos3' })
              .toBuffer();

        // Стекло: радиус, вибрантность, молочный тинт…
        const frosted = await sharp(base)
          .blur(CFG.blurSigma)
          .modulate({ saturation: G.saturation, brightness: G.brightness })
          .composite([{ input: tintLayer(outW, outH, G.tint, G.tintOpacity) }])
          .png().toBuffer();

        // …и поверх — зерно, блик и текстовые слои. Зерно идёт в soft-light,
        // а не обычным наложением: так оно ложится текстурой поверхности,
        // не поднимая и не гася общую яркость.
        const over = [
          { input: await grainLayer(outW, outH, G.grainSigma), blend: 'soft-light' },
          { input: sheenLayer(outW, outH, G.sheenTop, G.sheenBottom) },
          markLayer(lang, outW, outH, G.markOver),
        ].filter((l) => l && (l.input ?? l));

        const i = await sharp(frosted)
          .composite(over.map((l) => (l.input ? l : { input: l })))
          .webp({ quality: CFG.blurQuality })
          .toFile(out);
        blurBytes += i.size;
      }
    }

    // Подчищаем страницы, которых в этом издании больше нет, и старые
    // jpg от прежней версии превью на 4 страницы.
    for (const f of readdirSync(dst)) {
      const m = f.match(/^p(\d+)\.webp$/);
      const stale = m ? Number(m[1]) > total : /\.(jpg|jpeg)$/i.test(f) || /-\d+\.webp$/.test(f);
      if (stale) { unlinkSync(join(dst, f)); console.log(`  ${lang}: удалён лишний ${f}`); }
    }

    manifest[lang] = { total, visible };
    totalBytes += clearBytes + blurBytes;
    console.log(
      `  ${lang}${isSubstituted ? ' (текст подменён в PDF)' : ''}: ${total} страниц — ${visible.length} читаемых ${(clearBytes / 1024).toFixed(0)} КБ` +
      ` + ${total - visible.length} размытых ${(blurBytes / 1024).toFixed(1)} КБ`
    );
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

if (!Object.keys(manifest).length) {
  console.error('\nНи одного языка не собрано — манифест не тронут.');
  process.exit(1);
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nИтого ${(totalBytes / 1024 / 1024).toFixed(2)} МБ. Манифест: src/data/pdf-preview.json`);
