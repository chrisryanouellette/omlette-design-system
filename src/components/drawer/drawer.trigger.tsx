import { FC, MouseEvent, ReactNode } from "react";
import { Button, ButtonProps } from "@Components/button";
import { drawerStore } from "./store";

export type DrawerTriggerProps = ButtonProps & {
  drawer: string;
  // Allow any functional component to be passed as the drawer trigger
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element?: FC<any>;
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
    const openId = drawerStore.get().open;
    onBeforeClose?.(e);
    if (openId !== drawer) {
      drawerStore.set({ open: drawer });
    } else {
      drawerStore.set({ open: null });
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
