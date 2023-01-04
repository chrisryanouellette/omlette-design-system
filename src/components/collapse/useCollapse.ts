import { useCallback, useMemo } from "react";
import { useCreateStore, UseCreateStore } from "@Utilities/store";

export type UseCollapse = {
  store: UseCreateStore<{ isOpen: boolean }>;
  toggle: () => void;
};

const useCollapse = (): UseCollapse => {
  const store = useCreateStore({ isOpen: false });

  const toggle = useCallback<UseCollapse["toggle"]>(() => {
    store.set({ isOpen: !store.get().isOpen });
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
