/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      owPrimary: '#0E5474',
      owSecondary: {
        DEFAULT: '#F9B759',
        accent: '#EEAC4E',
      },
      background: {
        DEFAULT: '#1F1F1F',
        accent: '#252525',
        light: '#2C2C2C',
        dark: '#191919',
      },
      textPrimary: '#FFFFFF',
      textAccent: '#BDBDBD',
      event: {
        bedpres: '#EB536E',
        kurs: '#127DBD',
        sosialt: '#43B171',
      },
      transparent: 'transparent',
      error: '#CC0000',
      ...colors,
    },
    extend: {
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
