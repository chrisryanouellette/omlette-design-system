import { FC } from "react";
import { CarouselControls } from "../carousel.stories";
import { bindTemplate } from "@Storybook/types";
import { Carousel } from "@Components/carousel";

const BasicCarouselStory = bindTemplate<FC<CarouselControls>>(() => (
  <Carousel aria-label="A basic carousel" className="w-96">
    <Carousel.Item>
      <img alt="Image 1" src="https://via.placeholder.com/1500" />
    </Carousel.Item>
    <Carousel.Item>
      <img alt="Image 2" src="https://via.placeholder.com/1500" />
    </Carousel.Item>
    <Carousel.Item>
      <img alt="Image 3" src="https://via.placeholder.com/1500" />
    </Carousel.Item>
    <Carousel.Item>
      <img alt="Image 4" src="https://via.placeholder.com/1500" />
    </Carousel.Item>
  </Carousel>
));

export { BasicCarouselStory };
