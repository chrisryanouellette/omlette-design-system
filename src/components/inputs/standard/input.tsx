import { InputHTMLAttributes } from "react";
import { State } from "..";
import { concat } from "@Utilities/concat";

import "./input.styles.css";
import "./input.number.styles.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  state?: State | State[];
};

const Input = ({
  className,
  state,
  type,
  ...rest
}: InputProps): JSX.Element => {
  const classes = concat(
    "omlette-standard-input",
    type && `omlette-${type}-input`,
    state,
    className
  );

  return <input {...rest} type={type} className={classes} />;
};

export { Input };
