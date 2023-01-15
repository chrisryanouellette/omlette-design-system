import { ReactNode } from "react";
import { ButtonProps } from "@Components/button";
import { ControlTypes, bindTemplate } from "@Storybook/types";
import { IconButtonProps } from "../icon-button";
import { TextButtonStory as Text } from "./story/text-button";
import { IconButtonStory } from "./story/icon-button";

export type ButtonControls = {
  Size: ButtonProps["size"];
  Variant: ButtonProps["variant"];
  Theme: "light" | "dark";
  Title: IconButtonProps["title"];
  Position: IconButtonProps["position"];
  Children: ReactNode;
  onClick: ButtonProps["onClick"];
};

export type IconButtonControls = ButtonControls & {
  Name: string;
};

export default {
  title: "Components/Button",
  parameters: { controls: { sort: "alpha" } },
};

const baseArgTypes = {
  Size: {
    control: { type: ControlTypes.Select },
    options: ["sm", "md", "lg"],
  },
  Variant: {
    control: { type: ControlTypes.Select },
    options: ["primary", "secondary"],
  },
  Theme: {
    control: { type: ControlTypes.Select },
    options: ["light", "dark"],
  },
  onClick: { action: "onClick", table: { disable: true } },
};

Text.argTypes = baseArgTypes;
Text.args = {
  Children: "Click Me",
  Size: "lg",
  Variant: "secondary",
  Theme: "light",
};

export { Text };

const TextWithIcon = bindTemplate(IconButtonStory);
TextWithIcon.argTypes = {
  ...baseArgTypes,
  Name: {
    control: { type: ControlTypes.String },
  },
  Position: {
    control: { type: ControlTypes.Select },
    options: ["left", "right"],
  },
};

TextWithIcon.args = {
  Children: "Click Me",
  Size: "lg",
  Variant: "secondary",
  Name: "ri-star-line",
  Position: "left",
  Theme: "light",
};

export { TextWithIcon };

const Icon = bindTemplate(IconButtonStory);
Icon.argTypes = {
  ...baseArgTypes,
  Name: {
    control: { type: ControlTypes.String },
  },
  Title: {
    control: { type: ControlTypes.String },
  },
  Children: { table: { disable: true } },
};

Icon.args = {
  Size: "lg",
  Variant: "secondary",
  Name: "ri-star-line",
  Theme: "light",
  Title: "Star this product",
};

export { Icon };
