// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// base — только для GitHub Pages (когда установлена переменная GITHUB_PAGES)
const isGhPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  site: 'https://luichakr.github.io',
  base: isGhPages ? '/troublebaba/' : '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
