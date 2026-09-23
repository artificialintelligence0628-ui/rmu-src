import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Generic query helper — every route/store function goes through this,
// keeping SQL out of the route handlers.
export const query = (text, params) => pool.query(text, params);

export default { pool, query };
