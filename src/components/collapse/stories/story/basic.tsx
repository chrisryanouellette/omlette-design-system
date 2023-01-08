import { Collapse } from "@Components/collapse/collapse";
import { bindTemplate } from "@Storybook/types";

const BasicCollapseStory = bindTemplate(() => {
  return (
    <Collapse>
      <Collapse.Trigger>
        Expand Panel
        <Collapse.Carrot />
      </Collapse.Trigger>
      <Collapse.Panel>
        <h2>Panel Content</h2>
      </Collapse.Panel>
    </Collapse>
  );
});

export { BasicCollapseStory };
