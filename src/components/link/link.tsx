import { ComponentProps } from "react";
import { concat } from "@Utilities";

import "./link.styles.css";

export type LinkProps = ComponentProps<"a"> & {
  href: string;
};

function Link({ children, className, ...rest }: LinkProps): JSX.Element {
  const classes = concat("omlette-link", className);

  return (
    <a {...rest} className={classes}>
      {children}
    </a>
  );
}

export { Link };
