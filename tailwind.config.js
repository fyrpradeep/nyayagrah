/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1628',
          2: '#0f1e35',
          3: '#162440',
        },
        gold: {
          DEFAULT: '#c9a84c',
          2: '#e2c46a',
          3: '#f0d98a',
          dark: '#8a6f2e',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
