import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { uuid } from "@Utilities/id";
import { GenericFields, UseForm } from "./useForm";

type UseFormList = {
  items: Set<string>;
  add: () => void;
  remove: (id: string) => void;
  map: Array<string>["map"];
};

export function useFormList<Fields extends GenericFields>(
  form: UseForm<Fields>,
  name: keyof Fields
): UseFormList {
  const [items, setItems] = useState<Set<string>>(new Set());
  const initial = useRef<number | null>(null);

  const map = useCallback<UseFormList["map"]>(
    (cb) => {
      return [...items].map(cb);
    },
    [items]
  );

  const add = useCallback<UseFormList["add"]>(() => {
    setItems(new Set(items.add(uuid())));
  }, [items]);

  const remove = useCallback<UseFormList["remove"]>((id) => {
    setItems((prev) => {
      prev.delete(id);
      return new Set(prev);
    });
  }, []);

  useEffect(
    function handleInitFormListWithDefaultValue() {
      const state = form.fields.get();
      const defaultValue = state[name]?.defaultValue;
      if (defaultValue && Array.isArray(defaultValue)) {
        if (initial.current === null) {
          setItems(new Set(defaultValue.map(() => uuid())));
          initial.current = defaultValue.length;
        }
      }
    },
    [form, name]
  );

  /* Handles setting the default when the parent form has a default */
  useEffect(
    function setDefaultValueFromParent() {
      return form.fields.subscribe(function (state) {
        const defaultValue = state[name]?.defaultValue;
        if (defaultValue && Array.isArray(defaultValue)) {
          if (initial.current === null) {
            setItems(new Set(defaultValue.map(() => uuid())));
            initial.current = defaultValue.length;
          }
        }
      });
    },
    [form, name]
  );

  return useMemo(
    () => ({ items, add, remove, map }),
    [add, items, map, remove]
  );
}
