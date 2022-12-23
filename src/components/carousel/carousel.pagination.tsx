import { ButtonHTMLAttributes, useEffect, useState } from "react";
import { CarouselStore } from "./carousel";
import { useCarouselContext } from "./carousel.context";
import { concat } from "@Utilities/concat";
import { isUniqueSet } from "@Utilities/set";
import { useStore } from "@Utilities/store";
import { Button } from "@Components/button";

type PaginationButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  id: string;
};

const PaginationButton = ({
  className,
  id,
  ...rest
}: PaginationButtonProps): JSX.Element => {
  const [label, setLabel] = useState<string>("");
  const classes = concat("omlette-pagination-button", className);

  useEffect(() => {
    const elem = document.querySelector(`[id="${id}"]`);
    if (!elem) {
      throw new Error(`Carousel item with id "${id}" is not in the DOM.`);
    }
    const img = elem.querySelector("img");
    const figCaption = elem.querySelector("figcaption");

    setLabel(img?.alt ?? figCaption?.innerText ?? "");
  }, [id]);

  return <Button {...rest} aria-label={label} className={classes} />;
};

const currentStoreSelector = (store: CarouselStore): string | null =>
  store.current;
const sizeStoreSelector = (
  store: CarouselStore,
  prev: Set<string> | null
): Set<string> => {
  if (!prev) {
    return store.items;
  }
  return isUniqueSet(store.items, prev) ? new Set(store.items) : prev;
};

const CarouselPagination = (): JSX.Element => {
  const context = useCarouselContext();
  const items = useStore<CarouselStore, Set<string>>(
    context.store,
    sizeStoreSelector
  );
  const current = useStore<CarouselStore, string | null>(
    context.store,
    currentStoreSelector
  );

  const classes = concat("omlette-carousel-pagination");

  return (
    <div className={classes}>
      {[...items].map((id, i) => (
        <PaginationButton
          key={id}
          id={id}
          aria-setsize={items.size}
          aria-posinset={i}
          className={concat(current === id && "bg-red-100")}
          onClick={(): void => context.goTo(id)}
        />
      ))}
    </div>
  );
};

export { CarouselPagination, PaginationButton };
