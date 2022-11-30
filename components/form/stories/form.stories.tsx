import { BasicFormStory as Basic } from "./story/basic";
import { ControlTypes, bindTemplate } from "@Storybook/types";

export type FormControls = {};

export default {
  title: "Components/Form",
  parameters: { controls: { sort: "alpha" } },
};

export { Basic };
