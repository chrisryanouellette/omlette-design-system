import { HTMLAttributes, ReactNode, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { useStore } from "@Utilities/store";
import { concat } from "@Utilities/concat";
import { useTabTrap } from "@Utilities/tab";
import { styles } from "@Utilities/styles";
import { useCollapseContext } from "./context";

export type CollapsePanelProps = HTMLAttributes<HTMLElement> & {
  container?: "div" | "section" | "aside";
  containerProps?: HTMLAttributes<HTMLElement>;
  element?: "div" | "section" | "aside";
  duration?: number;
  trapFocus?: boolean;
  children?: ReactNode;
};

const CollapsePanel = ({
  children,
  className,
  container = "div",
  containerProps,
  duration = 300,
  element = "div",
  trapFocus,
  ...rest
}: CollapsePanelProps): JSX.Element => {
  const context = useCollapseContext();
  const isOpen = useStore(context.store, (s) => s.isOpen);
  const ref = useRef<HTMLDivElement>(null);
  const { beginTrap, initialize, releaseTrap, subscribe } = useTabTrap(ref);
  const Container = container;
  const Element = element;

  const style = styles({
    "--omlette-collapse-duration": `${duration}ms`,
  });

  useEffect(() => {
    if (isOpen) {
      trapFocus ? initialize() : beginTrap();
    }
    return function collapseTabTrapCleanUp() {
      releaseTrap();
    };
  }, [beginTrap, initialize, isOpen, releaseTrap, trapFocus]);

  useEffect(() => {
    return subscribe((event) => {
      if (event === "releaseTrap") {
        isOpen && context.store.set({ isOpen: false });
      }
    });
  }, [context.store, isOpen, subscribe]);

  return (
    <CSSTransition
      key="collapse"
      unmountOnExit
      nodeRef={ref}
      in={isOpen}
      timeout={duration}
      classNames="omlette-collapse-panel"
    >
      <Container
        {...containerProps}
        className={concat(
          "omlette-collapse-panel-container",
          containerProps?.className
        )}
      >
        <Element
          {...rest}
          ref={ref}
          style={style}
          className={concat("omlette-collapse-panel", className)}
        >
          {children}
        </Element>
      </Container>
    </CSSTransition>
  );
};

export { CollapsePanel };
