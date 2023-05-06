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
import { SelectorFn, useStore } from "@Utilities/store";
import { isInstanceOf } from "@Utilities/element";
import { concat } from "@Utilities/concat";
import { isUniqueSet } from "@Utilities/set";
import { FormFields, GenericFields, Validation } from "./useForm";
import { useFormContext } from "./context";
import { useFormGroupContext } from "./form.group.context";
import { isElement } from "@Utilities";

import "./form.item.styles.css";

type FormItemProps<T> = {
  name: string;
  children?: ReactNode;
  defaultValue?: T;
  id?: string;
  errorsId?: string;
  required?: boolean;
  inline?: boolean;
  wrapperProps?: HTMLAttributes<HTMLDivElement>;
  validation?: Validation<T>;
  onChange?: (e: ChangeEvent<HTMLElement>) => void;
};

const ComposedInputs = [
  "TextInput",
  "NumberInput",
  "DateInput",
  "Checkbox",
  "SelectInput",
  "FileInput",
];
const InternalFormInputs = ["Input"];
const FormElements = ["input"];
const LabelElements = ["Label", "label"];
const ErrorElements = ["Errors"];

const FormItem = <T,>({
  children,
  defaultValue: controlledDefaultValue,
  errorsId: controlledErrorsId,
  id: controlledId,
  inline,
  name,
  onChange,
  required,
  validation: validationFn,
  wrapperProps,
}: FormItemProps<T>): JSX.Element => {
  const formContext = useFormContext();
  const formGroupContext = useFormGroupContext();
  const internalId = useId();
  const internalErrorsId = useId();
  const id = controlledId ?? internalId;
  const selector = formGroupContext ? id : name;
  const errorsId = controlledErrorsId ?? internalErrorsId;

  const defaultValue: unknown =
    controlledDefaultValue ??
    formContext.fields.get()?.[selector]?.defaultValue ??
    null;

  /*
  Triggers a state update if the input has gone from no default value
  to having a default value.
  This occurs when some asynchronous action updates the form's state,
  or when the first change is made.
   */
  useStore(formContext.fields, function (state) {
    const defaultValue = state[selector]?.defaultValue ?? null;
    return defaultValue !== null;
  });

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

  const errors = useStore(formContext.fields, errorsSelector);

  const handleChange = useCallback<(e: ChangeEvent<HTMLElement>) => void>(
    (e) => {
      if (
        isInstanceOf(e.target, [
          HTMLInputElement,
          HTMLSelectElement,
          HTMLTextAreaElement,
        ])
      ) {
        if (
          isInstanceOf(e.target, [HTMLInputElement]) &&
          e.target.getAttribute("type") === "checkbox"
        ) {
          formContext.set(selector, e.target.checked);
        } else if (
          isInstanceOf(e.target, [HTMLInputElement]) &&
          e.target.getAttribute("type") === "file"
        ) {
          formContext.set(selector, e.target.files);
        } else if (isInstanceOf(e.target, [HTMLSelectElement])) {
          const selected = Array.from(e.target.selectedOptions).map(
            (elem) => elem.value
          );
          formContext.set(selector, e.target.multiple ? selected : selected[0]);
        } else if (e.target.getAttribute("type") === "number") {
          formContext.set(selector, Number(e.target.value));
        } else {
          formContext.set(selector, e.target.value);
        }
      }
      onChange?.(e);
    },
    [formContext, onChange, selector]
  );

  useEffect(() => {
    if (formGroupContext) {
      return formGroupContext.register(selector);
    }
    return formContext.register(selector);
  }, [formContext, formGroupContext, selector]);

  useEffect(() => {
    if (defaultValue !== null && defaultValue !== undefined) {
      formContext.setDefault(selector, defaultValue);
    }
  }, [defaultValue, formContext, selector]);

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
            state: errors.size ? "error" : "",
            "aria-invalid": !!errors.size,
            "aria-describedby": errorsId,
            defaultValue,
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
