/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A53860",
        secondary: "#FFFFFF",
        accent: "#000000",
        whitegray: "#F1EFEC",
        pink: "#ffc2c5",
        navy: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#fbbf24',
        }
      },
      fontFamily: {
        ubuntu: ["Ubuntu", "sans-serif"],
      },
    },
  },
  plugins: [],
};