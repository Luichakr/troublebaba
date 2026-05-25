// Lightweight i18n bootstrap shared by /404, /privacy, /terms.
// These pages don't have a language switcher UI — they auto-detect from ?lang= or localStorage.
// All visible text is set via data-i18n attributes; section arrays render into #legal-sections.

import { t } from '../i18n/translations.js';
import { SITE } from '../config/site.js';

type Lang = 'uk' | 'ru' | 'pl' | 'en';
const SUPPORTED: readonly Lang[] = ['uk', 'ru', 'pl', 'en'];

function detectLang(): Lang {
  try {
    const fromQuery   = new URLSearchParams(location.search).get('lang');
    const fromStorage = localStorage.getItem('lang');
    const navLang     = (navigator.language || '').slice(0, 2);
    const cand        = (fromQuery || fromStorage || navLang || 'uk').slice(0, 2);
    return SUPPORTED.find(l => cand === l) || 'uk';
  } catch {
    return 'uk';
  }
}

function emailLink(): string {
  const email = SITE.contactEmail;
  return `<a href="mailto:${email}" class="text-mocha underline hover:text-mocha-dark">${email}</a>`;
}

function applyText(val: string): string {
  return val.replace(/\{EMAIL\}/g, emailLink()).replace(/\n/g, '<br/>');
}

export interface LegalI18nOpts {
  titleKey: string;
  descKey: string;
  sectionsKey?: string;
}

export function initLegalI18n(opts: LegalI18nOpts): void {
  const lang = detectLang();
  const tr   = (t as Record<Lang, Record<string, unknown>>)[lang];
  if (!tr) return;

  document.documentElement.lang = lang;

  const title = tr[opts.titleKey];
  if (typeof title === 'string') document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  const desc = tr[opts.descKey];
  if (metaDesc && typeof desc === 'string') metaDesc.content = desc;

  // Open Graph title/description sync
  const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
  if (ogTitle && typeof title === 'string') ogTitle.content = title;
  const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
  if (ogDesc && typeof desc === 'string') ogDesc.content = desc;

  // Plain data-i18n elements (heading, updated stamp, back link, etc.)
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!key) return;
    const val = tr[key];
    if (typeof val === 'string') el.innerHTML = applyText(val);
  });

  // Render section arrays
  if (opts.sectionsKey) {
    const sections = tr[opts.sectionsKey] as { h: string; p: string }[] | undefined;
    const container = document.getElementById('legal-sections');
    if (Array.isArray(sections) && container) {
      container.innerHTML = sections.map(s => `
        <section>
          <h2 class="font-cabinet text-espresso text-xl mb-3">${s.h}</h2>
          <p class="font-outfit text-espresso/75 text-[15px] leading-relaxed">${applyText(s.p)}</p>
        </section>
      `).join('');
    }
  }
}
