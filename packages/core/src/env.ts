import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  extends: [dbEnv],
  server: {
    SESSION_COOKIE: z.string().default("auth_session"),
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  runtimeEnvStrict: {
    SESSION_COOKIE: process.env.SESSION_COOKIE,
    NODE_ENV: process.env.NODE_ENV,
  },
});
