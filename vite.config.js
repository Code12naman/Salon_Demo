import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build` makes a normal deployable build (dist/).
// `npm run build:single` inlines everything into one HTML file, handy for sharing a demo.
export default defineConfig({
  base: "./",
  plugins: [react(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
});
