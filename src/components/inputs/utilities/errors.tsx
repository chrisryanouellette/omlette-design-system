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
        "fill-[var(--omlette-input-errors-fill)]",
        "text-[var(--omlette-input-errors-text-color)]",
        "text-[length:var(--omlette-input-errors-text-size)]",
        wrapperProps?.className
      )}
    >
      {errors ? (
        <List {...rest}>
          {errors.map((error) => (
            <List.Item
              iconProps={{ name: "ri-error-warning-line" }}
              listStyle="icon"
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
