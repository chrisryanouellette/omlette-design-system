import { FC } from "react";
import { Button, ButtonProps } from "./button";
import { concat } from "@Utilities/concat";
import { Icon, IconProps } from "@Components/icon";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";

import "./button.styles.css";
import "./icon-button.styles.css";

export type IconButtonProps = ButtonProps & {
  name: string;
  position?: "left" | "right";
  title?: IconProps["title"];
  iconProps?: IconProps;
};

const IconButton: FC<IconButtonProps> = ({
  children,
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
      <span>{children}</span>
      <ChildOrNull condition={position === "right"}>
        <Icon name={name} title={title} {...iconProps} />
      </ChildOrNull>
    </Button>
  );
};

export { IconButton };
