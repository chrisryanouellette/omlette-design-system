import {
  Children,
  createContext,
  ReactNode,
  RefObject,
  useContext,
} from "react";
import { UseCarousel } from "./useCarousel";

type CarouselContextType = {
  store: UseCarousel["store"];
  register: UseCarousel["register"];
  goTo: UseCarousel["goTo"];
};

const CarouselContext = createContext<CarouselContextType | null>(null);

type CarouselProviderProps = CarouselContextType & {
  children: ReactNode;
};

const CarouselProvider = ({
  children,
  ...rest
}: CarouselProviderProps): JSX.Element => {
  return (
    <CarouselContext.Provider value={rest}>{children}</CarouselContext.Provider>
  );
};

const useCarouselContext = (): CarouselContextType => {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error(
      '"useCarouselContext" needs to be used within a <Carousel> component.'
    );
  }
  return context;
};

type CarouselContainerContextType = {
  observe: (elem: HTMLElement | null) => () => void;
};

const CarouselContainerContext =
  createContext<CarouselContainerContextType | null>(null);

type CarouselContainerProviderProps = CarouselContainerContextType & {
  children?: ReactNode;
};

const CarouselContainerProvider = ({
  children,
  ...rest
}: CarouselContainerProviderProps): JSX.Element => {
  return (
    <CarouselContainerContext.Provider value={rest}>
      {children}
    </CarouselContainerContext.Provider>
  );
};

const useCarouselContainerContext = (): CarouselContainerContextType => {
  const context = useContext(CarouselContainerContext);
  if (!context) {
    throw new Error(
      '"useCarouselContainerContext" can only be used within a <CarouselContainer>'
    );
  }

  return context;
};

export {
  CarouselContext,
  CarouselProvider,
  useCarouselContext,
  CarouselContainerProvider,
  useCarouselContainerContext,
};
