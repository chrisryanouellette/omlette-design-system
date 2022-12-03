const resolveConfig = require("tailwindcss/resolveConfig");
const { call } = require("../utilities");

const theme = resolveConfig({ theme: {}, content: ["./"] }).theme;
const defaultTwFontSizes = call(theme?.fontSize || {});
const defaultTwLineHeights = call(theme?.lineHeight || {});

/** @type {Record<string, any>} */
const listComponentUtilities = {};

/** For each font size, add the CSS vars used to offset the list marker */
Object.keys(defaultTwFontSizes).forEach((size) => {
  const fontSizeOption = defaultTwFontSizes[size][1];
  const rawFontSize = defaultTwFontSizes[size][0];
  const fontSize = rawFontSize.replace("rem", "");
  const rawLineHeight =
    typeof fontSizeOption === "string"
      ? fontSizeOption
      : fontSizeOption.lineHeight || "";
  const lineHeight = rawLineHeight.includes("rem")
    ? rawLineHeight.replace("rem", "")
    : `calc(var(--omlette-list-font-size) * ${rawLineHeight})`;

  listComponentUtilities[`.text-${size}`] = {
    "--omlette-list-text-size": rawFontSize,
    "--omlette-list-font-size": fontSize,
    "--omlette-list-line-height": lineHeight,
  };
});

/** For each line height, add the CSS vars used to offset the list marker */
Object.keys(defaultTwLineHeights).forEach((size) => {
  const rawLineHeight = defaultTwLineHeights[size];
  const lineHeight = rawLineHeight.includes("rem")
    ? rawLineHeight.replace("rem", "")
    : `calc(var(--omlette-list-font-size) * ${rawLineHeight})`;
  listComponentUtilities[`.leading-${size}`] = {
    "--omlette-list-line-height": lineHeight,
  };
});

module.exports = listComponentUtilities;
