const resolveConfig = require("tailwindcss/resolveConfig");
const { call } = require("../utilities");

const theme = resolveConfig({ theme: {}, content: ["./"] }).theme;
const defaultTwFontSizes = call(theme?.fontSize || {});

/** @type {Record<string, any>} */
const linkComponentUtilities = {};

/** For each font size, add the CSS vars used to size the link icon width / height */
Object.keys(defaultTwFontSizes).forEach((size) => {
  const fontSizeOption = defaultTwFontSizes[size][1];
  const rawFontSize = defaultTwFontSizes[size][0];

  linkComponentUtilities[`.text-${size}`] = {
    "--omlette-link-width-height": rawFontSize,
  };
});

module.exports = linkComponentUtilities;
