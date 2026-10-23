/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.12)',
          dark: 'rgba(15, 23, 42, 0.65)',
          border: 'rgba(255, 255, 255, 0.18)',
          highlight: 'rgba(255, 255, 255, 0.35)',
        },
        choco: {
          50: '#fbf7ee',
          100: '#f5ecd6',
          500: '#8d5b4c',
          700: '#543126',
          900: '#2c1810',
          dark: '#1a100b',
        }
      },
      borderRadius: {
        'squircle': '28px',
        'squircle-lg': '36px',
        'squircle-xl': '44px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 0 25px rgba(255, 255, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
        'choco-glow': '0 10px 25px -5px rgba(141, 91, 76, 0.4)',
        'neon-glow': '0 0 20px rgba(99, 102, 241, 0.5)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
