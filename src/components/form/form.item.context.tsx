import { ReactNode, createContext, useContext } from "react";

export type FormItemContextType = {
  name: string;
};

const FormItemContext = createContext<FormItemContextType | null>(null);

type FormItemProviderProps = {
  value: FormItemContextType;
  children?: ReactNode;
};

export function FormItemProvider({
  children,
  value,
}: FormItemProviderProps): JSX.Element {
  return (
    <FormItemContext.Provider value={value}>
      {children}
    </FormItemContext.Provider>
  );
}

/** Not all form items are withing a Item so the context value maybe null */
export function useFormItemContext(): FormItemContextType {
  const context = useContext(FormItemContext);

  if (!context) {
    throw new Error(
      "<Form.Group> can only be used within a <Form.Item> component."
    );
  }

  return context;
}
