#!/usr/bin/env node
/**
 * Генерирует адаптивные варианты для крупных картинок в public/images/.
 *
 * Зачем: все изображения лежат в public/, поэтому Astro их не трогает —
 * ни ресайза, ни srcset. При 87% мобильного трафика телефон тянул
 * десктопный файл целиком (author.webp — 382 КБ, bento-you-can — 472 КБ).
 *
 * Что делает: для каждой картинки из списка кладёт рядом копии шириной
 * 480/768/1024 px в webp. Оригинал остаётся как самый большой вариант,
 * поэтому старая разметка без srcset продолжает работать.
 *
 * Запуск:  npm run img:responsive
 * Идемпотентно: уже существующие варианты пропускаются.
 */
import sharp from 'sharp';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';

const ROOT = 'public/images';
const WIDTHS = [480, 768, 1024];
const MIN_BYTES = 100 * 1024;   // мельче 100 КБ дробить смысла нет

// Исключение из порога: карточки рецептов (q1..q10). recipeSrcSet() в
// HomePage.astro генерирует srcset для всех десяти без проверки файлов,
// поэтому вариант обязан существовать даже у мелкой картинки. q3.webp —
// 82 КБ, порог его пропускал, и на мобильных и планшетах карточка
// «Мак-цитрус» отдавала 404 вместо фото.
const ALWAYS = /^q\d+\.(webp|jpe?g|png)$/i;

// pdf-preview/ не трогаем: там свои размеры считает build-pdf-preview.mjs.
// Читаемые страницы уже отданы в нужной ширине, а размытые — 64 px, дробить
// их бессмысленно; хуже того, вариант размытой страницы шириной 480 px
// пришлось бы апскейлить, и он весил бы в разы больше исходной.
const SKIP_DIRS = new Set(['pdf-preview']);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return SKIP_DIRS.has(e.name) ? [] : walk(p);
    return /\.(webp|jpe?g|png)$/i.test(e.name) ? [p] : [];
  });
}

const isVariant = f => /-(480|768|1024)\.webp$/.test(f);

let made = 0, skipped = 0;
for (const file of walk(ROOT)) {
  if (isVariant(file)) continue;
  if (statSync(file).size < MIN_BYTES && !ALWAYS.test(basename(file))) continue;

  const meta = await sharp(file).metadata();
  const stem = join(dirname(file), basename(file, extname(file)));

  for (const w of WIDTHS) {
    if (meta.width && meta.width <= w) continue;      // не увеличиваем
    const out = `${stem}-${w}.webp`;
    if (existsSync(out)) { skipped++; continue; }
    await sharp(file).resize({ width: w }).webp({ quality: 82 }).toFile(out);
    made++;
    console.log('  +', out);
  }
}
console.log(`\nСоздано вариантов: ${made}, пропущено (уже есть): ${skipped}`);
