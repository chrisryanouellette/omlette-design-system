export type ChildOrNullProps = {
  condition: boolean;
  children: JSX.Element;
};

const ChildOrNull = ({
  condition,
  children,
}: ChildOrNullProps): JSX.Element | null => {
  return condition ? children : null;
};

export { ChildOrNull };
