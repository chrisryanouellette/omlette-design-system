const plugin = require("tailwindcss/plugin");
const { colorVariables, colors } = require("./colors");
const listComponentUtilities = require("./plugins/list");
const linkComponentUtilities = require("./plugins/link");

const omletteDesignSystemPlugin = plugin(({ addComponents }) => {
  addComponents({
    ...listComponentUtilities,
    ...linkComponentUtilities,
    ...colorVariables,
  });
});

const omletteTailwindTheme = {
  colors,
};

module.exports = { omletteDesignSystemPlugin, omletteTailwindTheme };
