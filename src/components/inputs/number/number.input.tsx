import { ReactNode } from "react";
import { Input, InputProps } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";

export type NumberInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};

const NumberInput = ({
  errorProps,
  helper,
  inputProps,
  label,
  labelProps,
}: NumberInputProps): JSX.Element => {
  return (
    <>
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <Input {...inputProps} type="number" />
      <Errors {...errorProps} />
    </>
  );
};

NumberInput.displayName = "NumberInput";

export { NumberInput };
