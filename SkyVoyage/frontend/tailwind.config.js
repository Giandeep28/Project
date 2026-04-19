/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT:'#C8A84B', light:'#D4B96A', dark:'#A8882B', muted:'rgba(200,168,75,0.15)' },
        navy: { DEFAULT:'#0A0F1A', card:'#111827', surface:'#1C2333', border:'rgba(200,168,75,0.18)' },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
