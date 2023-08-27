import { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/index";

import "./label.styles.css";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  helper?: ReactNode | ReactNode[];
  required?: boolean;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
  helperProps?: HTMLAttributes<HTMLSpanElement>;
};

const Label = ({
  children,
  className,
  helper,
  helperProps,
  required,
  wrapperProps,
  ...rest
}: LabelProps): JSX.Element => {
  return (
    <label
      {...rest}
      className={concat(
        "block",
        "text-[var(--omlette-label-text-color)]",
        "text-[length:var(--omlette-label-text-size)]",
        "pb-[var(--omlette-label-padding-button)]",
        className
      )}
    >
      <span
        {...wrapperProps}
        className={concat("flex", wrapperProps?.className)}
      >
        {children} {required ? "( Required )" : null}
      </span>
      <span
        {...helperProps}
        className={concat(
          "flex",
          "flex-col",
          "text-[var(--omlette-label-helper-text-color)]",
          "text-[length:var(--omlette-label-helper-text-size)]",
          helperProps?.className
        )}
      >
        {Array.isArray(helper)
          ? helper.map((node, i) => <span key={i}>{node}</span>)
          : helper}
      </span>
    </label>
  );
};

export { Label };
