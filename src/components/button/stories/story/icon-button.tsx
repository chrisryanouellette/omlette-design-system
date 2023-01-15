import { IconButtonControls } from "../button.stories";
import { IconButton } from "@Components/button/icon-button";

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
