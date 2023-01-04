import { HTMLAttributes, ReactNode, useEffect, useId, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { drawersKey, isDrawerOpenKey } from "./store";
import { useTabTrap } from "@Utilities/tab";
import { useStore } from "@Utilities/store";
import { Portal } from "@Components/utilities/Portal";
import { concat } from "@Utilities/concat";
import { styles } from "@Utilities/styles";

type DrawerPanelProps = HTMLAttributes<HTMLElement> & {
  container?: "div" | "aside" | "section";
  containerProps?: HTMLAttributes<HTMLElement>;
  element?: "div";
  trapFocus?: boolean;
  position?: "top" | "bottom" | "left" | "right";
  duration?: number;
  size?: number | "full";
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
  children,
  ...rest
}: DrawerPanelProps): JSX.Element => {
  const internalId = useId();
  const id = controlledId ?? internalId;
  const ref = useRef<HTMLDivElement>(null);
  const isOpen = useStore(isDrawerOpenKey, (s) => s === id);
  const { beginTrap, initialize, releaseTrap, subscribe } = useTabTrap(ref);
  const Element = element;
  const Container = container;

  const style = styles({
    "--omlette-drawer-duration": duration && `${duration}ms`,
    ...controlledStyle,
  });

  useEffect(() => {
    drawersKey.set(drawersKey.get().add(id));
    return function removeDrawerFromGlobalStoreCleanup() {
      const ids = drawersKey.get();
      ids.delete(id);
      drawersKey.set(ids);
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
        isDrawerOpenKey.set(null);
      }
    });
  }, [isOpen, subscribe]);

  return (
    <Portal>
      <CSSTransition
        unmountOnExit
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
