import { ReactNode } from "react";
import { concat } from "@Utilities/concat";
import { Input, InputProps } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";

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
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};

const Checkbox = ({
  errorProps,
  helper,
  inputProps,
  label,
  labelProps,
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
