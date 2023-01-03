import { ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  elem?: HTMLElement | string;
  children?: ReactNode;
};

const Portal = ({ elem = "#root", children }: PortalProps): JSX.Element => {
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
