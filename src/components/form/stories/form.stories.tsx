import { Meta } from "@storybook/react";
import { FinishEvent, FinishFailedEvent, GenericFields } from "../useForm";
import { Form } from "../form";
import { BasicFormStory as Basic } from "./story/basic";
import { GroupFormStory as Group } from "./story/group";

export type FormControls<Fields extends GenericFields> = {
  onFinish: FinishEvent<Fields>;
  onFinishFailed: FinishFailedEvent<Fields>;
};

const commonArgs = {
  onFinish: { action: "onFinish", table: { disable: true } },
  onFinishFailed: { action: "onFinishFailed", table: { disable: true } },
};

export default {
  title: "Components/Form",
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof Form>;

Basic.parameters = {
  layout: "fullscreen",
};
Basic.argTypes = {
  ...commonArgs,
};
export { Basic };

Group.parameters = {
  layout: "fullscreen",
};
Group.argTypes = {
  ...commonArgs,
};
export { Group };
