import path from "path";
import { mergeConfig } from "vite";
import { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
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
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {
      strictMode: true,
    },
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      publicDir: path.resolve(__dirname, "./public"),
      define: {
        "process.env": {},
      },
      resolve: {
        alias: {
          ...config?.resolve?.alias,
          "@Utilities": path.resolve(__dirname, "../src/utilities"),
          "@Lib": path.resolve(__dirname, "../src/lib"),
          "@Components": path.resolve(__dirname, "../src/components"),
          "@Storybook": path.resolve(__dirname, "../storybook"),
        },
      },
    });
  },
  docs: {
    autodocs: true,
  },
};

export default config
