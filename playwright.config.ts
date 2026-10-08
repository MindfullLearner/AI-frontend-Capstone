import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },

  projects: [
    {
      name: process.env.CI ? "Chromium" : "Microsoft Edge",
      use: process.env.CI
        ? { ...devices["Desktop Chrome"] }
        : {
            ...devices["Desktop Edge"],
            channel: "msedge",
          },
    },
  ],
  

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
  },
});