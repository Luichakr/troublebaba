import { FLAVORS, INGREDIENTS_BY_SLUG, INGREDIENTS_COPY } from './src/data/flavors.js';
import fs from 'fs';
const need = ['uk','ru','pl','en','es','de','fr','it','pt'];
console.log('FLAVORS:', FLAVORS.length);
for (const f of FLAVORS) {
  const have = Object.keys(f.t || {});
  const miss = need.filter(l => !have.includes(l));
  if (miss.length) console.log(`flavor ${f.slug}: missing`, miss.join(','));
  // image
  const img = f.image;
  if (img && img.startsWith('/')) {
    const p = 'public'+img;
    if (!fs.existsSync(p)) console.log(`MISSING IMAGE: ${p} (flavor ${f.slug})`);
  }
}
const copyMiss = need.filter(l => !(l in INGREDIENTS_COPY));
if (copyMiss.length) console.log('INGREDIENTS_COPY missing:', copyMiss.join(','));
// check per-ingredient
for (const slug in INGREDIENTS_BY_SLUG) {
  const arr = INGREDIENTS_BY_SLUG[slug];
  if (!Array.isArray(arr)) continue;
  for (const ing of arr) {
    if (!ing.t) continue;
    const m = need.filter(l => !(l in ing.t));
    if (m.length) console.log(`ingredient ${slug}/${ing.name || ing.slug}: missing`, m.join(','));
  }
}
