import { sign } from "hono/jwt";
import { env } from "../config/env.js";

export async function signAccessToken(payload: {
  userId: string;
  email: string;
  username: string;
  tokenVersion: number;
}) {
  // 15 minutes in seconds (15 * 60)
  const exp = Math.floor(Date.now() / 1000) + 60 * 15;

  return await sign({ ...payload, exp }, env.JWT_SECRET);
}

export async function signRefreshToken(payload: {
  userId: string;
  tokenVersion: number;
}) {
  // 7 days in seconds (7 * 24 * 60 * 60)
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

  return await sign({ ...payload, exp }, env.JWT_REFRESH_SECRET);
}