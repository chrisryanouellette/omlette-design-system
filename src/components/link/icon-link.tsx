import { ChildOrNull, Icon, IconProps } from "..";
import { Link, LinkProps } from "./link";
import { concat } from "@Utilities";

import "./icon-link.styles.css";

export type IconLinkProps = LinkProps & {
  name?: string;
  position?: "right" | "left";
  iconProps?: IconProps;
};

function IconLink({
  children,
  className,
  iconProps,
  name = "ri-external-link-line",
  position = "left",
  ...rest
}: IconLinkProps): JSX.Element {
  const classes = concat(
    "omlette-icon-link",
    position === "left" ? "left" : "right",
    className
  );

  return (
    <Link {...rest} className={classes}>
      <ChildOrNull condition={position === "left"}>
        <Icon {...iconProps} size="sm" name={name} />
      </ChildOrNull>
      {children}
      <ChildOrNull condition={position === "right"}>
        <Icon {...iconProps} name={name} />
      </ChildOrNull>
    </Link>
  );
}

export { IconLink };
