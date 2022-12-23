import { FC } from "react";
import { ListControls } from "../list.stories";
import { bindTemplate } from "@Storybook/types";
import { List } from "@Components/list";

const BasicListStory = bindTemplate<FC<ListControls>>(
  ({ "List Element": listElement, "List Style": listStyle }) => {
    return (
      <>
        <List ordered>
          <List.Item listStyle="number">Apples</List.Item>
          <List.Item listStyle="number">
            Sub List
            <List ordered>
              <List.Item listStyle="number">Oranges</List.Item>
            </List>
          </List.Item>
          <List.Item listStyle="number">Pares</List.Item>
          <List.Item listStyle="number">
            Sub List
            <List>
              <List.Item listStyle="icon">Oranges</List.Item>
              <List.Item listStyle="bullet">Oranges</List.Item>
              <List.Item listStyle="bullet">
                Sub Sub
                <List>
                  <List.Item listStyle="icon">Oranges</List.Item>
                  <List.Item listStyle="bullet">Oranges</List.Item>
                </List>
              </List.Item>
            </List>
          </List.Item>
        </List>
        <p>&nbsp;</p>
        <List>
          <List.Item listStyle="bullet">Apples</List.Item>
          <List.Item listStyle={listStyle}>
            Sub List
            <List ordered={listElement === "ol"}>
              <List.Item listStyle="number">Oranges</List.Item>
            </List>
          </List.Item>
          <List.Item listStyle={listStyle}>Pares</List.Item>
          <List.Item listStyle={listStyle}>
            Sub List
            <List>
              <List.Item listStyle="icon">
                Oranges Oranges Oranges Oranges Oranges Oranges Oranges Oranges
                Oranges Oranges Oranges Oranges Oranges Oranges{" "}
              </List.Item>
              <List.Item listStyle="bullet">Oranges</List.Item>
            </List>
          </List.Item>
        </List>
      </>
    );
  }
);

export { BasicListStory };
