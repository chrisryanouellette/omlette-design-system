import { ButtonHTMLAttributes, FC } from "react";
import { concat } from "@Utilities/concat";
import "./button.styles.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
};

const Button: FC<ButtonProps> = ({
  size,
  className,
  variant,
  children,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={concat("omlette-button", variant, className, size)}
    >
      {children}
    </button>
  );
};

export { Button };
