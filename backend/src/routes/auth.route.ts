import { Hono } from "hono";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { pool } from "../db/client.js";
import {
  signAccessToken,
  signRefreshToken,
} from "../utils/jwt.js";
import { env } from "../config/env.js";

export const authRoute = new Hono();

const isProd = env.NODE_ENV === "production";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";

const ACCESS_MAX_AGE = 60 * 15; // 15 min
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/* ---------------- Password Policy ---------------- */

const isStrongPassword = (password: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/.test(password);

/* ---------------- Helper ---------------- */

const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

/* ---------------- SIGN UP ---------------- */

authRoute.post("/sign-up", async (c) => {
  const { username, email, password } = await c.req.json();

  if (!username || !email || !password)
    return c.json({ message: "All fields required" }, 400);

  if (!isStrongPassword(password))
    return c.json(
      { message: "Password must be 10+ chars, include upper, lower, number." },
      400
    );

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING id,email`,
      [username.trim(), email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];

    // 🔐 Create verification token
    const rawToken = crypto.randomBytes(32).toString("hex");

    await pool.query(
      `INSERT INTO email_verifications(user_id,token_hash,expires_at)
       VALUES($1,$2,NOW()+INTERVAL '24 hours')`,
      [user.id, hashToken(rawToken)]
    );

    // TODO: Send email with verification link
    console.log(
      `Verify URL: ${env.FRONTEND_URL}/verify-email?token=${rawToken}`
    );

    return c.json({
      message: "Account created. Please verify your email.",
    });
  } catch {
    return c.json({ message: "Unable to create account" }, 409);
  }
});

authRoute.post("/sign-in", async (c) => {
  const { email, password } = await c.req.json();

  const result = await pool.query(
    `SELECT * FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );

  if (!result.rows.length)
    return c.json({ message: "Invalid credentials" }, 401);

  const user = result.rows[0];

  if (!user.is_verified) {
    return c.json(
      { message: "Please verify your email before signing in." },
      403
    );
  }

  if (user.lock_until && new Date(user.lock_until) > new Date())
    return c.json({ message: "Account locked. Try later." }, 403);

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    await pool.query(
      `UPDATE users SET failed_attempts=failed_attempts+1 WHERE id=$1`,
      [user.id]
    );

    if (user.failed_attempts + 1 >= 5) {
      await pool.query(
        `UPDATE users SET lock_until=NOW()+INTERVAL '15 minutes' WHERE id=$1`,
        [user.id]
      );
    }

    return c.json({ message: "Invalid credentials" }, 401);
  }

  await pool.query(
    `UPDATE users SET failed_attempts=0, lock_until=NULL WHERE id=$1`,
    [user.id]
  );

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    tokenVersion: user.token_version,
  });

  const refreshToken = signRefreshToken({
    userId: user.id,
    tokenVersion: user.token_version,
  });

  await pool.query(
    `INSERT INTO refresh_tokens(user_id,token_hash,expires_at)
     VALUES($1,$2,NOW()+INTERVAL '7 days')`,
    [user.id, hashToken(await refreshToken)]
  );

  setCookie(c, ACCESS_COOKIE, await accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: ACCESS_MAX_AGE,
    path: "/",
  });

  setCookie(c, REFRESH_COOKIE, await refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: REFRESH_MAX_AGE,
    path: "/",
  });

  return c.json({ message: "Signed in" });
});

authRoute.post("/refresh", async (c) => {
  // Use getCookie(c, cookieName) instead of c.req.cookie()
  const refreshToken = getCookie(c, REFRESH_COOKIE);

  if (!refreshToken) return c.json({ message: "Unauthorized" }, 401);

  const hashed = hashToken(refreshToken);

  const db = await pool.query(
    `SELECT * FROM refresh_tokens WHERE token_hash=$1 AND revoked=false`,
    [hashed]
  );

  if (!db.rows.length)
    return c.json({ message: "Invalid refresh token" }, 401);

  const user = await pool.query(
    `SELECT * FROM users WHERE id=$1`,
    [db.rows[0].user_id]
  );

  // Note: Added await here since your signAccessToken is async
  const newAccess = await signAccessToken({
    userId: user.rows[0].id,
    email: user.rows[0].email,
    username: user.rows[0].username,
    tokenVersion: user.rows[0].token_version,
  });

  // setCookie is already correct if imported from hono/cookie
  setCookie(c, ACCESS_COOKIE, newAccess, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: ACCESS_MAX_AGE,
  });

  return c.json({ message: "Refreshed" });
});

authRoute.post("/logout", async (c) => {
  // Fix: Use getCookie helper instead of c.req.cookie
  const refreshToken = getCookie(c, REFRESH_COOKIE);

  if (refreshToken) {
    await pool.query(
      `UPDATE refresh_tokens SET revoked=true WHERE token_hash=$1`,
      [hashToken(refreshToken)]
    );
  }

  // Clear both cookies
  deleteCookie(c, ACCESS_COOKIE);
  deleteCookie(c, REFRESH_COOKIE);

  return c.json({ message: "Logged out" });
});

authRoute.post("/forgot-password", async (c) => {
  const { email } = await c.req.json();

  const user = await pool.query(
    `SELECT id FROM users WHERE email=$1`,
    [email.toLowerCase()]
  );

  if (!user.rows.length)
    return c.json({ message: "If account exists, email sent" });

  const rawToken = crypto.randomBytes(32).toString("hex");

  await pool.query(
    `INSERT INTO password_resets(user_id,token_hash,expires_at)
     VALUES($1,$2,NOW()+INTERVAL '1 hour')`,
    [user.rows[0].id, hashToken(rawToken)]
  );

  // Send email with rawToken link here

  return c.json({ message: "If account exists, email sent" });
});
