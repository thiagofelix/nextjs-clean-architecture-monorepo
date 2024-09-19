import { fileURLToPath, URL } from "node:url";
import env from "vite-plugin-env-compatible";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul",
      reportsDirectory: "./src/tests/coverage",
    },
  },
  plugins: [env()],
  resolve: {
    alias: {
      "@acme/core": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
