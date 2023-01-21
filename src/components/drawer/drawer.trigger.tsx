import { FC, MouseEvent, ReactNode } from "react";
import { Button, ButtonProps } from "@Components/button";
import { isDrawerOpenKey } from "./store";

export type DrawerTriggerProps = ButtonProps & {
  drawer: string;
  element?: FC;
  children?: ReactNode;
  onBeforeClose?: (e: MouseEvent<HTMLElement>) => void;
  onAfterClose?: (e: MouseEvent<HTMLElement>) => void;
};

const DrawerTrigger = ({
  children,
  drawer,
  element,
  onAfterClose,
  onBeforeClose,
  onClick,
  ...rest
}: DrawerTriggerProps): JSX.Element => {
  const Element = element ?? Button;

  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    const openId = isDrawerOpenKey.get();
    onBeforeClose?.(e);
    if (openId !== drawer) {
      isDrawerOpenKey.set(drawer);
    } else {
      isDrawerOpenKey.set(null);
    }
    onClick?.(e);
    onAfterClose?.(e);
  };

  return (
    <Element {...rest} onClick={handleClick}>
      {children}
    </Element>
  );
};

export { DrawerTrigger };
