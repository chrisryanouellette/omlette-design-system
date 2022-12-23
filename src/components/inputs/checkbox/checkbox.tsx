import { ReactNode } from "react";
import { Input, InputProp } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";
import { concat } from "@Utilities/concat";
import "./checkbox.styles.css";

// export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
//   state?: State | State[];
// };

// const Checkbox = ({
//   state,
//   className,
//   ...rest
// }: CheckboxProps): JSX.Element => {
//   const classes = concat("omlette-checkbox", state, className);

//   return <input {...rest} className={classes} type="checkbox" />;
// };

// export { Checkbox };

export type CheckboxProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  labelProps?: LabelProps;
  inputProps?: InputProp;
  errorProps?: ErrorsProps;
};

const Checkbox = ({
  label,
  helper,
  labelProps,
  inputProps,
  errorProps,
}: CheckboxProps): JSX.Element => {
  const classes = concat("omlette-checkbox", inputProps?.className);
  return (
    <>
      <Input {...inputProps} className={classes} type="checkbox" />
      <Label {...labelProps} helper={helper}>
        {label}
      </Label>
      <Errors {...errorProps} />
    </>
  );
};

export { Checkbox };
