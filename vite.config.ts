import { copyFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * GitHub Pages has no server-side rewrite, so a hard refresh on a deep link
 * like /probability-lab/lesson/CP-01 would 404. Serving the same SPA shell as
 * 404.html lets the client router take over and render the right screen.
 */
function spaFallback(): Plugin {
  return {
    name: "spa-404-fallback",
    apply: "build",
    closeBundle() {
      const dir = resolve(dirname(fileURLToPath(import.meta.url)), "dist");
      copyFileSync(resolve(dir, "index.html"), resolve(dir, "404.html"));
    },
  };
}

// The app is served from a GitHub Pages *project* site, so every asset URL has
// to be prefixed. Keep this in sync with the router basename in src/app/router.tsx.
export default defineConfig({
  base: "/probability-lab/",
  plugins: [react(), tailwindcss(), spaFallback()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
