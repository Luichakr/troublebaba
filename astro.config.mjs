// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Site lives at apex domain troublebaba.com (root path).
// The public/CNAME file pins GitHub Pages to this domain (now retired in favor of Cloudflare Pages).
export default defineConfig({
  site: 'https://troublebaba.com',
  base: '/',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
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
      // Skip noindex / utility pages from the public sitemap.
      filter: (page) =>
        !page.endsWith('/404') &&
        !/\/thank-you\/?$/.test(page) &&
        !/\/payment-failed\/?$/.test(page) &&
        !/\/m(\/|$)/.test(page),
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
