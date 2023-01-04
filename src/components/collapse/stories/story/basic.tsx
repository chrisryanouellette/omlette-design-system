import { IconButton } from "@Components/button";
import { Collapse } from "@Components/collapse/collapse";
import { bindTemplate } from "@Storybook/types";

const BasicCollapseStory = bindTemplate(() => {
  return (
    <Collapse>
      <Collapse.Trigger element={IconButton} name="ri-add-fill" />
      <Collapse.Panel>
        <h2>Panel Content</h2>
      </Collapse.Panel>
    </Collapse>
  );
});

export { BasicCollapseStory };
