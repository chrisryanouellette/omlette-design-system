import { createContext, ReactNode, useContext } from "react";
import { FormFields, GenericFields, UseForm } from "./useForm";
import { ReadOnlyUseCreateStore } from "@Utilities/store";

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
  ...rest
}: FormProviderProps<Fields>): JSX.Element => {
  return <FormContext.Provider value={rest}>{children}</FormContext.Provider>;
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
