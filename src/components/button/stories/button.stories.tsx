import { Meta, StoryObj } from "@storybook/react";
import { Button } from "@Components/button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    children: "Click Me",
    size: "lg",
    variant: "secondary",
    className: "light",
  },
};
