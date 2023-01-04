import { OptionHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";
import { SelectOption } from "./select.option";
import { concat } from "@Utilities/concat";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";

export type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  emptyOption?: boolean;
  emptyOptionText?: ReactNode;
  emptyOptionProps?: OptionHTMLAttributes<HTMLOptionElement>;
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: SelectHTMLAttributes<HTMLSelectElement>;
  errorProps?: ErrorsProps;
  children?: ReactNode;
};

const SelectInput = ({
  emptyOption = true,
  emptyOptionText = "Please select a value",
  emptyOptionProps,
  label,
  helper,
  labelProps,
  inputProps,
  errorProps,
  className,
  children,
  multiple,
  value,
  ...rest
}: SelectInputProps): JSX.Element => {
  console.log(inputProps?.value);
  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <select
        {...inputProps}
        {...rest}
        multiple={multiple}
        value={value || inputProps?.value || multiple ? [] : ""}
        className={concat("omlette-select-input", className)}
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
