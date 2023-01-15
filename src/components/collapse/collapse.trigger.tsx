import { FC, ReactNode } from "react";
import { Button, ButtonProps } from "@Components/button";
import { concat } from "@Utilities/concat";
import { useCollapseContext } from "./context";

export type CollapseTriggerProps = ButtonProps & {
  element?: FC<any>;
  children?: ReactNode;
};

const CollapseTrigger = ({
  children,
  className,
  element,
  ...rest
}: CollapseTriggerProps): JSX.Element => {
  const context = useCollapseContext();
  const Element = element ?? Button;

  return (
    <Element
      {...rest}
      className={concat("omlette-collapse-trigger", className)}
      onClick={context.toggle}
    >
      {children}
    </Element>
  );
};

export { CollapseTrigger };
