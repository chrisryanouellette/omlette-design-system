const path = require("path");
const { mergeConfig } = require("vite");

const config = {
  stories: ["../components/**/*.stories.mdx", "../components/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    '@storybook/addon-a11y'
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
  reactOptions: {
    strictMode: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      publicDir: path.resolve(__dirname, "./public"),
      resolve: {
        alias: {
          ...config.resolve.alias,
          "@Utilities": path.resolve(__dirname, "../utilities"),
          "@Components": path.resolve(__dirname, "../components"),
          "@Storybook": path.resolve(__dirname, "../storybook"),
        },
      },
    });
  },
};

module.exports = config;
