import { pool } from "./client.js";

export async function connectDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected:", res.rows[0]);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}