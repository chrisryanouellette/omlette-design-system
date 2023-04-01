import { FC } from "react";
import { bindTemplate } from "@Storybook/types";
import { Link } from "@Components/index";
import { LinkControls } from "../link.stories";

const LinkStory = bindTemplate<FC<LinkControls>>(
  ({ Children: children, Href: href, ...rest }) => (
    <p>
      Click here to{" "}
      <Link {...rest} href={href}>
        {children}
      </Link>
    </p>
  )
);

export { LinkStory };
