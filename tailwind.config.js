const { omletteTailwindTheme } = require("./development/tailwind/index");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{ts,tsx}"],
  theme: {
    extend: { ...omletteTailwindTheme },
  },
  plugins: [],
};
