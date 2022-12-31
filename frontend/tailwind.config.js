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
      owSecondary: '#F9B759',
      background: '#1C1C1C',
      textPrimary: '#FFFFFF',
    },
    extend: {},
  },
  plugins: [],
};
