// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// Site lives at apex domain troublebaba.com (root path).
// The public/CNAME file pins GitHub Pages to this domain (now retired in favor of Cloudflare Pages).
export default defineConfig({
  site: 'https://troublebaba.com',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // Phosphor for UI/object glyphs, Simple Icons for real brand marks.
    // One family, one 24x24 grid, one stroke weight - replaces the hand-drawn SVGs.
    icon({ include: { ph: ['*'], 'simple-icons': ['*'] } }),
    sitemap({
      // Generate <xhtml:link rel="alternate" hreflang="..."> alternates for each page.
      i18n: {
        defaultLocale: 'uk',
        locales: {
          uk: 'uk',
          ru: 'ru',
          pl: 'pl',
          en: 'en',
          es: 'es',
          de: 'de',
          fr: 'fr',
          it: 'it',
          pt: 'pt',
        },
      },
      // Skip noindex / utility / admin pages from the public sitemap.
      filter: (page) =>
        !page.endsWith('/404') &&
        !/\/thank-you\/?$/.test(page) &&
        !/\/payment-failed\/?$/.test(page) &&
        !/\/m(\/|$)/.test(page) &&
        !/\/admin(\/|$)/.test(page) &&
        // noindexed Paddle-sandbox leftover — must not sit in the sitemap
        !/\/checkout-test\/?$/.test(page),
      // Дробим карту на части. Один файл на 267 URL (260 КБ) Яндекс
      // обходит заметно реже, чем несколько компактных: у него слабее
      // логика приоритизации внутри большой карты, а RU даёт 4 169 показов.
      // Google одинаково хорошо ест оба варианта.
      entryLimit: 80,
      changefreq: 'weekly',
      priority: 0.8,
      // Boost the home page; legal pages stay lower.
      serialize(item) {
        const u = new URL(item.url);
        if (u.pathname === '/' || /^\/[a-z]{2}\/$/.test(u.pathname)) {
          item.priority = 1.0;
          item.changefreq = 'weekly';
        } else if (/privacy|terms/.test(u.pathname)) {
          item.priority = 0.3;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
