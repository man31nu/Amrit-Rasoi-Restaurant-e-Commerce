/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          500: '#f97316',
          600: '#ea6c10',
          700: '#dc5c0a',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          2: '#1a1a2e',
          3: '#252540',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
      animation: {
        'fadeUp': 'fadeUp 0.5s ease forwards',
        'fadeIn': 'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
