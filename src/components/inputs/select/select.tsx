import {
  Children,
  OptionHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  cloneElement,
  isValidElement,
} from "react";
import { concat } from "@Utilities/concat";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";
import { isElement } from "@Utilities/react";
import { State } from "..";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";
import { SelectOption } from "./select.option";

import "./select.styles.css";

export type SelectInputProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value"
> & {
  emptyOption?: boolean;
  emptyOptionText?: ReactNode;
  emptyOptionProps?: OptionHTMLAttributes<HTMLOptionElement>;
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: Omit<SelectHTMLAttributes<HTMLSelectElement>, "value"> & {
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
  ...rest
}: SelectInputProps): JSX.Element => {
  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <select
        {...inputProps}
        {...rest}
        multiple={multiple}
        className={concat(
          "omlette-select-input",
          inputProps?.state,
          inputProps?.className,
          className
        )}
      >
        <ChildOrNull condition={!multiple && !!emptyOption}>
          <SelectOption
            {...emptyOptionProps}
            value=""
            selected={!inputProps?.defaultValue}
            disabled
            hidden
          >
            {emptyOptionText}
          </SelectOption>
        </ChildOrNull>
        {Children.map(children, function (child) {
          if (isValidElement(child)) {
            if (isElement(child, ["SelectOption"])) {
              return cloneElement(child, {
                ...child.props,
                selected: inputProps?.defaultValue === child.props.value,
              });
            }
          }
          return child;
        })}
      </select>
      <Errors {...errorProps} />
    </>
  );
};

SelectInput.displayName = "SelectInput";
SelectInput.Option = SelectOption;

export { SelectInput };
