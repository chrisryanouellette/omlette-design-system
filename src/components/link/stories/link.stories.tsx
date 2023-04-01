import { FC } from "react";
import { bindTemplate, ControlTypes } from "@Storybook/types";
import { IconLinkProps } from "..";
import { LinkStory as Link } from "./story/link";
import { IconLinkStory } from "./story/icon-link";

const argTypes = {
  Href: {
    control: { type: ControlTypes.String },
  },
  Children: {
    control: { type: ControlTypes.String },
  },
};

export default {
  title: "Components/Link",
  parameters: { controls: { sort: "alpha" } },
};

export type LinkControls = {
  Href: string;
  Children: string;
};

const commonArgs = {
  Href: "https://www.google.com",
  Children: "read more.",
};

Link.argTypes = {
  ...argTypes,
};
Link.args = {
  ...commonArgs,
};

export { Link };

export type IconLinkControls = LinkControls & {
  Position: IconLinkProps["position"];
  "Icon Name": IconLinkProps["name"];
};

const LinkWithIcon = bindTemplate<FC<IconLinkControls>>((props) => {
  return (
    <p>
      Click here to <IconLinkStory {...props} Title="" />
    </p>
  );
});

LinkWithIcon.argTypes = {
  ...argTypes,
  "Icon Name": {
    control: { type: ControlTypes.String },
  },
  Position: {
    control: { type: ControlTypes.Select },
    options: ["left", "right"],
  },
};

LinkWithIcon.args = {
  ...commonArgs,
  "Icon Name": "ri-external-link-line",
  Position: "right",
};

export { LinkWithIcon };

export type IconOnlyLinkControls = IconLinkControls & {
  Title: IconLinkProps["title"];
};

const IconOnlyLink = bindTemplate<FC<IconOnlyLinkControls>>(IconLinkStory);

IconOnlyLink.argTypes = {
  ...argTypes,
  "Icon Name": {
    control: { type: ControlTypes.String },
  },
  Title: {
    control: { type: ControlTypes.String },
  },
};

IconOnlyLink.args = {
  ...commonArgs,
  Children: "",
  Title: "read more",
  "Icon Name": "ri-external-link-line",
};

export { IconOnlyLink };
