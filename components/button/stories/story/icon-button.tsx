import { IconButtonControls } from "../button.stories";
import { IconButton } from "@Components/button/icon-button";

const IconButtonStory = ({
  Children,
  Name,
  Size: size,
  Variant: variant,
  Theme: theme,
  Title: title,
  Position,
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
