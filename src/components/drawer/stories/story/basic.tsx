import { Drawer } from "@Components/drawer/drawer";
import { bindTemplate } from "@Storybook/types";

const BasicDrawerStory = bindTemplate(() => {
  return (
    <>
      <Drawer.Trigger drawer="1">Open Top Panel</Drawer.Trigger>
      <Drawer.Panel id="1" position="top" size={50}>
        <h2>Some content in a drawer 1</h2>
        <Drawer.Trigger drawer="1">Close</Drawer.Trigger>
      </Drawer.Panel>
      <Drawer.Trigger drawer="2">Open Bottom Panel</Drawer.Trigger>
      <Drawer.Panel id="2" size={50}>
        <h2>Some content in a drawer 1</h2>
        <Drawer.Trigger drawer="2">Close</Drawer.Trigger>
      </Drawer.Panel>
      <Drawer.Trigger drawer="3">Open Right Panel</Drawer.Trigger>
      <Drawer.Panel id="3" position="right" size={50}>
        <h2>Some content in a drawer 2</h2>
        <Drawer.Trigger drawer="3">Close</Drawer.Trigger>
      </Drawer.Panel>
      <Drawer.Trigger drawer="4"> Open Left Panel</Drawer.Trigger>
      <Drawer.Panel id="4" position="left" className="basis-full lg:basis-1/4">
        <h2>Some content in a drawer 2</h2>
        <Drawer.Trigger drawer="4">Close</Drawer.Trigger>
      </Drawer.Panel>
    </>
  );
});

export { BasicDrawerStory };
