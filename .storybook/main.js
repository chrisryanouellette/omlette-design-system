const path = require("path");
const { mergeConfig } = require("vite");

const config = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
    "../storybook/**/*.stories.@(js|jsx|ts|tsx|md|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-create-react-app",
    "@storybook/addon-a11y",
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
      define: {
        "process.env": {},
      },
      resolve: {
        alias: {
          ...config.resolve.alias,
          "@Utilities": path.resolve(__dirname, "../src/utilities"),
          "@Lib": path.resolve(__dirname, "../src/lib"),
          "@Components": path.resolve(__dirname, "../src/components"),
          "@Storybook": path.resolve(__dirname, "../storybook"),
        },
      },
    });
  },
};

module.exports = config;
