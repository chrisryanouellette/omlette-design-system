import { ReactNode } from "react";
import { ErrorsProps, LabelProps } from "./utilities";
import { InputProps } from "./standard";

import "./inputs.styles.css";
export * from "./standard";
export * from "./date";
export * from "./checkbox";
export * from "./text";
export * from "./number";
export * from "./select";
export * from "./file";
export * from "./utilities";

export type State = "disabled" | "error";
export type ComposedInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};
