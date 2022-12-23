import { HTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/concat";
import "./container.styles.css";

export type ContainerProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  element?: "main" | "aside" | "section" | "div";
  placement?: "left" | "right" | "center";
};

const Container = ({
  children,
  className,
  element = "main",
  placement,
  ...rest
}: ContainerProps): JSX.Element => {
  const Element = element;

  const classes = concat("omlette-container", placement, className);

  return (
    <Element {...rest} className={classes}>
      {children}
    </Element>
  );
};

export { Container };
