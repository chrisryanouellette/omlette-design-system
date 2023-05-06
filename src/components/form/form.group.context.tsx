import { ReactNode, createContext, useContext } from "react";

export type FormGroupContextType = {
  register: (id: string, defaultValue?: unknown) => () => void;
};

const FormGroupContext = createContext<FormGroupContextType | null>(null);

type FormGroupProviderProps = {
  value: FormGroupContextType;
  children?: ReactNode;
};

export function FormGroupProvider({
  children,
  value,
}: FormGroupProviderProps): JSX.Element {
  return (
    <FormGroupContext.Provider value={value}>
      {children}
    </FormGroupContext.Provider>
  );
}

/** Not all form items are withing a group so the context value maybe null */
export function useFormGroupContext(): FormGroupContextType | null {
  return useContext(FormGroupContext);
}