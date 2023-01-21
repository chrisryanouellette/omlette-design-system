import { createContext, ReactNode, useContext, useMemo } from "react";
import { ReadOnlyUseCreateStore } from "@Utilities/store";
import { FormFields, GenericFields, UseForm } from "./useForm";

type FormContextType<Fields extends GenericFields> = {
  register: UseForm<Fields>["register"];
  set: UseForm<Fields>["set"];
  validation: UseForm<Fields>["validation"];
  store: ReadOnlyUseCreateStore<FormFields<Fields>>;
};

const FormContext = createContext<FormContextType<any> | null>(null);

export type FormProviderProps<Fields extends GenericFields> =
  FormContextType<Fields> & {
    children?: ReactNode;
  };

const FormProvider = <Fields extends GenericFields>({
  children,
  register,
  set,
  store,
  validation,
}: FormProviderProps<Fields>): JSX.Element => {
  const context = useMemo(() => {
    return { register, set, validation, store };
  }, [register, set, store, validation]);

  return (
    <FormContext.Provider value={context}>{children}</FormContext.Provider>
  );
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
