import {
  Children,
  ReactNode,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
} from "react";
import { SelectorFn, isElement, isUniqueSet, useStore } from "@Utilities/index";
import { Errors, ErrorsProps } from "..";
import { FormProvider, useFormContext } from "./context";
import {
  FormEvents,
  FormFields,
  GenericFields,
  Validation,
  useForm,
} from "./useForm";

type FormGroupProps<T> = {
  name: string;
  errorProps?: ErrorsProps;
  validation?: Validation<T>;
  children?: ReactNode;
};

export function FormGroup<T>({
  children,
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

  useEffect(
    function nestedFormSubscription() {
      return wrapped.subscribe(
        FormEvents.update,
        function (field, value, form) {
          const update: unknown[] = [];
          Object.entries(form).forEach(([key, field]) => {
            const index = Number(key.toString().split("|")[1]);
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
      console.log("running");
      return context.register(name, []);
    },
    [context, name]
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
      {Children.map(children, function renderGroupChild(child, index) {
        if (isValidElement(child)) {
          if (isElement(child, ["FormItem"])) {
            return cloneElement(child, {
              ...child.props,
              name: `${child.props.name}|${index}`,
            });
          }
        }
        return child;
      })}
      {errors.size ? (
        <Errors {...errorProps} errors={Array.from(errors)} />
      ) : null}
    </FormProvider>
  );
}

FormGroup.displayName = "FromGroup";
