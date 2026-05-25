#!/usr/bin/env node
/**
 * Builds the 1200×630 Open Graph cover used in <meta property="og:image">.
 *
 * Source: public/images/hero-cake.webp (any aspect, will be square-cropped)
 * Output: public/images/og-cover.webp
 *
 * Run: `npm run og:rebuild` (or `node scripts/build-og-cover.mjs`).
 *
 * Re-run whenever you change the hero photo or want to tweak the cover layout.
 */
import sharp from 'sharp';

const W = 1200, H = 630;
const SRC  = 'public/images/hero-cake.webp';
const DEST = 'public/images/og-cover.webp';

const cakeBuf = await sharp(SRC)
  .resize({ height: 560, width: 560, fit: 'cover' })
  .toBuffer();

const bgSvg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#F5EFE8"/>
      <stop offset="100%" stop-color="#EFE6DA"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <text x="70" y="135" font-family="Playfair Display, Georgia, serif" font-size="22" font-weight="600" letter-spacing="6" fill="#8B7355">BY TROUBLEBABA</text>
  <text x="70" y="260" font-family="Playfair Display, Georgia, serif" font-size="110" font-weight="900" fill="#1A1A1A">BENTO</text>
  <text x="70" y="370" font-family="Playfair Display, Georgia, serif" font-size="110" font-weight="900" fill="#1A1A1A">CAKE</text>
  <line x1="70" y1="420" x2="200" y2="420" stroke="#8B7355" stroke-width="2"/>
  <text x="70" y="475" font-family="Manrope, Inter, sans-serif" font-size="24" font-weight="600" fill="#1A1A1A">10 рецептов · PDF · $20</text>
  <text x="70" y="520" font-family="Manrope, Inter, sans-serif" font-size="18" font-weight="500" fill="#6E5C43">Авторская коллекция бенто-тортов</text>
  <circle cx="940" cy="315" r="265" fill="#8B7355" opacity="0.08"/>
</svg>`);

const bg = await sharp(bgSvg).png().toBuffer();
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560"><circle cx="280" cy="280" r="260" fill="white"/></svg>`);
const cakeMasked = await sharp(cakeBuf).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();

const info = await sharp(bg)
  .composite([{ input: cakeMasked, top: 35, left: 600 }])
  .webp({ quality: 88 })
  .toFile(DEST);

console.log(`✓ ${DEST}  ${info.width}×${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
