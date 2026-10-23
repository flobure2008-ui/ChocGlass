/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.08)',
        choco: '#2c1810',
      },
      borderRadius: {
        'squircle': '28px',
        'squircle-lg': '36px',
      },
    },
  },
  plugins: [],
}
