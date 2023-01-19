import { ComponentStory } from "@storybook/react";
import { ElementType } from "react";
export declare enum ControlTypes {
    String = "text",
    Number = "number",
    Boolean = "boolean",
    Range = "range",
    Radio = "radio",
    Select = "select"
}
export declare const bindTemplate: <T extends ElementType<any>>(template: ComponentStory<T>) => ComponentStory<T>;
