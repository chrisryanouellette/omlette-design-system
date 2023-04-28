import { createGlobalStore } from "@Utilities";

export type DrawerState = {
  open: string | null;
  keys: Set<string>;
};

export const drawerStore = createGlobalStore<DrawerState>({
  open: null,
  keys: new Set(),
});
