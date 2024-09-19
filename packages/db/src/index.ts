import { createClient } from "@libsql/client";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "./env";
import { sessions, todos, users } from "./schema";

// Setup sqlite database connection
const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client, { schema: { users, sessions, todos } });

// Setup lucia adapter
export const luciaAdapter = new DrizzleSQLiteAdapter(db, sessions, users);
