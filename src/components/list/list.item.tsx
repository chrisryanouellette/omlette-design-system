import { HTMLAttributes, ReactNode } from "react";
import { concat } from "@Utilities/concat";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";
import { Icon, IconProps } from "@Components/icon";
import { useListContext } from "./context";

export type ListStyle =
  | "bullet"
  | "icon"
  | "number"
  | "outline"
  | "square"
  | "none";

const listItemStylesMap: Record<ListStyle, string> = {
  bullet: "list-disc",
  number: "list-decimal",
  outline: "list-[circle]",
  square: "list-[square]",
  icon: "list-none",
  none: "list-none",
};

export type ListItemProps = HTMLAttributes<HTMLLIElement> & {
  children?: ReactNode;
  iconProps?: IconProps;
  listStyle?: ListStyle;
  wrapperProps?: HTMLAttributes<HTMLSpanElement>;
};

const ListItem = ({
  children,
  className,
  iconProps,
  listStyle: controlledListStyle,
  wrapperProps,
  ...rest
}: ListItemProps): JSX.Element => {
  const { listStyle: inheritedListStyle } = useListContext();
  const listStyle = controlledListStyle ?? inheritedListStyle ?? "none";
  const customMarker = listStyle === "icon";

  const classes = concat(
    "omlette-list-item",
    listItemStylesMap[listStyle],
    className
  );

  const wrapperClassName = concat(
    "omlette-list-marker",
    wrapperProps?.className
  );

  return (
    <li
      {...rest}
      className={classes}
      data-list-style={customMarker ? "custom" : "standard"}
    >
      <ChildOrNull condition={listStyle === "icon"}>
        <span {...wrapperProps} className={wrapperClassName}>
          <Icon name="ri-add-line" {...iconProps} viewBox="0 0 24 24" />
        </span>
      </ChildOrNull>
      {children}
    </li>
  );
};

export { ListItem };
