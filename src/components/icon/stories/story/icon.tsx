import { FC } from "react";
import { bindTemplate } from "@Storybook/types";
import { Icon } from "@Components/icon";
import { concat } from "@Utilities/concat";
import { IconControls } from "../icon.stories";

const IconStory = bindTemplate<FC<IconControls>>(({ Name, Size, ...rest }) => (
  <Icon
    {...rest}
    className={concat("bg-teal-100", "p-1", "rounded", "fill-slate-800")}
    name={Name}
    size={Size}
  />
));

export { IconStory };
