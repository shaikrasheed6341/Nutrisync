import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";
import * as schema from "./schema.js"; // Use relative path within the package

// Load the root .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

declare global {
  // Fix the spelling to 'cache' and use the type directly
  var db_cache: ReturnType<typeof drizzle<typeof schema>> | undefined;
  var pool_cache: Pool | undefined;
}

// Singleton logic for the Pool
const pool = globalThis.pool_cache ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== "production") {
  globalThis.pool_cache = pool;
}

// Singleton logic for Drizzle
export const db = globalThis.db_cache ?? drizzle(pool, { schema });

if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "development") {
  globalThis.db_cache = db;
}

// Export everything for the backend to use
export { pool, schema };