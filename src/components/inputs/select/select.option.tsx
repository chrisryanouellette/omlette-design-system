import { OptionHTMLAttributes, ReactNode } from "react";

export type SelectOptionProps = OptionHTMLAttributes<HTMLOptionElement> & {
  value: string;
  children?: ReactNode;
};

const SelectOption = ({
  children,
  ...rest
}: SelectOptionProps): JSX.Element => {
  return <option {...rest}>{children}</option>;
};

export { SelectOption };
