import { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/index";

import "./label.styles.css";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  helper?: ReactNode | ReactNode[];
  required?: boolean;
  afterLabel?: ReactNode;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
  helperProps?: HTMLAttributes<HTMLSpanElement>;
};

const Label = ({
  afterLabel,
  children,
  className,
  helper,
  helperProps,
  required,
  wrapperProps,
  ...rest
}: LabelProps): JSX.Element => {
  return (
    <label {...rest} className={concat("omlette-input-label", className)}>
      <span {...wrapperProps}>
        {children} {required ? "( Required )" : ""}
        {afterLabel}
      </span>
      <span {...helperProps}>
        {Array.isArray(helper)
          ? helper.map((node, i) => <span key={i}>{node}</span>)
          : helper}
      </span>
    </label>
  );
};

export { Label };
