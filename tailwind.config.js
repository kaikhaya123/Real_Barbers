/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f1ea',
          300: '#f0eadf',
          400: '#ebe3d4',
          500: '#e6dcc9',
          600: '#d4c5ac',
          700: '#c2ae8f',
          800: '#b09772',
          900: '#9e8055',
        },
        dark: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#616161',
          600: '#424242',
          700: '#303030',
          800: '#1a1a1a',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-rethink-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
