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
 * Поэтому здесь информация не маскируется, а уничтожается: страница
 * сначала уменьшается в ~17 раз (1080 → 64 px), и размытие применяется
 * уже к уменьшенной. В файле остаётся 64×91 ≈ 5800 отсчётов на страницу,
 * где текста на 1000+ знаков — восстанавливать нечего. Апскейлер или
 * «реставратор» дорисует правдоподобный текст, но не тот, что был.
 *
 * Побочный выигрыш: размытая страница весит ~0.3 КБ вместо ~90 КБ, и все
 * 50 закрытых страниц вместе занимают меньше одной читаемой.
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
        // Уменьшение — то, что уничтожает текст; размытие лишь убирает
        // «лестницу» пикселей, чтобы страница читалась как страница.
        const i = await sharp(join(tmp, file))
          .resize({ width: CFG.blurWidth })
          .blur(Math.max(0.4, CFG.blurWidth / 20))
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
