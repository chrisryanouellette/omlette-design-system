import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { Form } from "./form";
import { FormProvider, useFormContext } from "./context";
import { FormFields, GenericFields, UseForm, Validation } from "./useForm";

function buildFormListValue(
  form: FormFields<GenericFields>,
  defaultValue?: unknown[]
): unknown[] {
  return Object.values(form).map(
    (item, index) => item.value ?? defaultValue?.[index] ?? null
  );
}

type FormListProps = {
  name: string;
  defaultValue?: unknown[];
  children?: ReactNode;
  validation?: Validation<unknown>;
};

/**
 * @example
 * <Form.List name="items">
 *  <Form.ListItem validation={validation}>
 *    <TextInput label="Item 1" />
 *  </Form.ListItem>
 * </Form.List>
 */
export function FormList({
  children,
  defaultValue: controlledDefaultValue,
  name,
  validation: formListValidation,
}: FormListProps): JSX.Element {
  const context = useFormContext<{ [field: string]: unknown[] }>();
  const wrapped = Form.useForm();

  const defaultValue =
    controlledDefaultValue ?? context.fields.get()[name]?.defaultValue;

  const register = useCallback<UseForm<GenericFields>["register"]>(
    function (id, childDefaultValue) {
      const unsubscribe = wrapped.register(id, childDefaultValue ?? null);
      if (context.fields.get()[name]) {
        const update = buildFormListValue(wrapped.fields.get(), defaultValue);
        context.set(name, update);
      }
      return function formGroupItemUnregister(): void {
        unsubscribe();
        if (context.fields.get()[name]) {
          const update = buildFormListValue(wrapped.fields.get(), defaultValue);
          context.set(name, update);
        }
      };
    },
    [context, defaultValue, name, wrapped]
  );

  const validation = useCallback<UseForm<GenericFields>["validation"]>(
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

  const set = useCallback<UseForm<GenericFields>["set"]>(
    function (itemName, value) {
      wrapped.set(itemName, value);
      const update = buildFormListValue(wrapped.fields.get(), defaultValue);
      context.set(name, update);
    },
    [context, defaultValue, name, wrapped]
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

  useEffect(
    function setDefaultFormItemItem() {
      if (defaultValue) {
        context.setDefault(name, defaultValue);
        const fields = Object.keys(wrapped.fields.get());
        defaultValue.forEach((value, index) => {
          if (fields[index]) {
            wrapped.setDefault(fields[index], value);
          }
        });
      }
    },
    [context, defaultValue, name, wrapped]
  );

  useEffect(
    function subscribeFormItemValidation() {
      const subscriptions: (() => void)[] = [
        context.validation(name, () => {
          wrapped.submit();
        }),
      ];
      if (formListValidation) {
        subscriptions.push(context.validation(name, formListValidation));
      }
      return function formItemValidationCleanup() {
        subscriptions.forEach((cb) => cb());
      };
    },
    [context, formListValidation, name, wrapped]
  );

  /* Handles setting the default when the parent form has a default */
  useEffect(
    function setDefaultValueFromParent() {
      return context.fields.subscribe(function (state) {
        const defaultValue = state[name]?.defaultValue;
        if (defaultValue && Array.isArray(defaultValue)) {
          const keys = Object.keys(wrapped.fields.get());
          defaultValue.forEach((value, index) => {
            const key = keys[index];
            if (key !== undefined) {
              wrapped.setDefault(key, value);
            }
          });
        }
      });
    },
    [context, name, wrapped]
  );

  return <FormProvider value={wrappedFormProvider}>{children}</FormProvider>;
}
