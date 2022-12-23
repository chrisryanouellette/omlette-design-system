import { ButtonHTMLAttributes, ReactNode } from "react";

type CarouselControlsProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  change: () => void;
  children: ReactNode;
};

const CarouselControls = ({
  change,
  children,
  ...rest
}: CarouselControlsProps): JSX.Element => {
  return (
    <button {...rest} onClick={change}>
      {children}
    </button>
  );
};

export { CarouselControls };
