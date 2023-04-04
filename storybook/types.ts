import { ComponentStory } from "@storybook/react";
import { ElementType } from "react";

export enum ControlTypes {
  String = "text",
  Number = "number",
  Boolean = "boolean",
  Range = "range",
  Radio = "radio",
  Select = "select",
}

/** @deprecated  Wrapper for binding templates */
export const bindTemplate = <T extends ElementType>(
  template: ComponentStory<T>
): ComponentStory<T> => template.bind({}) as ComponentStory<T>;
