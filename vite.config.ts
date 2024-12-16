import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      skia: path.resolve(__dirname, "libs/skia"),
    },
  },
});
