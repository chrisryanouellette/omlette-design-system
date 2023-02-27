import { useCallback, useEffect, useMemo } from "react";
import { useCreateStore, UseCreateStore } from "./store";

export type UseBrowserStorageArgs<Store, Action> = {
  key: string;
  initial: Store;
  reducer?: (current: Store, action: Action) => Store;
  storage?: typeof globalThis.localStorage | typeof globalThis.sessionStorage;
};

export type UseBrowserStorage<Store, Action> = UseCreateStore<Store, Action> & {
  clear: () => void;
};

export function useBrowserStorage<Store, Action = Partial<Store>>({
  initial: baseInitial,
  key,
  reducer,
  storage = globalThis.localStorage,
}: UseBrowserStorageArgs<Store, Action>): UseBrowserStorage<Store, Action> {
  const store = useCreateStore<Store, Action>(baseInitial, reducer);

  const clear = useCallback(() => {
    storage.removeItem(key);
  }, [key, storage]);

  useEffect(() => {
    const previous = storage.getItem(key);
    const value = previous ? JSON.parse(previous) : baseInitial;
    store.set(value);
  }, [baseInitial, key, storage, store]);

  useEffect(() => {
    return store.subscribe((newStore) => {
      storage.setItem(key, JSON.stringify(newStore));
    });
  }, [key, storage, store]);

  return useMemo(() => ({ ...store, clear }), [clear, store]);
}
