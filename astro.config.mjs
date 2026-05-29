// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Site lives at apex domain troublebaba.com (root path).
// The public/CNAME file pins GitHub Pages to this domain.
export default defineConfig({
  site: 'https://troublebaba.com',
  base: '/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
