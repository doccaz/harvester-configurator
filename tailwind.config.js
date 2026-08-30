/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        harvester: {
          50: '#e6f7ef',
          100: '#c3ecd9',
          400: '#4ecb90',
          500: '#30BA78',
          600: '#279c64',
          700: '#1f7d50',
          800: '#166534',
          900: '#0F3D2A',
        },
        gray: {
          50: '#f0f7f4',
          100: '#dde9e4',
          200: '#b9cec6',
          300: '#8fada2',
          400: '#6b8b7f',
          500: '#517566',
          600: '#3a5a4e',
          700: '#2A5850',
          800: '#1A453C',
          900: '#092621',
          950: '#0C322C',
        },
      }
    },
  },
  plugins: [],
}