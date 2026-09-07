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
 * ── ПРО НЕОБРАТИМОСТЬ РАЗМЫТИЯ ──────────────────────────────────────
 * Размывать страницу в полном размере нельзя: гауссово размытие — это
 * свёртка с известным ядром, а у текста сильные априорные признаки, так
 * что деконволюция такое читает. Пикселизация вскрывается тем же путём.
 *
 * Поэтому здесь информация не маскируется, а уничтожается и подменяется.
 * Три шага, порядок принципиален:
 *
 *   1. Страница уменьшается в ~17 раз (1080 → 64 px). Текст книги гибнет
 *      ИМЕННО здесь: в 64×91 остаётся ~5800 отсчётов там, где знаков за
 *      тысячу. Остаётся только цвет и грубая раскладка.
 *   2. На растянутую обратно основу кладётся decoy — уведомление об
 *      авторском праве из конфига. С этого момента единственный текст
 *      в картинке — наш, и вопрос «а вдруг расшифруют» снимается:
 *      расшифровывать нечего, рецепта в файле нет ни в каком виде.
 *   3. Всё вместе размывается. Это уже только внешний вид.
 *
 * Шаг 3 добавлен потому, что без него в разметке лежал файл шириной 64 px,
 * и растягивал его браузер — страница выглядела кашей из цветных пятен.
 * После обратного апскейла с размытием она читается как страница, снятая
 * не в фокусе: видно колонки, заголовок, фото, абзацы — и ни одной буквы.
 *
 * blurSigma выбран на границе: глазу decoy не читается, а под шарпом с
 * контрастом проступает — тот, кто потратит на это время, прочитает
 * уведомление вместо рецепта. Крупный кегль переживает размытие лучше
 * мелкого, поэтому заголовок и адрес набраны заметно крупнее текста.
 *
 * Побочный выигрыш остаётся: размытая страница весит ~3.5 КБ вместо ~90 КБ,
 * и все 50 закрытых страниц вместе — меньше двух читаемых.
 *
 * Внимание: полноразмерный рендер живёт только во временной папке и
 * удаляется. В public/ уходит уже уничтоженная картинка — иначе оригинал
 * лежал бы в открытом доступе рядом с размытым.
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

function decoyLayer(lang, w, h) {
  const d = CFG.decoy?.[lang];
  if (!d) return null;
  const k = w / 560;                       // все размеры отмерены на 560 px
  const pad = Math.round(38 * k);
  const S = { title: 34 * k, body: 21 * k, url: 27 * k, sign: 24 * k };
  const rows = [];
  let y = Math.round(120 * k);

  rows.push({ t: d.title, s: S.title, weight: 800 });
  y += Math.round(S.title * 1.5);
  for (const line of d.body ?? []) {
    rows.push(line ? { t: line, s: S.body, weight: 600, y } : null);
    y += Math.round(S.body * 1.75);
  }
  rows.push({ t: d.url, s: S.url, weight: 800, y: y + Math.round(10 * k) });
  rows.push({ t: d.sign, s: S.sign, weight: 700, y: y + Math.round(S.url * 2.4) });

  let cy = Math.round(120 * k);
  const out = [];
  for (const r of rows) {
    if (!r) { cy += Math.round(S.body * 1.75); continue; }
    const yy = r.y ?? cy;
    out.push(`<text x="${pad}" y="${yy}" font-family="sans-serif" font-weight="${r.weight}" font-size="${r.s.toFixed(1)}" fill="#241a12">${xmlEscape(r.t)}</text>`);
    cy = yy + Math.round(r.s * 1.5);
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${out.join('')}</svg>`);
}

const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const langs = Object.keys(CFG.sources).filter((l) => !only.length || only.includes(l));

// Манифест наращиваем, а не перезаписываем: запуск для одного языка не
// должен стирать из него остальные.
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
let totalBytes = 0;

for (const lang of langs) {
  const pdf = resolve(ROOT, CFG.sources[lang]);
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
    const outW = CFG.blurOutWidth;
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
        // Шаг 1 — здесь и только здесь гибнет текст книги. Результат
        // уходит в буфер, а не в файл: полноразмерный рендер в public/
        // попасть не должен ни на каком этапе.
        const base = await sharp(join(tmp, file))
          .resize({ width: CFG.blurDestroyWidth })
          .resize({ width: CFG.blurOutWidth, kernel: 'lanczos3' })
          .toBuffer();
        // Шаг 2 — подмена. composite в sharp выполняется В КОНЦЕ конвейера,
        // поэтому размывать в этой же цепочке нельзя: текст остался бы
        // резким поверх размытого фона. Отсюда отдельный toBuffer().
        const layer = decoyLayer(lang, outW, outH);
        const merged = layer
          ? await sharp(base).composite([{ input: layer }]).png().toBuffer()
          : base;
        // Шаг 3 — размытие всего разом.
        const i = await sharp(merged)
          .blur(CFG.blurSigma)
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
      `  ${lang}: ${total} страниц — ${visible.length} читаемых ${(clearBytes / 1024).toFixed(0)} КБ` +
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
