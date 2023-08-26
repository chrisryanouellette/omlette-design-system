import { Meta, StoryObj } from "@storybook/react";
import { FinishEvent, FinishFailedEvent, GenericFields } from "../useForm";
import { Form } from "../form";
import { BasicFormStory } from "./story/basic";
import { GroupFormStory } from "./story/group";
import { ListFormStory } from "./story/list";

export type FormControls<Fields extends GenericFields> = {
  onFinish?: FinishEvent<Fields>;
  onFinishFailed?: FinishFailedEvent<Fields>;
};

const commonArgs = {
  onFinish: { action: "onFinish", table: { disable: true } },
  onFinishFailed: { action: "onFinishFailed", table: { disable: true } },
};

export default {
  title: "Components/Form",
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof Form>;
type Story = StoryObj<typeof Form>;

export const Basic: Story = {
  parameters: {
    layout: "fullscreen",
  },
  argTypes: { ...commonArgs },
  render: (props) => <BasicFormStory {...props} />,
};

export const List: Story = {
  parameters: {
    layout: "fullscreen",
  },
  argTypes: { ...commonArgs },
  render: (props) => <ListFormStory {...props} />,
};

export const Group: Story = {
  parameters: {
    layout: "fullscreen",
  },
  argTypes: { ...commonArgs },
  render: (props) => <GroupFormStory {...props} />,
};
