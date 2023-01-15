import { FC } from "react";
import { Container } from "@Components/container";
import { bindTemplate } from "@Storybook/types";
import { ContainerControls } from "../container.stories";

export const BasicContainerStory = bindTemplate<FC<ContainerControls>>(
  ({ Placement: placement }) => (
    <Container placement={placement}>
      <h1>Heading</h1>
    </Container>
  )
);
