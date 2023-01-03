import { FC, ReactNode } from "react";
import { isDrawerOpenKey } from "./store";
import { Button, ButtonProps } from "@Components/button";

type DrawerTriggerProps = ButtonProps & {
  drawer: string;
  element?: FC;
  children?: ReactNode;
};

const DrawerTrigger = ({
  drawer,
  element,
  children,
  ...rest
}: DrawerTriggerProps): JSX.Element => {
  const Element = element ?? Button;

  const handleClick = (): void => {
    const openId = isDrawerOpenKey.get();
    if (openId !== drawer) {
      isDrawerOpenKey.set(drawer);
    } else {
      isDrawerOpenKey.set(null);
    }
  };

  return (
    <Element {...rest} onClick={handleClick}>
      {children}
    </Element>
  );
};

export { DrawerTrigger };
