import { t } from './src/i18n/translations.js';
const locales = Object.keys(t);
console.log('Locales:', locales.join(','));

function flat(o, p='', out={}) {
  for (const k in o) {
    const v = o[k];
    const key = p ? p+'.'+k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out);
    else out[key] = v;
  }
  return out;
}
const ukF = flat(t.uk);
const ukKeys = Object.keys(ukF);
console.log('uk keys:', ukKeys.length);

const cyrRe = /[А-Яа-яЇїІіЄєҐґЁёЪъЫыЭэ]/;
for (const loc of locales) {
  if (loc === 'uk') continue;
  const lf = flat(t[loc]);
  const miss = ukKeys.filter(k => !(k in lf));
  const empty = Object.entries(lf).filter(([k,v]) => v === '').map(([k])=>k);
  const cyr = (loc !== 'ru') ? Object.entries(lf).filter(([k,v]) => typeof v==='string' && cyrRe.test(v)).map(([k])=>k) : [];
  if (miss.length) console.log(`[${loc}] MISSING (${miss.length}):`, miss.slice(0,15).join(' | '));
  if (empty.length) console.log(`[${loc}] EMPTY:`, empty.slice(0,15).join(' | '));
  if (cyr.length) console.log(`[${loc}] CYRILLIC (${cyr.length}):`, cyr.slice(0,15).join(' | '));
}
