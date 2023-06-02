import { ReactNode, useId } from "react";
import { Form } from "./form";
import { FormItemProps } from "./form.item";

export type FormListItemProps<T> = Omit<FormItemProps<T>, "name"> & {
  children?: ReactNode;
};

export function FormListItem<T>({
  children,
  id: controlledId,
  ...rest
}: FormListItemProps<T>): JSX.Element {
  const internalId = useId();
  const id = controlledId ?? internalId;

  return (
    <Form.Item<T> {...rest} name={id}>
      {children}
    </Form.Item>
  );
}
