import { AriaAttributes, FC, SVGAttributes, useId } from "react";
import { concat } from "@Utilities/concat";

import "./icon.styles.css";

export type IconProps = SVGAttributes<SVGElement> & {
  name: string;
  title?: string;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const Icon: FC<IconProps> = ({
  className,
  href = "remixicon.symbol.svg",
  name,
  role,
  size,
  title,
  ...rest
}) => {
  const id = useId();

  const ariaAttributes: AriaAttributes = {};
  const svgPros: SVGAttributes<SVGElement> = {};

  if (title) {
    ariaAttributes["aria-labelledby"] = id;
    svgPros["role"] = role || "img";
  } else {
    ariaAttributes["aria-hidden"] = true;
  }

  return (
    <svg
      {...rest}
      {...ariaAttributes}
      {...svgPros}
      className={concat("omlette-icon", size, className)}
      focusable={false}
    >
      {title && <title id={id}>{title}</title>}
      <use aria-hidden="true" href={`${href}#${name}`} />
    </svg>
  );
};

export { Icon };
