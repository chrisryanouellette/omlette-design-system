import { FormEvent, useCallback, useMemo, useRef } from "react";
import { ReadOnlyUseCreateStore, useCreateStore } from "@Utilities/store";
import { fieldsReducer, FormFieldsActions, ReducerActions } from "./reducers";

export type GenericFields = { [field: string]: unknown };

export enum FormEvents {
  register = "register",
  unregister = "unregister",
  updateDefault = "updateDefault",
  update = "update",
  finish = "finish",
  finishFailed = "finishFailed",
}

export type RegisterEvent<Fields extends GenericFields> = (
  name: keyof Fields,
  value: Fields[typeof name] | undefined
) => void;

export type UnregisterEvent<Fields extends GenericFields> = (
  name: keyof Fields
) => void;

export type UpdateDefaultEvent<Fields extends GenericFields> = (
  name: keyof Fields,
  value: Fields[typeof name],
  form: FormFields<Fields>
) => void;

export type UpdateEvent<Fields extends GenericFields> = (
  name: keyof Fields,
  value: Fields[typeof name],
  form: FormFields<Fields>
) => void;

export type FinishEvent<Fields extends GenericFields> = (
  form: FormFields<Fields>,
  e?: FormEvent<HTMLFormElement>
) => void;

export type FinishFailedEvent<Fields extends GenericFields> = (
  invalid: Extract<keyof Fields, string>[],
  form: FormFields<Fields>,
  e?: FormEvent<HTMLFormElement>
) => void;

type Subscriptions<Fields extends GenericFields> = {
  [FormEvents.register]: RegisterEvent<Fields>;
  [FormEvents.unregister]: UnregisterEvent<Fields>;
  [FormEvents.updateDefault]: UpdateDefaultEvent<Fields>;
  [FormEvents.update]: UpdateEvent<Fields>;
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

export type FormGroup<Values extends GenericFields> = {
  [id: string]: FormFields<Values>;
};

export type FormList<Value> = FormField<Value>[];

export type ValidationAddError = (error: string) => void;

export type ValidationFn<Value, Fields extends GenericFields, Return = void> = (
  field: FormField<Value>,
  add: ValidationAddError,
  form: FormFields<Fields>
) => Return;
export type AsyncValidationFn<
  Value,
  Fields extends GenericFields
> = ValidationFn<Value, Fields, Promise<void>>;
export type Validation<Value, Fields extends GenericFields = GenericFields> =
  | ValidationFn<Value, Fields>
  | AsyncValidationFn<Value, Fields>;

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
   *
   * Note: This will NOT cause the form field to update.
   * If a field needs to display the value use `setDefault` instead.
   */
  set: <K extends keyof Fields>(
    name: Extract<K, string>,
    value: Fields[K]
  ) => void;
  /**
   * Sets the default value for a form field and updates the form state.
   * This will not call the subscribers to the from state.
   */
  setDefault: <K extends keyof Fields>(
    name: Extract<K, string>,
    value: Fields[K] | null
  ) => void;
  /**
   * Sets the values for multiple fields. Each field will trigger a call to the form
   * subscribers.
   *
   * Note: This will NOT cause the form field to update.
   * If a field needs to display the value use `setManyDefault` instead.
   */
  setMany: (fields: Partial<Fields>) => void;
  /**
   * Sets the default values for multiple form fields and updates the form state.
   * This will not call the subscribers to the from state.
   */
  setManyDefault: (fields: Partial<Fields>) => void;
  /**
   * Adds a validation function to a field.
   * Returns the cleanup function to remove the function so
   * it is not run when the form is submitted.
   */
  validation: <K extends keyof Fields>(
    name: Extract<K, string>,
    ...fns: Validation<unknown, Fields>[]
  ) => () => void;
  /**
   * Validates a form field, throws an error of errors if there where any.
   */
  validate: <K extends keyof Fields>(name: Extract<K, string>) => Promise<void>;
  submit: (e?: FormEvent<HTMLFormElement>) => Promise<void>;
  subscribe: <E extends FormEvents>(
    event: E,
    fn: Subscriptions<Fields>[E]
  ) => () => void;
  reset: <K extends keyof Fields>(names?: Extract<K, string>[]) => void;
};

const initial = {};

const useForm = <Fields extends GenericFields>(): UseForm<Fields> => {
  const fields = useCreateStore<FormFields<Fields>, FormFieldsActions>(
    initial as FormFields<Fields>,
    fieldsReducer
  );
  const validations = useRef<
    Partial<{
      [K in keyof Fields]: Set<Validation<unknown, Fields>>;
    }>
  >({});
  const subscriptions = useRef<{
    [K in FormEvents]: Set<Subscriptions<Fields>[K]>;
  }>({
    register: new Set(),
    unregister: new Set(),
    updateDefault: new Set(),
    update: new Set(),
    finish: new Set(),
    finishFailed: new Set(),
  });

  const register = useCallback<UseForm<Fields>["register"]>(
    (name, defaultValue) => {
      fields.set({
        action: ReducerActions.register,
        value: { name, value: defaultValue, defaultValue },
      });
      subscriptions.current.register.forEach((cb) => cb(name, defaultValue));
      return () => {
        fields.set({
          action: ReducerActions.unregister,
          value: { name },
        });
        subscriptions.current.unregister.forEach((cb) => cb(name));
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
      subscriptions.current.update.forEach((sub) =>
        sub(name, value, fields.get())
      );
    },
    [fields]
  );

  const setDefault = useCallback<UseForm<Fields>["setDefault"]>(
    (name, value) => {
      fields.set({
        action: ReducerActions.setDefault,
        value: {
          name,
          default: value,
        },
      });
      subscriptions.current.updateDefault.forEach((sub) =>
        sub(name, value as any, fields.get())
      );
    },
    [fields]
  );

  const setMany = useCallback<UseForm<Fields>["setMany"]>(
    (values) => {
      Object.entries(values).forEach(([name, value]) => {
        fields.set({
          action: ReducerActions.set,
          value: { name, value },
        });
        subscriptions.current.update.forEach((sub) =>
          sub(name, value, fields.get())
        );
      });
    },
    [fields]
  );

  const setManyDefault = useCallback<UseForm<Fields>["setManyDefault"]>(
    (values) => {
      Object.entries(values).forEach(([name, value]) => {
        fields.set({
          action: ReducerActions.setDefault,
          value: { name, default: value },
        });
        subscriptions.current.updateDefault.forEach((sub) =>
          sub(name, value, fields.get())
        );
      });
    },
    [fields]
  );

  const validation = useCallback<UseForm<Fields>["validation"]>(
    (name, ...fns) => {
      const set = validations.current[name] ?? new Set();
      if (!validations.current[name]) {
        validations.current[name] = set;
      }

      fns.forEach((fn) => set.add(fn));
      /** Remove validation functions as cleanup */
      return () => {
        fns.forEach((fn) => set.delete(fn));
      };
    },
    []
  );

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
              fn(
                field,
                (error: string): void => {
                  errors.add(error);
                },
                fields.get()
              )
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
      e?.preventDefault();
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

  const reset = useCallback<UseForm<Fields>["reset"]>(
    (names) => {
      if (names) {
        return names.forEach((key) =>
          set(key, undefined as Fields[typeof key])
        );
      }

      Object.keys(fields.get()).forEach((key) =>
        set(key, undefined as Fields[typeof key])
      );
    },
    [fields, set]
  );

  return useMemo(
    () => ({
      fields,
      register,
      set,
      setDefault,
      setMany,
      setManyDefault,
      validation,
      validate,
      submit,
      subscribe,
      reset,
    }),
    [
      fields,
      register,
      set,
      setDefault,
      setMany,
      setManyDefault,
      validation,
      validate,
      submit,
      subscribe,
      reset,
    ]
  );
};

export { useForm };
