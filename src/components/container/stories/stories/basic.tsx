import { FC } from "react";
import { ContainerControls } from "../container.stories";
import { Container } from "@Components/container";
import { bindTemplate } from "@Storybook/types";

export const BasicContainerStory = bindTemplate<FC<ContainerControls>>(
  ({ Placement: placement }) => (
    <Container placement={placement}>
      <h1>Heading</h1>
    </Container>
  )
);
