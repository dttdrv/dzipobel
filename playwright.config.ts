import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    headless: true,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
  webServer: {
    command: "npm run build && python -m http.server 4173 --bind 127.0.0.1 -d dist",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    stdout: "pipe",
    stderr: "pipe",
    timeout: 180_000,
  },
});
