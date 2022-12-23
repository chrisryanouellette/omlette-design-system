import { FC } from "react";
import { ButtonControls } from "../button.stories";
import { bindTemplate } from "@Storybook/types";
import { Button } from "@Components/button";

const TextButtonStory = bindTemplate<FC<ButtonControls>>(
  ({ Children, Size: size, Theme: theme, Variant: variant, ...rest }) => (
    <Button
      {...rest}
      className={theme}
      size={size}
      variant={variant}
      type="button"
    >
      {Children}
    </Button>
  )
);

export { TextButtonStory };
