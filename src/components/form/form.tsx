import { HTMLAttributes, ReactNode, useEffect } from "react";
import { FormProvider } from "./context";
import { FormItem } from "./form.item";
import {
  FinishEvent,
  FinishFailedEvent,
  FormEvents,
  GenericFields,
  UseForm,
  useForm,
} from "./useForm";

export type FormProps<Fields extends GenericFields> =
  HTMLAttributes<HTMLFormElement> & {
    form?: UseForm<Fields>;
    onFinish?: FinishEvent<Fields>;
    onFinishFailed?: FinishFailedEvent<Fields>;
    children?: ReactNode;
  };

const Form = <Fields extends GenericFields>({
  children,
  form: controlledForm,
  onFinish,
  onFinishFailed,
  ...rest
}: FormProps<Fields>): JSX.Element => {
  const internalForm = useForm<Fields>();
  const form = controlledForm ?? internalForm;

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    if (onFinish) {
      unsubscribes.push(form.subscribe(FormEvents.finish, onFinish));
    }
    if (onFinishFailed) {
      unsubscribes.push(
        form.subscribe(FormEvents.finishFailed, onFinishFailed)
      );
    }
    return function FormComponentSubscriptionsCleanUp() {
      unsubscribes.forEach((fn) => fn());
    };
  }, [form, onFinish, onFinishFailed]);

  return (
    <FormProvider
      register={form.register}
      set={form.set}
      validation={form.validation}
      store={form.fields}
    >
      <form {...rest} onSubmit={form.submit}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.Item = FormItem;

export { Form };
