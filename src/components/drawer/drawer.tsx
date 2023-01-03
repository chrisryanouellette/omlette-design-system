import { DrawerPanel } from "./drawer.panel";
import { DrawerTrigger } from "./drawer.trigger";
import "./drawer.styles.css";

const Drawer: {
  Trigger: typeof DrawerTrigger;
  Panel: typeof DrawerPanel;
} = {
  Trigger: DrawerTrigger,
  Panel: DrawerPanel,
};

export { Drawer };
