import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", "e2e/**"],
    coverage: {
      provider: "v8",
      include: ["src/app/components/**/*.{ts,tsx}", "src/lib/ai/tools/**/*.ts"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
    },
    testTimeout: 10000,
  },
});