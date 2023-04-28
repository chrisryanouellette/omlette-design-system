import { FC, HTMLAttributes } from "react";
import { concat } from "@Utilities/concat";
import { Icon, IconProps } from "@Components/icon";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";
import { Button, ButtonProps } from "./button";

import "./button.styles.css";
import "./icon-button.styles.css";

export type IconButtonProps = ButtonProps & {
  name: string;
  position?: "left" | "right";
  title?: IconProps["title"];
  iconProps?: Omit<IconProps, "name">;
  childrenContainerProps?: HTMLAttributes<HTMLSpanElement>;
};

const IconButton: FC<IconButtonProps> = ({
  children,
  childrenContainerProps,
  className,
  iconProps,
  name = "ri-star-line",
  position = "left",
  size,
  title,
  variant,
  ...rest
}) => {
  return (
    <Button
      {...rest}
      className={concat(!children && "icon-only", size, variant, className)}
    >
      <ChildOrNull condition={position === "left"}>
        <Icon name={name} title={title} {...iconProps} />
      </ChildOrNull>
      {children ? <span {...childrenContainerProps}>{children}</span> : null}
      <ChildOrNull condition={position === "right"}>
        <Icon name={name} title={title} {...iconProps} />
      </ChildOrNull>
    </Button>
  );
};

export { IconButton };
