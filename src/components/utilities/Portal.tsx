import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { createGlobalStore, useStore } from "@Utilities";

export type PortalState = {
  element: string;
};

export const portalStore = createGlobalStore({ element: "#root" });

function elementSelector(state: PortalState): string {
  return state.element;
}

export type PortalProps = {
  elem?: HTMLElement | string;
  children?: ReactNode;
};

const Portal = ({
  children,
  elem: controlledElem,
}: PortalProps): JSX.Element => {
  const internalElem = useStore(portalStore, elementSelector);
  const elem = controlledElem ?? internalElem;

  const element =
    typeof elem === "string" ? document.querySelector(elem) : elem;

  if (!element) {
    throw new Error(
      `Element within <Portal> component is not valid or could not be found`
    );
  }

  return createPortal(children, element);
};

export { Portal };
