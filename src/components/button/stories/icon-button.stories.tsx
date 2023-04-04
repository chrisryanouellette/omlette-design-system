import { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "@Components/button";
import { ControlTypes } from "@Storybook/types";

const meta = {
  title: "Components/Icon Button",
  component: IconButton,
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

const hiddenArgs = {
  position: {
    table: { disable: true },
  },
  iconProps: {
    table: { disable: true },
  },
};

export const IconWithText: Story = {
  argTypes: {
    ...hiddenArgs,
  },
  args: {
    name: "ri-star-fill",
    children: "Click Me",
    size: "lg",
    variant: "secondary",
    className: "light",
    position: "left",
  },
};

export const IconOnly: Story = {
  argTypes: {
    ...hiddenArgs,
  },
  args: {
    name: "ri-star-fill",
    size: "lg",
    variant: "secondary",
    className: "light",
    "aria-label": "Star Item",
  },
};
