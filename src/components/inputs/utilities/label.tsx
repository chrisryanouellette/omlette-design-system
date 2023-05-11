import { HTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/concat";

import "./label.styles.css";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  helper?: ReactNode | ReactNode[];
  required?: boolean;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  afterLabel?: ReactNode;
};

const Label = ({
  afterLabel,
  children,
  helper,
  required,
  wrapperProps,
  ...rest
}: LabelProps): JSX.Element => {
  return (
    <div
      {...wrapperProps}
      className={concat("omlette-input-label-wrapper", wrapperProps?.className)}
    >
      <label {...rest}>
        <span>
          {children} {required ? "( Required )" : ""}
          {afterLabel}
        </span>
        <span>
          {Array.isArray(helper)
            ? helper.map((node, i) => <span key={i}>{node}</span>)
            : helper}
        </span>
      </label>
    </div>
  );
};

export { Label };
