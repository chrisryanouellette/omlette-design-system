import { OptionHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { concat } from "@Utilities/concat";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";
import { State } from "..";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";
import { SelectOption } from "./select.option";

import "./select.styles.css";

export type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  emptyOption?: boolean;
  emptyOptionText?: ReactNode;
  emptyOptionProps?: OptionHTMLAttributes<HTMLOptionElement>;
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: SelectHTMLAttributes<HTMLSelectElement> & {
    state?: State | State[];
  };
  errorProps?: ErrorsProps;
  children?: ReactNode;
};

const SelectInput = ({
  children,
  className,
  emptyOption = true,
  emptyOptionProps,
  emptyOptionText = "Please select a value",
  errorProps,
  helper,
  inputProps,
  label,
  labelProps,
  multiple,
  value,
  ...rest
}: SelectInputProps): JSX.Element => {
  const selected = value ?? inputProps?.value;

  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <select
        {...inputProps}
        {...rest}
        multiple={multiple}
        value={selected ? selected : multiple ? [] : ""}
        className={concat(
          "omlette-select-input",
          inputProps?.state,
          inputProps?.className,
          className
        )}
      >
        <ChildOrNull condition={!multiple && !!emptyOption}>
          <SelectOption {...emptyOptionProps} value="">
            {emptyOptionText}
          </SelectOption>
        </ChildOrNull>
        {children}
      </select>
      <Errors {...errorProps} />
    </>
  );
};

SelectInput.Option = SelectOption;

export { SelectInput };
