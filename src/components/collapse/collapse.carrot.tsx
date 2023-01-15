import { CSSTransition } from "react-transition-group";
import { HTMLAttributes, useRef } from "react";
import { Icon, IconProps } from "@Components/icon";
import { useStore } from "@Utilities/store";
import { concat } from "@Utilities/concat";
import { useCollapseContext } from "./context";

export type CollapseCarrotProps = Partial<IconProps> & {
  containerProps?: HTMLAttributes<HTMLSpanElement>;
  duration?: number;
};

const CollapseCarrot = ({
  containerProps,
  duration = 300,
  ...rest
}: CollapseCarrotProps): JSX.Element => {
  const context = useCollapseContext();
  const isOpen = useStore(context.store, (s) => s.isOpen);
  const ref = useRef<HTMLSpanElement>(null);

  return (
    <CSSTransition
      key="collapse"
      nodeRef={ref}
      in={isOpen}
      timeout={duration}
      classNames="omlette-collapse-carrot"
    >
      <span
        {...containerProps}
        className={concat("omlette-collapse-carrot", containerProps?.className)}
        ref={ref}
      >
        <Icon name="ri-arrow-up-s-fill" {...rest} />
      </span>
    </CSSTransition>
  );
};

export { CollapseCarrot };
