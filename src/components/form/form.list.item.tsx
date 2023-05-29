import { ReactNode, useId } from "react";
import { Form } from "./form";
import { FormItemProps } from "./form.item";

export type FormListItemProps<T> = Omit<FormItemProps<T>, "name"> & {
  children?: ReactNode;
};

export function FormListItem<T>({
  children,
  ...rest
}: FormListItemProps<T>): JSX.Element {
  const id = useId();
  return (
    <Form.Item<T> {...rest} name={id}>
      {children}
    </Form.Item>
  );
}
