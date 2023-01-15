import { HTMLAttributes, ReactNode } from "react";
import { ListItem } from "./list.item";
import { concat } from "@Utilities/concat";

import "./list.styles.css";

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  ordered?: boolean;
  children?: ReactNode;
};

const List = ({
  children,
  className,
  ordered,
  ...rest
}: ListProps): JSX.Element => {
  const Element = ordered ? "ol" : "ul";

  const classes = concat("omlette-list", className);

  return (
    <Element {...rest} className={classes}>
      {children}
    </Element>
  );
};

List.Item = ListItem;

export { List };
