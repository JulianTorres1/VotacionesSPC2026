/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Montserrat', 'Nunito', 'ui-sans-serif', 'system-ui'],
        body: ['Nunito', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          DEFAULT: '#E30813',
          dark: '#8C2F32',
          darker: '#350D0E'
        },
        secondary: {
          orange: '#F7AA3F',
          yellow: '#F2B90F'
        }
      }
    },
  },
  plugins: [],
};
