/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B5E20',
          light: '#2E7D32',
          dark: '#1B5E20',
        },
        accent: {
          DEFAULT: '#66BB6A',
          light: '#81C784',
        },
        background: '#FFFFFF',
        text: {
          DEFAULT: '#1A1A1A',
          light: '#666666',
        },
      },
    },
  },
  plugins: [],
};
