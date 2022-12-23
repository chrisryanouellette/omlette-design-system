import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { CarouselStore } from "./carousel";
import {
  CarouselContainerProvider,
  useCarouselContext,
} from "./carousel.context";
import { useStore } from "@Utilities/store";
import { concat } from "@Utilities/concat";

export type CarouselContainerProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

const currentStoreSelector = (store: CarouselStore): string | null =>
  store.current;

const CarouselContainer = ({
  children,
  className,
  ...rest
}: CarouselContainerProps): JSX.Element => {
  const context = useCarouselContext();
  const current = useStore(context.store, currentStoreSelector);
  const ref = useRef<HTMLDivElement>(null);
  const intersected = useRef<string | null>(null);
  const observer = useRef<IntersectionObserver>();
  const classes = concat("omlette-carousel-container", className);

  /* Handles syncing the state with the state with the item scrolled to */
  const handleScrollEnd = useCallback((): void => {
    const state = context.store.get();
    const lastIntersected = intersected.current;
    if (lastIntersected && state.current !== lastIntersected) {
      context.store.set({ current: lastIntersected });
    }
  }, [context]);

  const observe = (elem: HTMLElement | null): (() => void) => {
    if (elem) {
      observer.current?.observe(elem);
    }
    return () => {
      if (elem) {
        observer.current?.unobserve(elem);
      }
    };
  };

  useEffect(() => {
    /* Handle scrolling */
    if (!ref.current || !current) {
      return; // Still being initialized
    }
    const item = ref.current.querySelector(`[id="${current}"]`);
    if (!item) {
      throw new Error(`Carousel item with id "${current}" is not in the DOM.`);
    }
    item.scrollIntoView({ behavior: "smooth" });
  }, [current]);

  useEffect(() => {
    const elem = ref.current;
    /*
    We will use scrollend to synchronize the state.
    This needs to be done when the user uses a touch event to advance
    the carousel.
    */
    elem?.addEventListener("scrollend", handleScrollEnd);
    return function carouselScrollEndCleanup() {
      elem?.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [handleScrollEnd]);

  useEffect(() => {
    if (ref.current) {
      /* The observer to track which elements are visible within the carousel container */
      observer.current = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            /* Store the carousel item id so we can update it on scrollend */
            if (entry.isIntersecting) {
              intersected.current = entry.target.id;
            }
          }
        },
        {
          root: ref.current,
          threshold: 0.6,
        }
      );
    }
    return function intersectionObserverCarouselCleanup() {
      observer.current?.disconnect();
    };
  }, [context.store]);

  return (
    <CarouselContainerProvider observe={observe}>
      <div {...rest} ref={ref} className={classes}>
        {children}
      </div>
    </CarouselContainerProvider>
  );
};

export { CarouselContainer };
