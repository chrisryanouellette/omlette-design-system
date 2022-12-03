import { ReactNode } from "react";
import { Input, InputProp } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";

export type NumberInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProp;
  errorProps?: ErrorsProps;
};

const NumberInput = ({
  label,
  helper,
  labelProps,
  inputProps,
  errorProps,
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

export { NumberInput };
