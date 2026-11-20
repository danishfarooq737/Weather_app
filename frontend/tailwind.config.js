/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(2, 6, 23, 0.18)',
        card: '0 10px 30px rgba(2, 6, 23, 0.12)',
      },
    },
  },
  plugins: [],
};
