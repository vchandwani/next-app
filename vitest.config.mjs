import { defineConfig, coverageConfigDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "istanbul",
      reporter: ["text", "lcov", "json-summary"],
      all: true,
      include: ["app/**/*.ts", "app/**/*.tsx", "components/**/*.ts", "components/**/*.tsx", "lib/**/*.ts", "lib/**/*.tsx"],
      exclude: [...coverageConfigDefaults.exclude, "**/*.d.ts", "**/*.test.ts", "**/*.test.tsx", "**/layout.tsx", "**/loading.tsx"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
