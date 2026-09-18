import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react(), wasm(), topLevelAwait()],
  optimizeDeps: {
    exclude: ["@midnight-ntwrk/compact-runtime"],
  },
  server: {
    port: 5173,
    host: true,
  },
});
