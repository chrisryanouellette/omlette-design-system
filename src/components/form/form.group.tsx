import { ReactNode, useCallback, useEffect, useId, useMemo } from "react";
import { FormProvider, useFormContext } from "./context";
import { useForm } from "./useForm";
import { FormGroupContextType, FormGroupProvider } from "./form.group.context";
import { useFormItemContext } from "./form.item.context";

export type FormGroupStore = {
  [id: string]: unknown;
};

export type FormGroupProps = {
  id?: string;
  children?: ReactNode;
};

/**
 * Used to group for fields together within a form.
 *
 * @example
 * <Form onFinish={handleFinish}>
 *  <Form.Item name="experience">
 *    <Form.Group>
 *      <Form.Item name="jobTitle">
 *        <TextInput label="Job Title" />
 *      </Form.Item>
 *      <Form.Item name="startDate">
 *        <TextInput label="Start Date" />
 *      </Form.Item>
 *    </Form.Group>
 *  </Form.Item>
 *  <Button>Submit</Button>
 * </Form>
 */
export function FormGroup({
  children,
  id: controlledId,
}: FormGroupProps): JSX.Element {
  const formItemContext = useFormItemContext();
  const context = useFormContext();
  const wrapped = useForm();
  const internalId = useId();
  const id = controlledId ?? internalId;

  /** Register the group fields within the wrapped form with default values */
  const register = useCallback<FormGroupContextType["register"]>(
    (id) => {
      return wrapped.register(id, null);
    },
    [wrapped]
  );

  /** Handles setting the validation function */
  const validation = useCallback<FormGroupContextType["validation"]>(
    function (name, cb) {
      const wrappedFormFieldName = formItemContext.name;
      const field = wrapped.fields.get()[name];
      const unSubs = [
        context.validation(
          wrappedFormFieldName,
          function formGroupWrappedValidation(parentField, addError) {
            cb(field, addError, wrapped.fields.get());
          }
        ),
        wrapped.validation(name, cb),
      ];
      return function formGroupValidationSubscriptionCleanup() {
        unSubs.forEach((unSub) => unSub());
      };
    },
    [context, formItemContext, wrapped]
  );

  const groupContextValue = useMemo(
    () => ({ register, validation }),
    [register, validation]
  );

  useEffect(
    function syncWrappedFormStateValue() {
      setTimeout(function nextTick() {
        const wrappedFormFieldName = formItemContext.name;
        const wrappedField = context.fields.get()[wrappedFormFieldName];
        if (wrappedField) {
          if (!wrappedField.value) {
            context.set(wrappedFormFieldName, {
              [id]: wrapped.fields.get(),
            });
          } else {
            context.set(wrappedFormFieldName, {
              ...wrappedField.value,
              [id]: wrapped.fields.get(),
            });
          }
        }
      });
      return function syncWrappedFormStateValueCleanup() {
        const wrappedFormFieldName = formItemContext.name;
        const wrappedField = context.fields.get()[wrappedFormFieldName];
        if (wrappedField?.value) {
          delete (wrappedField.value as Record<string, unknown>)[id];
          const hasRemainingGroups = !!Object.keys(wrappedField.value).length;
          context.set(
            wrappedFormFieldName,
            hasRemainingGroups ? wrappedField.value : undefined
          );
        }
      };
    },
    [formItemContext, id, context, wrapped]
  );

  useEffect(
    function subscribeToParentFormValidation() {
      setTimeout(function nextTick() {
        context.validation(formItemContext.name, () => {
          wrapped.submit();
        });
      });
    },
    [context, formItemContext.name, wrapped]
  );

  return (
    <FormProvider value={wrapped}>
      <FormGroupProvider value={groupContextValue}>
        {children}
      </FormGroupProvider>
    </FormProvider>
  );
}

FormGroup.displayName = "FromGroup";
