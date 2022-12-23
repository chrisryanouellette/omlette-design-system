import { useCallback, useMemo } from "react";
import { CarouselStore } from "./carousel";
import { useCreateStore, UseCreateStore } from "@Utilities/store";

export type UseCarouselProps = {
  start?: string | null;
};

export type UseCarousel = {
  store: UseCreateStore<CarouselStore>;
  register: (id: string) => () => void;
  goTo: (id: string) => void;
  next: () => void;
  previous: () => void;
};

const useCarousel = ({ start }: UseCarouselProps): UseCarousel => {
  const store = useCreateStore<CarouselStore>({
    items: new Set(),
    current: start ?? null,
  });

  const register = useCallback<UseCarousel["register"]>(
    (id) => {
      const state = store.get();
      store.set({ items: state.items.add(id), current: state.current || id });
      /*
        Will remove the carousel id from the store and reset the current if
        it is set to the id.
        */
      return () => {
        const newState = store.get();
        newState.items.delete(id);
        const items = [...newState.items];
        const newCurrent =
          newState.current === id ? items[0] : newState.current;
        store.set({ items: newState.items, current: newCurrent });
      };
    },
    [store]
  );

  const goTo = useCallback<UseCarousel["goTo"]>(
    (id: string) => {
      const state = store.get();
      if (!state.items.has(id)) {
        throw new Error(`Id "${id}" is not a carousel item.`);
      }
      store.set({ current: id });
    },
    [store]
  );

  const next = useCallback<UseCarousel["next"]>(() => {
    const state = store.get();
    const items = [...state.items];
    const index = items.indexOf(state.current || items[0]);
    /* End of carousel */
    if (state.items.size - 1 === index) {
      return store.set({ current: items[0] });
    }
    return store.set({ current: items[index + 1] });
  }, [store]);

  const previous = useCallback<UseCarousel["previous"]>(() => {
    const state = store.get();
    const items = [...state.items];
    const index = items.indexOf(state.current || items[0]);
    /* Beginning of carousel */
    if (index === 0) {
      return store.set({ current: items.pop() });
    }
    return store.set({ current: items[index - 1] });
  }, [store]);

  return useMemo(
    () => ({ store, register, goTo, next, previous }),
    [goTo, next, previous, register, store]
  );
};

export { useCarousel };
