import { InputHTMLAttributes, forwardRef } from "react";
import { concat } from "@Utilities/concat";
import { State } from "..";

import "./input.styles.css";
import "./input.number.styles.css";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  state?: State | State[];
};

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, state, type, ...rest },
  ref
): JSX.Element {
  const classes = concat(
    "omlette-standard-input",
    type && `omlette-${type}-input`,
    state,
    className
  );

  return <input {...rest} ref={ref} type={type} className={classes} />;
});

export { Input };
