export type CarouselControls = {};

export type IconButtonControls = CarouselControls & {};

export default {
  title: "Components/Carousel",
  parameters: { controls: { sort: "alpha" } },
};

import { BasicCarouselStory as Basic } from "./stories/basic";
export { Basic };
