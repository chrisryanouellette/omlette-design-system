const plugin = require("tailwindcss/plugin");
const { colors, colorVariables } = require("./colors");
const listComponentUtilities = require("./plugins/list");

const omletteDesignSystemPlugin = plugin(({ addComponents }) => {
  addComponents({
    ...listComponentUtilities,
    ...colorVariables,
  });
});

const omletteTailwindTheme = {
  colors,
};

module.exports = { omletteDesignSystemPlugin, omletteTailwindTheme };
