export type CarouselControls = void;

export type IconButtonControls = CarouselControls & void;

export default {
  title: "Components/Carousel",
  parameters: { controls: { sort: "alpha" } },
};

import { BasicCarouselStory as Basic } from "./stories/basic";
export { Basic };
