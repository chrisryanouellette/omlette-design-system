import { HTMLAttributes, ReactNode } from "react";
import { useCarousel } from "./useCarousel";
import { CarouselContainer } from "./carousel.container";
import { CarouselProvider } from "./carousel.context";
import { CarouselControls } from "./carousel.controls";
import { CarouselPagination } from "./carousel.pagination";
import { CarouselItem } from "./carousel.item";
import { concat } from "@Utilities/concat";
import { Icon, IconProps } from "@Components/icon";
import "./carousel.styles.css";
import { ChildOrNull } from "@Components/utilities/ChildOrNull";

export type CarouselStore = {
  items: Set<string>;
  current: string | null;
};

type CarouselProps = HTMLAttributes<HTMLDivElement> & {
  "aria-label": string;
  hidePagination?: boolean;
  hideArrows?: boolean;
  start?: string;
  children?: ReactNode;
  leftArrowIcon?: string;
  leftArrowIconProps?: IconProps;
  rightArrowIcon?: string;
  rightArrowIconProps?: IconProps;
};

const Carousel = ({
  "aria-label": ariaLabel,
  className,
  start,
  hidePagination,
  hideArrows,
  children,
  leftArrowIcon = "ri-arrow-left-s-line",
  leftArrowIconProps,
  rightArrowIcon = "ri-arrow-right-s-line",
  rightArrowIconProps,
  ...rest
}: CarouselProps): JSX.Element => {
  const carousel = useCarousel({ start });
  const classes = concat("omlette-carousel", className);

  return (
    <CarouselProvider {...carousel}>
      <div {...rest} aria-label={ariaLabel} className={classes}>
        <ChildOrNull condition={!hideArrows}>
          <CarouselControls change={carousel.previous}>
            <Icon name={leftArrowIcon} {...leftArrowIconProps} />
          </CarouselControls>
        </ChildOrNull>
        <CarouselContainer>{children}</CarouselContainer>
        <ChildOrNull condition={!hideArrows}>
          <CarouselControls change={carousel.next}>
            <Icon name={rightArrowIcon} {...rightArrowIconProps} />
          </CarouselControls>
        </ChildOrNull>
        <ChildOrNull condition={!hidePagination}>
          <CarouselPagination />
        </ChildOrNull>
      </div>
    </CarouselProvider>
  );
};

Carousel.useCarousel = useCarousel;
Carousel.Item = CarouselItem;

export { Carousel };
