import { HTMLAttributes, ReactNode, useEffect } from "react";
import { FormProvider, useFormContext } from "./context";
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
import { FormGroup } from "./form.group";
import { FormListItem } from "./form.list.item";
import { FormList } from "./form.list";
import { useFormErrors } from "./useFormErrors";
import { useFormList } from "./useFormList";

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
  }, [form, onFinish, onFinishFailed, onUpdate]);

  return (
    <FormProvider value={form}>
      <form {...rest} onSubmit={form.submit}>
        {children}
      </form>
    </FormProvider>
  );
};

Form.Item = FormItem;
Form.Group = FormGroup;
Form.List = FormList;
Form.ListItem = FormListItem;
Form.useForm = useForm;
Form.useFormContext = useFormContext;
Form.useFormErrors = useFormErrors;
Form.useFormList = useFormList;

export { Form };
