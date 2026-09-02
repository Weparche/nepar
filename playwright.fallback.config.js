import { defineConfig, devices } from "@playwright/test";

const port = 4178;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "web-landing-fallback.spec.js",
  reporter: "list",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: "on-first-retry",
  },
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    env: {
      ...process.env,
      VITE_GA_MEASUREMENT_ID: "G-NEPARTEST1",
      VITE_WORKER_URL: "",
    },
    reuseExistingServer: false,
    timeout: 120000,
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
  ],
});
