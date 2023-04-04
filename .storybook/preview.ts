import {  Preview } from "@storybook/react";

import "./tailwind.css";
import "../template/vars.css";

const viewports = {
  sm: {
    name: "TW Small (640x960)",
    styles: {
      width: "640px",
      height: "960px",
    },
  },
  md: {
    name: "TW Medium (768x960)",
    styles: {
      width: "768px",
      height: "960px",
    },
  },
  lg: {
    name: "TW Large (1024x960)",
    styles: {
      width: "1024px",
      height: "960px",
    },
  },
  xl: {
    name: "TW Extra Large (1280x960)",
    styles: {
      width: "1280px",
      height: "960px",
    },
  },
  "2xl": {
    name: "TW 2xl (1535x960)",
    styles: {
      width: "1535px",
      height: "960px",
    },
  },
};

const parameters: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: { viewports },
  },
};

export default parameters;
