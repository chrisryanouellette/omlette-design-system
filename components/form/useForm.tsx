import { FormEvent, useCallback, useMemo, useRef } from "react";
import { fieldsReducer, FormFieldsActions, ReducerActions } from "./reducers";
import { ReadOnlyUseCreateStore, useCreateStore } from "@Utilities/store";

export type GenericFields = { [field: string]: unknown };

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

  const register = useCallback<UseForm<Fields>["register"]>(
    (name, defaultValue) => {
      fields.set({
        action: ReducerActions.register,
        value: { name, value: defaultValue, defaultValue },
      });
      return () =>
        fields.set({ action: ReducerActions.unregister, value: { name } });
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
      const add = (error: string): void => {
        errors.add(error);
      };

      if (set?.size) {
        const promises: Promise<void>[] = [];
        set.forEach((fn) => promises.push(Promise.resolve(fn(field, add))));
        await Promise.all(promises);
        fields.set({
          action: ReducerActions.validate,
          value: { name, errors },
        });
        if (errors.size) {
          throw errors;
        }
      }
    },
    [fields]
  );

  const submit = useCallback<UseForm<Fields>["submit"]>(
    async (e) => {
      e.preventDefault();
      const allFields = fields.get();
      const results = await Promise.allSettled(
        Object.keys(allFields).map(async (key) => {
          return validate(key);
        })
      );
      const invalid: PromiseRejectedResult[] = [];
      results.forEach((res) => {
        if (res.status === "rejected") {
          invalid.push(res);
        }
      });
      if (invalid.length) {
        console.error("errors");
      } else {
        console.log("succuss");
      }
    },
    [fields, validate]
  );

  return useMemo(
    () => ({ fields, register, set, validation, validate, submit }),
    [fields, register, set, submit, validate, validation]
  );
};

export { useForm };
