import { FC } from "react";
import { IconControls } from "../icon.stories";
import { bindTemplate } from "@Storybook/types";
import { Icon } from "@Components/icon";
import { concat } from "@Utilities/concat";

const IconStory = bindTemplate<FC<IconControls>>(({ Name, Size, ...rest }) => (
  <Icon
    {...rest}
    className={concat("bg-teal-100", "p-1", "rounded", "fill-slate-800")}
    name={Name}
    size={Size}
  />
));

export { IconStory };
