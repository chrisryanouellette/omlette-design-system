import { FC } from "react";
import { bindTemplate } from "@Storybook/types";
import { Button } from "@Components/button";
import { ButtonControls } from "../button.stories";

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
