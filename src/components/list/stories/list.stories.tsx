import { ControlTypes } from "@Storybook/types";
import { ListStyle } from "../list.item";
import { BasicListStory as Basic } from "./story/basic";

export type ListControls = {
  "List Element": "ul" | "ol";
  "List Style": ListStyle;
};

const commonArgs = {
  "List Element": {
    control: { type: ControlTypes.Select },
    options: ["ul", "ol"],
  },
  "List Style": {
    control: { type: ControlTypes.Select },
    options: ["bullet", "icon", "number", "outline", "square", "url", "none"],
  },
};

export default {
  title: "Components/List",
  parameters: { controls: { sort: "alpha" } },
};

Basic.argTypes = {
  ...commonArgs,
};
Basic.args = {
  "List Element": "ul",
  "List Style": "bullet",
  ...Basic.args,
};
export { Basic };
