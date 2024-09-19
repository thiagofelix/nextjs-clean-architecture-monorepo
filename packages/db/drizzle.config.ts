import { fileURLToPath } from "url";
import { defineConfig } from "drizzle-kit";
import createJiti from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
createJiti(fileURLToPath(import.meta.url))("./src/env");

export default defineConfig({
  driver: "turso",
  dialect: "sqlite",
  schema: "./src/schema.ts",
  out: "./src/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.DATABASE_AUTH_TOKEN!,
  },
});
