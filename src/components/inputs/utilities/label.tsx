import { HTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/concat";

import "./label.styles.css";

export type LabelProps = HTMLAttributes<HTMLLabelElement> & {
  children?: ReactNode;
  helper?: ReactNode | ReactNode[];
  required?: boolean;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
};

const Label = ({
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
        {children} {required ? "( Required )" : ""}
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
