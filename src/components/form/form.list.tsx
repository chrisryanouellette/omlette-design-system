import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Form } from "./form";
import { FormProvider, useFormContext } from "./context";
import {
  FormEvents,
  FormField,
  FormList as FormListType,
  GenericFields,
  UseForm,
  Validation,
} from "./useForm";

type FormListProps<T> = {
  name: string;
  children?: ReactNode;
  validation?: Validation<FormListType<T>>;
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
  name,
  validation: formListValidation,
}: FormListProps<T>): JSX.Element {
  type Fields = { [index: string]: T };

  const context = useFormContext<{ [field: string]: FormField<T>[] }>();
  const wrapped = Form.useForm<Fields>();

  const register = useCallback<UseForm<Fields>["register"]>(
    function (id, childDefaultValue) {
      return wrapped.register(id, childDefaultValue);
    },
    [wrapped]
  );

  const validation = useCallback<UseForm<Fields>["validation"]>(
    function (id, ...cbs) {
      const field = wrapped.fields.get()[id];
      const subscriptions: (() => void)[] = [
        context.validation(
          name,
          function formGroupWrappedValidation(parentField, addError) {
            cbs.forEach((cb) => cb(field, addError, wrapped.fields.get()));
          }
        ),
        wrapped.validation(id, ...cbs),
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
      const unsub = context.register(name);
      context.set(name, Object.values(wrapped.fields.get()));
      return unsub;
    },
    [context, name, wrapped]
  );

  useEffect(
    function syncFieldsToParent() {
      return wrapped.subscribe(
        FormEvents.register,
        function handleSyncFormToParent(): void {
          context.set(name, Object.values(wrapped.fields.get()));
        }
      );
    },
    [context, name, wrapped]
  );

  useEffect(
    function syncFieldsToParent() {
      return wrapped.subscribe(
        FormEvents.unregister,
        function handleSyncFormToParent(): void {
          context.set(name, Object.values(wrapped.fields.get()));
        }
      );
    },
    [context, name, wrapped]
  );

  useEffect(
    function subscribeFormItemValidation() {
      const subscriptions: (() => void)[] = [
        context.validation(name, () => {
          wrapped.submit();
        }),
      ];
      if (formListValidation) {
        const subscription = context.validation(
          name,
          formListValidation as Validation<unknown, GenericFields>
        );
        subscriptions.push(subscription);
      }
      return function formItemValidationCleanup() {
        subscriptions.forEach((cb) => cb());
      };
    },
    [context, formListValidation, name, wrapped]
  );

  useEffect(
    function initSyncToParent() {
      return wrapped.subscribe(
        FormEvents.update,
        function handleSyncFormToParent(fieldName, field, state): void {
          context.set(name, Object.values(state));
        }
      );
    },
    [context, name, wrapped]
  );

  useEffect(
    function initSyncParentDefaultValue() {
      return context.subscribe(
        FormEvents.updateDefault,
        function handleSyncParentDefaultValue(fieldName, field) {
          if (fieldName === name) {
            const update: Fields = {};
            Object.keys(wrapped.fields.get()).forEach((key, index) => {
              update[key] = field[index] as any;
            });
            wrapped.setManyDefault(update);
          }
        }
      );
    },
    [context, name, wrapped]
  );

  return <FormProvider value={wrappedFormProvider}>{children}</FormProvider>;
}

FormList.displayName = "FormList";
