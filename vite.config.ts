import swc from "@rollup/plugin-swc";
import { glob } from "glob";
import { defineConfig } from "vite";

import { resolve } from "path";

// Automatically get all test files with full paths
const testEntries = Object.fromEntries(
  glob.sync("./src/*.ts").map((file) => [
    // Extract just the filename without path or extension as the entry name
    file.split("/").pop()?.replace(".ts", "") ?? file,
    resolve(__dirname, file),
  ])
);

export default defineConfig({
  build: {
    target: "es2015",
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      formats: ["cjs"],
      entry: testEntries,
      fileName: (_, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      external: /^(k6|https?:\/\/)(\/.*)?/,
      output: {
        exports: "named",
      },
      plugins: [swc()],
    },
  },
});
