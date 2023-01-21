import { FormEvent, useCallback, useMemo, useRef } from "react";
import { ReadOnlyUseCreateStore, useCreateStore } from "@Utilities/store";
import { fieldsReducer, FormFieldsActions, ReducerActions } from "./reducers";

export type GenericFields = { [field: string]: unknown };

export enum FormEvents {
  finish = "finish",
  finishFailed = "finishFailed",
}

export type FinishEvent<Fields extends GenericFields> = (
  form: FormFields<Fields>,
  e: FormEvent<HTMLFormElement>
) => void;

export type FinishFailedEvent<Fields extends GenericFields> = (
  invalid: Extract<keyof Fields, string>[],
  form: FormFields<Fields>,
  e: FormEvent<HTMLFormElement>
) => void;

type Subscriptions<Fields extends GenericFields> = {
  [FormEvents.finish]: FinishEvent<Fields>;
  [FormEvents.finishFailed]: FinishFailedEvent<Fields>;
};

export type FormField<Value> = {
  value: Value;
  defaultValue: Value;
  touched: boolean;
  errors: Set<string>;
};

export type FormFields<Values extends GenericFields> = {
  [K in keyof Values]: FormField<Values[K]>;
};

export type ValidationFn<Value, Return = void> = (
  field: FormField<Value>,
  add: (error: string) => void
) => Return;
export type AsyncValidationFn<Value> = ValidationFn<Value, Promise<void>>;
export type Validation<Value> = ValidationFn<Value> | AsyncValidationFn<Value>;

export type UseForm<Fields extends GenericFields> = {
  fields: ReadOnlyUseCreateStore<FormFields<Fields>>;
  /**
   * Stores a form field into the form instance's store.
   * Returns the unregister function
   */
  register: <K extends keyof Fields>(
    name: Extract<K, string>,
    defaultValue?: Fields[K]
  ) => () => void;
  /**
   * Set's the field value in the store and marks it as touched.
   */
  set: <K extends keyof Fields>(
    name: Extract<K, string>,
    value: Fields[K]
  ) => void;
  /**
   * Adds a validation function to a field.
   * Returns the cleanup function to remove the function so
   * it is not run when the form is submitted.
   */
  validation: <K extends keyof Fields>(
    name: Extract<K, string>,
    fns: Validation<unknown>
  ) => () => void;
  /**
   * Validates a form field, throws an error of errors if there where any.
   */
  validate: <K extends keyof Fields>(name: Extract<K, string>) => Promise<void>;
  submit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  subscribe: <E extends FormEvents>(
    event: E,
    fn: Subscriptions<Fields>[E]
  ) => () => void;
};

const useForm = <Fields extends GenericFields>(): UseForm<Fields> => {
  const fields = useCreateStore<FormFields<Fields>, FormFieldsActions>(
    {} as FormFields<Fields>,
    fieldsReducer
  );
  const validations = useRef<
    Partial<{
      [K in keyof Fields]: Set<Parameters<UseForm<Fields>["validation"]>[1]>;
    }>
  >({});
  const subscriptions = useRef<{
    [K in FormEvents]: Set<Subscriptions<Fields>[K]>;
  }>({
    finish: new Set(),
    finishFailed: new Set(),
  });

  const register = useCallback<UseForm<Fields>["register"]>(
    (name, defaultValue) => {
      fields.set({
        action: ReducerActions.register,
        value: { name, value: defaultValue, defaultValue },
      });
      return () => {
        fields.set({
          action: ReducerActions.unregister,
          value: { name },
        });
      };
    },
    [fields]
  );

  const set = useCallback<UseForm<Fields>["set"]>(
    (name, value) => {
      fields.set({
        action: ReducerActions.set,
        value: {
          name,
          value,
        },
      });
    },
    [fields]
  );

  const validation = useCallback<UseForm<Fields>["validation"]>((name, fns) => {
    const set = validations.current[name] ?? new Set();
    if (!validations.current[name]) {
      validations.current[name] = set;
    }
    set.add(fns);
    /** Remove validation functions as cleanup */
    return () => {
      set.delete(fns);
    };
  }, []);

  const validate = useCallback<UseForm<Fields>["validate"]>(
    async (name) => {
      const set = validations.current[name];
      const field = fields.get()[name];
      const errors: Set<string> = new Set();

      if (set?.size) {
        const promises: Promise<void>[] = [];
        set.forEach((fn) =>
          promises.push(
            Promise.resolve(
              fn(field, (error: string): void => {
                errors.add(error);
              })
            )
          )
        );
        await Promise.all(promises);
        fields.set({
          action: ReducerActions.validate,
          value: { name, errors },
        });
        if (errors.size) {
          throw name;
        }
      }
    },
    [fields]
  );

  const submit = useCallback<UseForm<Fields>["submit"]>(
    async (e) => {
      e.preventDefault();
      const results = await Promise.allSettled(
        Object.keys(fields.get()).map(async (key) => {
          return validate(key);
        })
      );
      const invalid: Extract<keyof Fields, string>[] = [];
      results.forEach((res) => {
        if (res.status === "rejected") {
          invalid.push(res.reason);
        }
      });
      if (invalid.length) {
        subscriptions.current.finishFailed.forEach((fn) =>
          fn(invalid, fields.get(), e)
        );
      } else {
        subscriptions.current.finish.forEach((fn) => fn(fields.get(), e));
      }
    },
    [fields, validate]
  );

  const subscribe = useCallback<UseForm<Fields>["subscribe"]>((event, fn) => {
    subscriptions.current[event].add(fn);
    return () => subscriptions.current[event].delete(fn);
  }, []);

  return useMemo(
    () => ({ fields, register, set, validation, validate, submit, subscribe }),
    [fields, register, set, submit, validate, validation, subscribe]
  );
};

export { useForm };
