import { ReactNode } from "react";
import { Input, InputProps } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";

export type DateInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};

const DateInput = ({
  errorProps,
  helper,
  inputProps,
  label,
  labelProps,
}: DateInputProps): JSX.Element => {
  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <Input {...inputProps} type="date" />
      <Errors {...errorProps} />
    </>
  );
};

DateInput.displayName = "DateInput";

export { DateInput };
