import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e9f0',
          100: '#ccd3e1',
          200: '#99a7c3',
          300: '#667ba5',
          400: '#334f87',
          500: '#001f3f',
          600: '#001932',
          700: '#001326',
          800: '#000c19',
          900: '#00060d',
        },
        orange: {
          50: '#fff3e6',
          100: '#ffe7cc',
          200: '#ffcf99',
          300: '#ffb766',
          400: '#ff9f33',
          500: '#ff8700',
          600: '#cc6c00',
          700: '#995100',
          800: '#663600',
          900: '#331b00',
        },
      },
    },
  },
  plugins: [],
};

export default config;
