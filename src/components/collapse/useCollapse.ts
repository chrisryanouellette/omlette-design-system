import { useCallback, useMemo } from "react";
import { useCreateStore, UseCreateStore } from "@Utilities/store";

type CollapseStore = { isOpen: boolean; hasBeenOpened: boolean };

export type UseCollapse = {
  store: UseCreateStore<CollapseStore>;
  toggle: () => void;
};

const useCollapse = (): UseCollapse => {
  const store = useCreateStore<CollapseStore>({
    isOpen: false,
    hasBeenOpened: false,
  });

  const toggle = useCallback<UseCollapse["toggle"]>(() => {
    store.set({ isOpen: !store.get().isOpen, hasBeenOpened: true });
  }, [store]);

  return useMemo(
    () => ({
      store,
      toggle,
    }),
    [store, toggle]
  );
};

export { useCollapse };
