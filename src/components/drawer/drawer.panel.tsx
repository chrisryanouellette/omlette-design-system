import { HTMLAttributes, ReactNode, useEffect, useId, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useTabTrap } from "@Utilities/tab";
import { useStore } from "@Utilities/store";
import { Portal } from "@Components/utilities/Portal";
import { concat } from "@Utilities/concat";
import { styles } from "@Utilities/styles";
import { drawerStore } from "./store";

export type DrawerPanelProps = HTMLAttributes<HTMLElement> & {
  container?: "div" | "aside" | "section";
  containerProps?: HTMLAttributes<HTMLElement>;
  element?: "div";
  trapFocus?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  duration?: number;
  size?: number | "full";
  unmountChildren?: boolean;
  children?: ReactNode;
};

const DrawerPanel = ({
  container = "div",
  containerProps,
  element = "div",
  className,
  style: controlledStyle = {},
  id: controlledId,
  trapFocus = true,
  position = "bottom",
  duration,
  unmountChildren = true,
  children,
  ...rest
}: DrawerPanelProps): JSX.Element => {
  const internalId = useId();
  const id = controlledId ?? internalId;
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = useStore(drawerStore, (state) => state.open === id);
  const { beginTrap, initialize, releaseTrap, subscribe } = useTabTrap(ref);
  const Element = element;
  const Container = container;

  const style = styles({
    "--omlette-drawer-duration": duration && `${duration}ms`,
    ...controlledStyle,
  });

  useEffect(() => {
    drawerStore.set({ keys: drawerStore.get().keys.add(id) });
    return function removeDrawerFromGlobalStoreCleanup() {
      const keys = drawerStore.get().keys;
      keys.delete(id);
      drawerStore.set({ keys });
    };
  }, [id]);

  useEffect(() => {
    if (trapFocus && isOpen) {
      beginTrap();
    } else {
      initialize();
    }
    return function drawerTabTrapCleanup() {
      trapFocus && releaseTrap();
    };
  }, [beginTrap, initialize, releaseTrap, trapFocus, isOpen]);

  useEffect(() => {
    return subscribe((event) => {
      if (event === "releaseTrap" && isOpen) {
        drawerStore.set({ open: null });
      }
    });
  }, [isOpen, subscribe]);

  return (
    <Portal>
      <CSSTransition
        unmountOnExit={unmountChildren}
        key="drawer"
        in={isOpen}
        nodeRef={ref}
        timeout={duration ?? 300}
        classNames="omlette-drawer-panel"
      >
        <Container
          {...containerProps}
          className={concat(
            "omlette-drawer-container",
            (position === "bottom" || position === "top") &&
              "omlette-drawer-container-vertical",
            containerProps?.className
          )}
        >
          <Element
            {...rest}
            style={style}
            ref={ref}
            className={concat(
              "omlette-drawer-panel",
              `omlette-drawer-panel-${position}`,
              className
            )}
          >
            {children}
          </Element>
        </Container>
      </CSSTransition>
    </Portal>
  );
};

export { DrawerPanel };
