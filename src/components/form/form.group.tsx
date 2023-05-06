import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { SelectorFn, isUniqueSet, useStore } from "@Utilities/index";
import { Errors, ErrorsProps } from "..";
import { FormProvider, useFormContext } from "./context";
import {
  FormEvents,
  FormFields,
  GenericFields,
  Validation,
  useForm,
} from "./useForm";
import { FormGroupContextType, FormGroupProvider } from "./form.group.context";

function createFormValue(
  fields: FormFields<GenericFields>,
  defaultValue?: unknown[]
): unknown[] {
  const length = Object.keys(fields).length;
  return new Array(length)
    .fill(null)
    .map((item, index) => defaultValue?.[index] ?? null);
}

export type FormGroupStore = {
  [id: string]: unknown;
};

type FormGroupProps<T> = {
  name: string;
  defaultValue?: T extends unknown[] ? T : T[];
  errorProps?: ErrorsProps;
  validation?: Validation<T>;
  children?: ReactNode;
};

export function FormGroup<T>({
  children,
  defaultValue,
  errorProps,
  name,
  validation,
}: FormGroupProps<T>): JSX.Element {
  const context = useFormContext();
  const wrapped = useForm();

  const errorsSelector = useCallback<
    SelectorFn<FormFields<GenericFields>, Set<string>>
  >(
    (store, prev) => {
      if (name in store) {
        const current = store[name].errors;
        if (!prev) {
          return current;
        } else if (isUniqueSet(prev, current)) {
          return new Set(current);
        }
      }
      return prev ?? new Set();
    },
    [name]
  );

  const errors = useStore(context.fields, errorsSelector);

  const register = useCallback<FormGroupContextType["register"]>(
    (id, controlledDefault) => {
      const items = Object.keys(wrapped.fields.get());
      const value = controlledDefault ?? defaultValue?.[items.length] ?? null;
      const unsubscribe = wrapped.register(id, value);
      const update = createFormValue(wrapped.fields.get(), defaultValue);
      if (context.fields.get()[name]) {
        context.set(name, update);
      }
      return function groupItemUnregister(): void {
        unsubscribe();
        const update = createFormValue(wrapped.fields.get(), defaultValue);
        if (context.fields.get()[name]) {
          context.set(name, update);
        }
      };
    },
    [context, defaultValue, name, wrapped]
  );

  const groupContextValue = useMemo(() => ({ register }), [register]);

  useEffect(
    function nestedFormSubscription() {
      return wrapped.subscribe(
        FormEvents.update,
        function (field, value, form) {
          const update: unknown[] = [];
          const keys = Object.keys(form);
          Object.entries(form).forEach(([name, field]) => {
            const index = keys.indexOf(name);
            update[index] = field.value;
          });
          context.set(name, update);
        }
      );
    },
    [context, name, wrapped]
  );

  useEffect(
    function registerFormGroup() {
      const initial = createFormValue(wrapped.fields.get(), defaultValue);
      const unsubscribe = context.register(name, defaultValue);
      context.set(name, initial);
      return unsubscribe;
    },
    [context, defaultValue, name, wrapped]
  );

  useEffect(
    function validationFunction() {
      if (validation) {
        return context.validation(name, validation as Validation<unknown>);
      }
    },
    [context, name, validation]
  );

  return (
    <FormProvider value={wrapped}>
      <FormGroupProvider value={groupContextValue}>
        {children}
        {errors.size ? (
          <Errors {...errorProps} errors={Array.from(errors)} />
        ) : null}
      </FormGroupProvider>
    </FormProvider>
  );
}

FormGroup.displayName = "FromGroup";
