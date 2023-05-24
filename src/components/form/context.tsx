import { createContext, ReactNode, useContext } from "react";
import { GenericFields, UseForm } from "./useForm";

type FormContextType<Fields extends GenericFields> = UseForm<Fields>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FormContext = createContext<FormContextType<any> | null>(null);

export type FormProviderProps<Fields extends GenericFields> = {
  value: FormContextType<Fields>;
  children?: ReactNode;
};

const FormProvider = <Fields extends GenericFields>({
  children,
  value,
}: FormProviderProps<Fields>): JSX.Element => {
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

const useFormContext = <
  Fields extends GenericFields = GenericFields
>(): FormContextType<Fields> => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useFormContext can only be used within a <Form> element.");
  }

  return context;
};

export { FormProvider, useFormContext };
