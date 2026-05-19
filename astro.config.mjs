// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://luichakr.github.io',
  base: '/troublebaba/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  }
});
