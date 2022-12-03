const resolveConfig = require("tailwindcss/resolveConfig");
const { call } = require("./utilities");

const colors = {
  "primary-100": "rgb(var(--primary-100) / <alpha-value>)",
  "primary-200": "rgb(var(--primary-200) / <alpha-value>)",
  "primary-300": "rgb(var(--primary-300) / <alpha-value>)",
  "secondary-100": "rgb(var(--secondary-100) / <alpha-value>)",
  "secondary-200": "rgb(var(--secondary-200) / <alpha-value>)",
  "secondary-300": "rgb(var(--secondary-300) / <alpha-value>)",
  "neutral-100": "rgb(var(--neutral-100) / <alpha-value>)",
  "neutral-200": "rgb(var(--neutral-200) / <alpha-value>)",
  "neutral-300": "rgb(var(--neutral-300) / <alpha-value>)",
};

/*
We add all the TW colors as CSS vars so they can be
used as defaults for the components
*/
const colorVariables = { ":root": {} };

const theme = resolveConfig({ theme: {}, content: ["./"] }).theme;
const defaultTwColors = call(theme?.colors || {});

Object.entries(defaultTwColors).forEach(([color, valueOrObject]) => {
  if (typeof valueOrObject === "object") {
    Object.entries(valueOrObject).forEach(([tone, hex]) => {
      colorVariables[":root"][`--tw-color-${color}-${tone}`] = hex;
    });
  }
});

module.exports = { colors, colorVariables };
