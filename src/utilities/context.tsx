import { useContext as useReactContext, createContext, Context } from "react";

export type ContextFactory<T> = [
  context: Context<T | null>,
  useContext: () => T
];

export function contextFactory<T>(): ContextFactory<T> {
  const Context = createContext<T | null>(null);

  function useContext(): T {
    const inherited = useReactContext(Context);

    if (!inherited) {
      throw new Error("useContext must be used within a context provider");
    }

    return inherited;
  }

  return [Context, useContext];
}
