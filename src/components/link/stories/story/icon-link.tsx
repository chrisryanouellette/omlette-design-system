import { IconLink } from "@Components/index";
import { IconOnlyLinkControls } from "../link.stories";

const IconLinkStory = ({
  Children: children,
  Href: href,
  "Icon Name": name,
  Position: position = "left",
  Title: title,
  ...rest
}: IconOnlyLinkControls): JSX.Element => (
  <IconLink {...rest} href={href} name={name} position={position} title={title}>
    {children}
  </IconLink>
);

export { IconLinkStory };
