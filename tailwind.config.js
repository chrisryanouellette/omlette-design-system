const {
  omletteDesignSystemPlugin,
  omletteTailwindTheme,
} = require("./development/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: { ...omletteTailwindTheme },
  },
  plugins: [omletteDesignSystemPlugin],
};
