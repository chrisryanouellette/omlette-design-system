import { useCallback } from "react";
import { SelectorFn, isUniqueSet, useStore } from "@Utilities/index";
import { Form } from "./form";
import { FormFields, GenericFields } from "./useForm";

export function useFormErrors(name: string): Set<string> {
  const formContext = Form.useFormContext();

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

  return useStore(formContext.fields, errorsSelector);
}
