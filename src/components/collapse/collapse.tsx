import { ReactNode } from "react";
import { CollapsePanel } from "./collapse.panel";
import { CollapseTrigger } from "./collapse.trigger";
import { CollapseContext } from "./context";
import { UseCollapse, useCollapse } from "./useCollapse";
import { CollapseCarrot } from "./collapse.carrot";

import "./collapse.styles.css";

export type CollapseProps = {
  collapse?: UseCollapse;
  element?: "div" | "aside" | "section";
  children?: ReactNode;
};

const Collapse = ({
  children,
  collapse: controlledCollapse,
  element = "div",
}: CollapseProps): JSX.Element => {
  const internalCollapse = useCollapse();
  const collapse = controlledCollapse ?? internalCollapse;

  const Element = element;

  return (
    <CollapseContext.Provider value={collapse}>
      <Element>{children}</Element>
    </CollapseContext.Provider>
  );
};

Collapse.Trigger = CollapseTrigger;
Collapse.Panel = CollapsePanel;
Collapse.Carrot = CollapseCarrot;

export { Collapse };
