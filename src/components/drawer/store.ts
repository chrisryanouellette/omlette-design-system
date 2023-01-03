import { createGlobalStore } from "@Utilities";

export const isDrawerOpenKey = createGlobalStore<string | null>(null);
export const drawersKey = createGlobalStore<Set<string>>(new Set());
