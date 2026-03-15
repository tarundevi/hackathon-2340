/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gt: {
          navy: '#262262',
          gold: '#B3A369',
          techgold: '#EAAA00',
          dark: '#0e1111',
          light: '#f5f5f5',
        }
      }
    },
  },
  plugins: [],
}
