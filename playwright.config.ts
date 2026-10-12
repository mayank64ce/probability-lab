import { defineConfig } from "@playwright/test";

const PORT = 4318;
const BASE = `http://127.0.0.1:${PORT}/probability-lab/`;

/**
 * End-to-end smoke tests against a real browser.
 *
 * Uses the Chrome already installed on the machine (`channel: "chrome"`)
 * rather than downloading Playwright's own builds — the suite is a handful of
 * smoke checks, and a 500 MB download is not a fair price for that.
 *
 * Deliberately *not* part of `npm test` or the deploy workflow. The jsdom
 * suite is the fast gate that runs on every push; this one is for checking
 * that the built bundle really works in a browser before a release.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE,
    channel: "chrome",
    trace: "off",
  },
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort --host 127.0.0.1`,
    url: BASE,
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
