import { ReactNode } from "react";
import { Input, InputProps } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";

export type TextInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};

const TextInput = ({
  label,
  helper,
  labelProps,
  inputProps,
  errorProps,
}: TextInputProps): JSX.Element => {
  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <Input {...inputProps} />
      <Errors {...errorProps} />
    </>
  );
};

export { TextInput };
