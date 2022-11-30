import {
  ChangeEvent,
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useFormContext } from "./context";
import { FormFields, GenericFields, Validation } from "./useForm";
import { isElement } from "@Utilities/react";
import { SelectorFn, useStore } from "@Utilities/store";
import { isInstanceOf } from "@Utilities/element";

type FormItemProps<T> = {
  name: string;
  children?: ReactNode;
  validation?: Validation<T>;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
};

const InternalFormInputs = ["Input"];
const FormElements = ["input"];
const HtmlInstances = [
  HTMLInputElement,
  HTMLSelectElement,
  HTMLTextAreaElement,
];

const FormItem = <T,>({
  children,
  name,
  validation: validationFn,
  onChange,
}: FormItemProps<T>): JSX.Element => {
  const formContext = useFormContext();
  const valueSelector = useCallback<
    SelectorFn<FormFields<GenericFields>, unknown>
  >(
    (store) => {
      if (name in store) {
        return store[name].value ?? "";
      }
      return "";
    },
    [name]
  );
  const errorsSelector = useCallback<
    SelectorFn<FormFields<GenericFields>, Set<string> | null>
  >(
    (store, prev) => {
      if (name in store) {
        const current = store[name].errors;

        if (prev && prev.size !== current.size) {
          const unique = Array.from(current).every((element) => {
            return !prev.has(element);
          });
          if (unique) {
            return new Set(current);
          }
        } else if (!prev) {
          return current;
        }
      }
      return prev;
    },
    [name]
  );
  const value = useStore(formContext.store, valueSelector);
  const errors = useStore(formContext.store, errorsSelector);

  const handleChange = useCallback<(e: ChangeEvent<HTMLElement>) => void>(
    (e) => {
      if (isInstanceOf(e.target, HtmlInstances)) {
        if (
          isInstanceOf(e.target, [HTMLInputElement]) &&
          e.target.getAttribute("type") === "checkbox"
        ) {
          formContext.set(name, e.target.checked);
        } else {
          formContext.set(name, e.target.value);
        }
      }
      onChange?.(e);
    },
    [formContext, name, onChange]
  );

  useEffect(() => {
    return formContext.register(name);
  }, [formContext, name]);

  useEffect(() => {
    if (validationFn) {
      return formContext.validation(name, validationFn as Validation<unknown>);
    }
  }, [formContext, name, validationFn]);

  return (
    <>
      {Children.map(children, (child) => {
        /* If the child is a known form item, forward the props along */
        if (
          isValidElement(child) &&
          isElement(child, [...InternalFormInputs, ...FormElements])
        ) {
          return cloneElement(child, {
            ...child.props,
            value: value || "",
            checked: value || false,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </>
  );
};

export { FormItem };
