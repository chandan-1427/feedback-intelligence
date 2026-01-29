import pg, { type Pool } from "pg";
import { env } from "../config/env.js";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const isProduction = env.NODE_ENV === "production";

export const pool =
  global.pgPool ??
  new pg.Pool({
    connectionString: env.DATABASE_URL,
    ssl: isProduction
      ? { rejectUnauthorized: false }
      : false,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 2_000,
  });

if (!global.pgPool) {
  global.pgPool = pool;
}
