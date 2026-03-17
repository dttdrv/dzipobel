import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{test,spec}.{js,mjs,ts}", "src/**/*.test.ts"],
    exclude: ["e2e/**", "tests/e2e/**", "node_modules/**", "dist/**"],
  },
});
