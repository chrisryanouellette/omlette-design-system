import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { createGlobalStore, useStore } from "../..";

export const portalStore = createGlobalStore("#root");

export type PortalProps = {
  elem?: HTMLElement | string;
  children?: ReactNode;
};

const Portal = ({
  children,
  elem: controlledElem,
}: PortalProps): JSX.Element => {
  const internalElem = useStore(portalStore);
  const elem = controlledElem ?? internalElem;

  const element =
    typeof elem === "string" ? document.querySelector(elem) : elem;

  if (!element) {
    throw new Error(
      `Element withing <Portal> component is not valid or could not be found`
    );
  }
  return createPortal(children, element);
};

export { Portal };
