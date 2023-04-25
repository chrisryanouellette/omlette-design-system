import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type GlobalStoreKey<Store> = {
  subscriptions: Set<(value: Store) => void>;
};
export type GetStore<Store> = () => Store;
export type SetStore<Action> = (update: Action) => void;
export type SubscribeToStore<Store> = (
  cb: (store: Store) => void
) => () => void;

export type UseCreateStore<Store, Action = Partial<Store>> = {
  get: GetStore<Store>;
  set: SetStore<Action>;
  subscribe: SubscribeToStore<Store>;
};

export type ReadOnlyUseCreateStore<Store> = Omit<UseCreateStore<Store>, "set">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalStore = new Map<GlobalStoreKey<any>, any>();

/*
 * Creates a store outside of a React component.
 * This is useful when you want multiple components without a common parent
 * to be able to communicate.
 */
export const createGlobalStore = <T>(value: T): UseCreateStore<T> => {
  const key: GlobalStoreKey<T> = {
    subscriptions: new Set(),
  };
  globalStore.set(key, value);

  const get: UseCreateStore<T>["get"] = () => globalStore.get(key);
  const set: UseCreateStore<T>["set"] = (value) => {
    const prev = globalStore.get(key);
    globalStore.set(key, { ...prev, ...value });
    key.subscriptions.forEach((sub) => sub(get()));
  };
  const subscribe: UseCreateStore<T>["subscribe"] = (cb) => {
    key.subscriptions.add(cb);
    return () => key.subscriptions.delete(cb);
  };
  return { get, set, subscribe };
};

/*
 * Used to create a new store without using useState.
 * This is most beneficial when passing state down through context.
 * This will avoid updating the entire component tree when the value changes.
 */
export const useCreateStore = <Store, Action = Partial<Store>>(
  initial: Store,
  reducer?: (current: Store, action: Action) => Store
): UseCreateStore<Store, Action> => {
  const store = useRef<Store>(initial);
  const subscriptions = useRef<Set<(store: Store) => void>>(new Set());

  const get = useCallback<GetStore<Store>>(() => store.current, []);

  const set = useCallback<SetStore<Action>>(
    (update) => {
      store.current = reducer
        ? reducer(store.current, update)
        : { ...store.current, ...update };
      /** Notify all subscription when store is set */
      subscriptions.current.forEach((sub) => sub(store.current));
    },
    [reducer]
  );

  const subscribe = useCallback<SubscribeToStore<Store>>((cb) => {
    subscriptions.current.add(cb);
    return () => subscriptions.current.delete(cb);
  }, []);

  return useMemo(() => ({ get, set, subscribe }), [get, set, subscribe]);
};

export type SelectorFn<Store, Selected = Store> = (
  store: Store,
  prev: Selected | null
) => Selected;

/**
 * A hook for consuming a store, usually after it is passed down through context.
 *
 * @see {@link [Storybook](https://design-system.chrisouellette.com/?path=/docs/utilities-store--page)}
 */
export const useStore = <Store, Selected = Store, Action = Partial<Store>>(
  store: UseCreateStore<Store, Action> | ReadOnlyUseCreateStore<Store>,
  selector?: SelectorFn<Store, Selected>
): Selected => {
  const [state, setStore] = useState<ReturnType<GetStore<Store | Selected>>>(
    () => (selector ? selector(store.get(), null) : store.get())
  );

  useEffect(() => {
    return store.subscribe((newStore) => {
      setStore((prev) =>
        selector ? selector(newStore, prev as Selected) : newStore
      );
    });
  }, [selector, store]);

  return state as Selected;
};
