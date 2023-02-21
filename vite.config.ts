import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import exports from "./exports.json";

const entries = Object.values(exports).map(({ entry }) =>
  path.resolve(__dirname, entry)
);

const inputs: { [component: string]: string } = {};
Object.entries(exports).forEach(([component, { input }]) => {
  inputs[component] = path.resolve(__dirname, input);
});

export default defineConfig({
  build: {
    outDir: "build",
    /** Docs - https://vitejs.dev/guide/build.html#library-mode */
    lib: {
      entry: entries,
      name: "@ouellettec/design-system",
    },
    ssr: true,
    rollupOptions: {
      external: ["react"],
      input: inputs,
      output: {
        globals: {
          react: "React",
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@Components": path.resolve(__dirname, "./src/components"),
      "@Utilities": path.resolve(__dirname, "./src/utilities"),
      "@Lib": path.resolve(__dirname, "./src/lib"),
    },
  },
});
