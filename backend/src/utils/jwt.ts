import { sign } from "hono/jwt";
import { env } from "@/config/env.js";

export async function signToken(payload: {
  userId: string;
  email: string;
  username: string;
}) {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24;

  const finalPayload = {
    ...payload,
    exp: exp,
  };

  return await sign(finalPayload, env.JWT_SECRET);
}