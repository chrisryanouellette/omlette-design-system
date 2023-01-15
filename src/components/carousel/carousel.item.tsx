import { HTMLAttributes, ReactNode, useEffect, useId, useRef } from "react";
import {
  useCarouselContainerContext,
  useCarouselContext,
} from "./carousel.context";
import { concat } from "@Utilities/concat";

type CarouselItemProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

const CarouselItem = ({
  children,
  className,
  id: controlledId,
  ...rest
}: CarouselItemProps): JSX.Element => {
  const context = useCarouselContext();
  const container = useCarouselContainerContext();
  const internalId = useId();
  const id = controlledId ?? internalId;
  const ref = useRef<HTMLDivElement>(null);
  const classes = concat("omlette-carousel-item", className);

  useEffect(() => {
    return context.register(id);
  }, [context, id]);

  useEffect(() => {
    return container.observe(ref.current);
  }, [container]);

  return (
    <div {...rest} ref={ref} id={id} className={classes}>
      {children}
    </div>
  );
};

export { CarouselItem };
