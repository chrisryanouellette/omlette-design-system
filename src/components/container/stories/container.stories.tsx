import { ContainerProps } from "../container";
import { BasicContainerStory as Basic } from "./stories/basic";
import { ControlTypes } from "@Storybook/types";

export type ContainerControls = {
  Placement: ContainerProps["placement"];
};

export default {
  title: "Components/Container",
  parameters: { controls: { sort: "alpha" } },
};

const baseArgTypes = {
  Placement: {
    control: { type: ControlTypes.Select },
    options: ["left", "center", "right"],
  },
};

Basic.argTypes = baseArgTypes;
Basic.args = {
  Placement: "right",
  ...Basic.args,
};
Basic.parameters = {
  layout: "fullscreen",
};
export { Basic };
