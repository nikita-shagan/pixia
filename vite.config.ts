import { defineConfig } from "vite";
import * as path from "node:path";

export default defineConfig({
  server: {
    port: 3000,
  },
  root: "./",
  build: {
    outDir: "dist",
  },
  publicDir: "public",
  resolve: {
    alias: {
      skia: path.resolve(__dirname, "libs/skia"),
    },
  },
});
