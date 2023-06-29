import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useStore } from "@Utilities/store";
import { Form } from "./form";
import { FormProvider, useFormContext } from "./context";
import {
  FormEvents,
  FormField,
  FormFields,
  GenericFields,
  UseForm,
  Validation,
} from "./useForm";

function buildFormListValue<T>(
  form: FormFields<{ [key: string]: T }>,
  defaultValue?: T[]
): FormField<T>[] {
  return Object.values(form).map((item, index) => {
    return item;
  });
}

const fallbackDefaultValue: unknown[] = [];

type FormListProps<T> = {
  name: string;
  defaultValue?: T[];
  children?: (arg: {
    field: FormField<T>;
    id: string;
    index: number;
    fields: FormFields<{ [index: string]: T }>;
  }) => ReactNode;
  validation?: Validation<T>;
};

/**
 * @example
 * const form = Form.useForm();
 * const list = Form.useFormList(form, "items");
 *
 * return (
 *  <Form form={form}>
 *    <Form.List name="items">
 *      {list.map((id) => (
 *        <Form.ListItem>
 *          <TextInput label="Item" />
 *        </Form.ListItem>
 *      ))}
 *    </Form.List>
 *  </Form>
 * )
 */
export function FormList<T>({
  children,
  defaultValue: controlledDefaultValue,
  name,
  validation: formListValidation,
}: FormListProps<T>): JSX.Element {
  type Fields = { [index: string]: T };

  const context = useFormContext<{ [field: string]: FormField<T>[] }>();
  const wrapped = Form.useForm<Fields>();
  const fields = context.fields.get()[name]?.value ?? [];
  console.log(fields);

  const defaultValue =
    controlledDefaultValue ??
    context.fields.get()[name]?.defaultValue ??
    fallbackDefaultValue;

  /*
  Triggers a state update if the input has gone from no default value
  to having a default value.
  This occurs when some asynchronous action updates the form's state,
  or when the first change is made.
   */
  useStore(context.fields, function (state) {
    const defaultValue = state[name]?.defaultValue ?? null;
    return defaultValue !== null;
  });

  const register = useCallback<UseForm<Fields>["register"]>(
    function (id, childDefaultValue) {
      const unsub = wrapped.register(id, childDefaultValue ?? undefined);
      const index = Object.keys(wrapped.fields.get()).findIndex(
        (key) => key === id
      );
      if (defaultValue?.[index] !== undefined) {
        wrapped.setDefault(id, defaultValue[index]);
      }
      return unsub;
    },
    [defaultValue, wrapped]
  );

  const validation = useCallback<UseForm<Fields>["validation"]>(
    function (id, cb) {
      const field = wrapped.fields.get()[id];
      const subscriptions: (() => void)[] = [
        context.validation(
          name,
          function formGroupWrappedValidation(parentField, addError) {
            cb(field, addError, wrapped.fields.get());
          }
        ),
        wrapped.validation(id, cb),
      ];

      return function unsubscribeValidation() {
        subscriptions.forEach((cb) => cb());
      };
    },
    [context, name, wrapped]
  );

  const set = useCallback<UseForm<Fields>["set"]>(
    function (itemName, value) {
      wrapped.set(itemName, value);
    },
    [wrapped]
  );

  const wrappedFormProvider = useMemo(
    () => ({ ...wrapped, register, validation, set }),
    [wrapped, register, validation, set]
  );

  useEffect(
    function registerFormList() {
      return context.register(name);
    },
    [context, name, wrapped]
  );

  // useEffect(
  //   function setDefaultFormItemItem() {
  //     if (defaultValue?.length) {
  //       context.setDefault(name, defaultValue);
  //     }
  //   },
  //   [context, defaultValue, name, wrapped]
  // );

  useEffect(
    function subscribeFormItemValidation() {
      const subscriptions: (() => void)[] = [
        context.validation(name, () => {
          wrapped.submit();
        }),
      ];
      if (formListValidation) {
        subscriptions.push(
          context.validation(
            name,
            formListValidation as Validation<unknown, GenericFields>
          )
        );
      }
      return function formItemValidationCleanup() {
        subscriptions.forEach((cb) => cb());
      };
    },
    [context, formListValidation, name, wrapped]
  );

  useEffect(
    function initSyncFormToParent() {
      return wrapped.subscribe(
        FormEvents.update,
        function handleSyncFormToParent(fieldName, field, state): void {
          context.set(name, Object.values(state));
        }
      );
    },
    [context, name, wrapped]
  );

  return (
    <FormProvider value={wrappedFormProvider}>
      {Object.entries(fields).map(([id, field], index) =>
        children?.({
          field,
          id,
          index,
          fields: wrapped.fields.get(),
        })
      )}
    </FormProvider>
  );
}

FormList.displayName = "FormList";
