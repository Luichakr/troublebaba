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
        'mocha-dark': '#6E5C43',
        espresso: '#1A1A1A',
        surface: '#EFE6DA',
      },
      fontFamily: {
        cabinet: ['"Cabinet Grotesk"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
}
