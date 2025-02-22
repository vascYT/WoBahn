// @ts-check
import { defineConfig } from "astro/config";
import { version } from "./package.json";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [react()],
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    plugins: [tailwindcss()],
  },
});
