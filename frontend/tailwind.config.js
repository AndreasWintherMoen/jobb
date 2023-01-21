/** @type {import('tailwindcss').Config} */
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
        DEFAULT: '#252525',
        accent: '#2A2A2A',
      },
      textPrimary: '#FFFFFF',
      event: {
        bedpres: '#EB536E',
        kurs: '#127DBD',
        sosialt: '#43B171',
      },
      transparent: 'transparent',
      error: '#CC0000',
    },
    extend: {
      borderRadius: {
        xl: '16px',
      },
    },
  },
  plugins: [],
};
