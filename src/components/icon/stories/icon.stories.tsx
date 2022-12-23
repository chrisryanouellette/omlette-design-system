import { IconProps } from "..";
import { IconStory as Icon } from "./story/icon";
import { ControlTypes } from "@Storybook/types";

export type IconControls = {
  Name: string;
  Size: IconProps["size"];
};

const argTypes = {
  Size: {
    control: { type: ControlTypes.Select },
    options: ["sm", "md", "lg"],
  },
};

export default {
  title: "Components/Icon",
  argTypes,
  parameters: { controls: { sort: "alpha" } },
};

Icon.args = {
  Name: "ri-star-fill",
  Size: "md",
};

export { Icon };
