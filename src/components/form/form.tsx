import { HTMLAttributes, ReactNode, useEffect } from "react";
import { FormProvider } from "./context";
import { FormItem } from "./form.item";
import {
  FinishEvent,
  FinishFailedEvent,
  FormEvents,
  GenericFields,
  UpdateEvent,
  UseForm,
  useForm,
} from "./useForm";

export type FormProps<Fields extends GenericFields> =
  HTMLAttributes<HTMLFormElement> & {
    form?: UseForm<Fields>;
    onUpdate?: UpdateEvent<Fields>;
    onFinish?: FinishEvent<Fields>;
    onFinishFailed?: FinishFailedEvent<Fields>;
    children?: ReactNode;
  };

const Form = <Fields extends GenericFields>({
  children,
  form: controlledForm,
  onFinish,
  onFinishFailed,
  onUpdate,
  ...rest
}: FormProps<Fields>): JSX.Element => {
  const internalForm = useForm<Fields>();
  const form = controlledForm ?? internalForm;

  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    if (onUpdate) {
      unsubscribes.push(form.subscribe(FormEvents.update, onUpdate));
    }
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
