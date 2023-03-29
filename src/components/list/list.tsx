import { HTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/concat";
import { ListItem, ListStyle } from "./list.item";
import { ListProvider } from "./context";

import "./list.styles.css";

export type ListProps = HTMLAttributes<HTMLUListElement> & {
  listStyle?: ListStyle;
  ordered?: boolean;
  children?: ReactNode;
};

const List = ({
  children,
  className,
  listStyle,
  ordered,
  ...rest
}: ListProps): JSX.Element => {
  const Element = ordered ? "ol" : "ul";

  const classes = concat("omlette-list", className);

  return (
    <ListProvider listStyle={listStyle}>
      <Element {...rest} className={classes}>
        {children}
      </Element>
    </ListProvider>
  );
};

List.Item = ListItem;

export { List };
