import { useCallback, useMemo } from "react";
import { uuid } from "@Utilities/id";
import { useCreateStore, useStore } from "../../utilities";
import { FormFields, GenericFields, UseForm } from "./useForm";

type UseFormList = {
  items: Set<string>;
  add: () => void;
  remove: (id: string) => void;
  map: Array<string>["map"];
};

const original = new Set<string>();

export function useFormList<Fields extends GenericFields>(
  form: UseForm<Fields>,
  name: keyof Fields
): UseFormList {
  const store = useCreateStore<{ items: Set<string> }>({
    items: new Set(original),
  });
  useStore(store);
  useStore<FormFields<Fields>, boolean>(form.fields, (state, prev) => {
    const defaultValue = state[name]?.defaultValue;
    if (!prev && defaultValue && Array.isArray(defaultValue)) {
      const update = new Set(defaultValue.map(() => uuid()));
      store.set({ items: update });
      return true;
    }
    return prev ?? false;
  });

  const map = useCallback<UseFormList["map"]>(
    (cb) => {
      const items = store.get().items;
      return [...items].map(cb);
    },
    [store]
  );

  const add = useCallback<UseFormList["add"]>(() => {
    const prev = store.get().items;
    store.set({ items: new Set(prev.add(uuid())) });
  }, [store]);

  const remove = useCallback<UseFormList["remove"]>(
    (id) => {
      const prev = store.get().items;
      prev.delete(id);
      store.set({ items: new Set(prev) });
    },
    [store]
  );

  return useMemo(
    () => ({ items: store.get().items, add, remove, map }),
    [add, store, map, remove]
  );
}
