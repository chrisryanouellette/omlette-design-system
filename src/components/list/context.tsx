import { createContext, ReactNode, useContext } from "react";
import { ListStyle } from "./list.item";

type ListContextType = {
  listStyle?: ListStyle;
};

const ListContext = createContext<ListContextType | null>(null);

type ListProviderProps = ListContextType & {
  children?: ReactNode;
};

export function ListProvider({
  children,
  ...rest
}: ListProviderProps): JSX.Element {
  return <ListContext.Provider value={rest}>{children}</ListContext.Provider>;
}

export function useListContext(): ListContextType {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('"useListContext" must be used within a <ListProvider>');
  }

  return context;
}
