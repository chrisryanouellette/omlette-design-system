import { FC, ReactNode } from "react";
import { FormProvider } from "./context";
import { FormItem } from "./FormItem";
import { FormFields, GenericFields, UseForm, useForm } from "./useForm";

export type FormProps<Fields extends GenericFields> = {
  form?: UseForm<Fields>;
  onFinish?: (fields: FormFields<Fields>, e: SubmitEvent) => void;
  onFinishFailed?: (
    invalid: (keyof Fields)[],
    fields: FormFields<Fields>,
    e: SubmitEvent
  ) => void;
  children?: ReactNode;
};

type ComposedFormProps = FC<FormProps<GenericFields>> & {
  Item: typeof FormItem;
};

const Form: ComposedFormProps = <Fields extends GenericFields>({
  form: controlledForm,
  children,
}: FormProps<Fields>): JSX.Element => {
  const internalForm = useForm<Fields>();
  const form = controlledForm ?? internalForm;

  return (
    <FormProvider
      register={form.register}
      set={form.set}
      validation={form.validation}
      store={form.fields}
    >
      <form onSubmit={form.submit}>{children}</form>
    </FormProvider>
  );
};

Form.Item = FormItem;

export { Form };
