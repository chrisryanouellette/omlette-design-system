import { FC } from "react";
import { Collapse } from "@Components/collapse/collapse";
import { bindTemplate } from "@Storybook/types";
import { CollapseControls } from "../collapse.stories";

const BasicCollapseStory = bindTemplate<FC<CollapseControls>>(
  ({ "Unmount Children": unmountChildren }) => {
    return (
      <Collapse>
        <Collapse.Trigger>
          Expand Panel
          <Collapse.Carrot />
        </Collapse.Trigger>
        <Collapse.Panel unmountChildren={unmountChildren === "true"}>
          <h2>Panel Content</h2>
        </Collapse.Panel>
      </Collapse>
    );
  }
);

export { BasicCollapseStory };
