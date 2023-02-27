import path from "path";
import fs from "fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import exported from "./exports.json";

const entries = Object.values(exported).map(({ entry }) =>
  path.resolve(__dirname, entry)
);

const inputs: { [component: string]: string } = {};
Object.entries(exported).forEach(([component, value]) => {
  inputs[component] = path.resolve(__dirname, value.input);
  /** Generate entry points for each export file with a type */
  if ("types" in value) {
    fs.writeFileSync(
      path.resolve(`./${component}.d.ts`),
      `export * from "${value.types}";`
    );
    fs.writeFileSync(
      path.resolve(`./${component}.js`),
      `module.exports = require("${value.entry}");`
    );
  }
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
