import { ControlTypes } from "@Storybook/types";
import { BasicCollapseStory as Basic } from "./story/basic";

export type CollapseControls = { "Unmount Children": boolean };
const commonArgs = {
  "Unmount Children": {
    control: { type: ControlTypes.Boolean },
  },
};

export default {
  title: "Components/Collapse",
  parameters: { controls: { sort: "alpha" } },
};

Basic.argTypes = {
  ...commonArgs,
};
export { Basic };
