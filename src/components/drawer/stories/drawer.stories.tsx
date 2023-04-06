import { portalStore } from "@Components/index";
import { BasicDrawerStory as Basic } from "./story/basic";

portalStore.set("#storybook-root");

export type ContainerControls = void;

export default {
  title: "Components/Drawer",
  parameters: { controls: { sort: "alpha" } },
};

export { Basic };
