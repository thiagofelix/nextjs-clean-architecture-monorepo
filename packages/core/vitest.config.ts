import env from "vite-plugin-env-compatible";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reportsDirectory: "./tests/coverage",
    },
  },
  plugins: [env()],
});
