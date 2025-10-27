import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
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

export default config;
