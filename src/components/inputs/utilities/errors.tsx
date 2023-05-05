import { HTMLAttributes, ReactNode } from "react";
import { List, ListProps, ListItemProps } from "@Components/list";
import { concat } from "@Utilities/concat";

import "./errors.styles.css";

export type ErrorsProps = ListProps & {
  errors?: string[];
  children?: ReactNode;
  listItemProps?: ListItemProps;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
};

const Errors = ({
  children,
  errors,
  listItemProps,
  wrapperProps,
  ...rest
}: ErrorsProps): JSX.Element => {
  return (
    <div
      {...wrapperProps}
      className={concat(
        "omlette-input-errors-wrapper",
        wrapperProps?.className
      )}
    >
      {errors ? (
        <List {...rest}>
          {errors.map((error) => (
            <List.Item
              listStyle="icon"
              iconProps={{ name: "ri-error-warning-line" }}
              {...listItemProps}
              key={error}
            >
              {error}
            </List.Item>
          ))}
        </List>
      ) : (
        children
      )}
    </div>
  );
};

Errors.displayName = "Errors";

export { Errors };
