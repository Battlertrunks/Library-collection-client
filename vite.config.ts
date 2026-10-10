import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tanstackRouter from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      compiler: true,
    }),
    tanstackRouter(),
    tailwindcss(),
  ],
  server: {
    // Send GraphQL through the dev server so browser requests stay
    // same-origin; cross-origin calls would add a CORS preflight (OPTIONS)
    // before every POST.
    proxy: {
      "/graphql": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
