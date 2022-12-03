const {
  omletteTailwindTheme,
  omletteDesignSystemPlugin,
} = require("./development/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{ts,tsx}"],
  theme: {
    extend: { ...omletteTailwindTheme },
  },
  plugins: [omletteDesignSystemPlugin],
};
