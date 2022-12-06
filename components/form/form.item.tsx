import {
  ChangeEvent,
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useId,
} from "react";
import { useFormContext } from "./context";
import { FormFields, GenericFields, Validation } from "./useForm";
import { isElement } from "@Utilities/react";
import { SelectorFn, useStore } from "@Utilities/store";
import { isInstanceOf } from "@Utilities/element";
import { concat } from "@Utilities/concat";
import "./form.item.styles.css";
import { isUniqueSet } from "@Utilities/set";

type FormItemProps<T> = {
  name: string;
  children?: ReactNode;
  id?: string;
  errorsId?: string;
  required?: boolean;
  inline?: boolean;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  validation?: Validation<T>;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
};

const ComposedInputs = ["TextInput", "NumberInput", "Checkbox"];
const InternalFormInputs = ["Input"];
const FormElements = ["input"];
const LabelElements = ["Label", "label"];
const ErrorElements = ["Errors"];
const HtmlInstances = [
  HTMLInputElement,
  HTMLSelectElement,
  HTMLTextAreaElement,
];

const FormItem = <T,>({
  children,
  id: controlledId,
  errorsId: controlledErrorsId,
  name,
  wrapperProps,
  required,
  inline,
  validation: validationFn,
  onChange,
}: FormItemProps<T>): JSX.Element => {
  const internalId = useId();
  const internalErrorsId = useId();
  const id = controlledId ?? internalId;
  const errorsId = controlledErrorsId ?? internalErrorsId;

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
    <div
      {...wrapperProps}
      className={concat(
        "omlette-form-item-wrapper",
        inline && "omlette-form-item-inline",
        wrapperProps?.className
      )}
    >
      {Children.map(children, (child) => {
        /* If the child is a known form item, forward the props along */
        if (isValidElement(child)) {
          const inputProps = {
            id,
            value: value || "",
            checked: value || false,
            state: errors.size ? "error" : "",
            "aria-invalid": !!errors.size,
            "aria-describedby": errorsId,
            onChange: handleChange,
          };
          const labelProps = {
            required,
            htmlFor: id,
          };
          const errorProps = {
            id: errorsId,
            errors: Array.from(errors),
          };
          if (isElement(child, ComposedInputs)) {
            return cloneElement(child, {
              ...child.props,
              inputProps: {
                ...child.props.inputProps,
                ...inputProps,
              },
              labelProps: {
                ...child.props.labelProps,
                ...labelProps,
              },
              errorProps: {
                ...child.props.errorProps,
                ...errorProps,
              },
            });
          }
          if (isElement(child, [...InternalFormInputs, ...FormElements])) {
            return cloneElement(child, { ...child.props, ...inputProps });
          }
          if (isElement(child, LabelElements)) {
            return cloneElement(child, { ...child.props, ...labelProps });
          }
          if (isElement(child, ErrorElements)) {
            return cloneElement(child, { ...child.props, ...errorProps });
          }
        }
        return child;
      })}
    </div>
  );
};

export { FormItem };
