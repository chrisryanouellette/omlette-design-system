import { ReactNode } from "react";

export type ChildOrNullProps = {
  condition: boolean;
  children: ReactNode;
};

const ChildOrNull = ({
  condition,
  children,
}: ChildOrNullProps): JSX.Element | null => {
  return condition ? <>{children}</> : null;
};

export { ChildOrNull };
