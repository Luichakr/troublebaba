/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EFE8',
        'warm-white': '#FDFAF6',
        taupe: '#C8B8A2',
        mocha: '#8B7355',
        'mocha-dark': '#6E5C43',   // DESIGN.md §2 писал #6F5C43 — приведено к коду
        espresso: '#1A1A1A',
        surface: '#EFE6DA',        // DESIGN.md §2 писал #EFE4D2 — приведено к коду
      },
      fontFamily: {
        // Реально загружаемые семейства — см. Layout.astro (Google Fonts).
        // Cabinet Grotesk / Outfit не подключены нигде и были мёртвыми токенами.
        cabinet: ['"Playfair Display"', 'serif'],
        outfit: ['Manrope', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
}
