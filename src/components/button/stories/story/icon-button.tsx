import { IconButton } from "@Components/button/icon-button";
import { IconButtonControls } from "../button.stories";

const IconButtonStory = ({
  Children,
  Name,
  Position,
  Size: size,
  Theme: theme,
  Title: title,
  Variant: variant,
  ...rest
}: IconButtonControls): JSX.Element => (
  <IconButton
    {...rest}
    className={theme}
    size={size}
    variant={variant}
    name={Name}
    title={title}
    position={Position}
    type="button"
  >
    {Children}
  </IconButton>
);

export { IconButtonStory };
