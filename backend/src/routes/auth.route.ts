import { Hono } from "hono";
import bcrypt from "bcrypt";
import { setCookie, deleteCookie } from "hono/cookie";
import { pool } from "../db/client.js";
import { signToken } from "../utils/jwt.js";
import { env } from "../config/env.js";

export const authRoute = new Hono();

const isProd = env.NODE_ENV === "production";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 day

/* ----------------------------- helpers ----------------------------- */

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isStrongPassword = (password: string) =>
  password.length >= 8;

const authError = () => ({
  message: "Invalid email or password."
});

/* ----------------------------- SIGN UP ----------------------------- */

authRoute.post("/sign-up", async (c) => {
  try {
    const { username, email, password } = await c.req.json();

    const safeUsername = username?.trim();
    const safeEmail = email?.trim().toLowerCase();

    if (!safeUsername || !safeEmail || !password) {
      return c.json(
        { message: "All fields are required." },
        400
      );
    }

    if (safeUsername.length < 3 || safeUsername.length > 30) {
      return c.json(
        { message: "Username must be between 3 and 30 characters." },
        400
      );
    }

    if (!isValidEmail(safeEmail)) {
      return c.json(
        { message: "Invalid email format." },
        400
      );
    }

    if (!isStrongPassword(password)) {
      return c.json(
        { message: "Password must be at least 8 characters long." },
        400
      );
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [safeEmail]
    );

    if (existing.rows.length > 0) {
      // prevent email enumeration
      return c.json(
        { message: "Unable to create account." },
        409
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `
        INSERT INTO users (username, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
      `,
      [safeUsername, safeEmail, passwordHash]
    );

    return c.json(
      {
        message: "Account created successfully.",
        user: result.rows[0],
      },
      201
    );
  } catch (err) {
    console.error("SIGN-UP ERROR:", err);
    return c.json(
      { message: "Internal server error." },
      500
    );
  }
});

/* ----------------------------- SIGN IN ----------------------------- */

authRoute.post("/sign-in", async (c) => {
  try {
    const { email, password } = await c.req.json();

    const safeEmail = email?.trim().toLowerCase();

    if (!safeEmail || !password) {
      return c.json(authError(), 400);
    }

    const result = await pool.query(
      `SELECT id, username, email, password_hash
       FROM users WHERE email = $1`,
      [safeEmail]
    );

    if (result.rows.length === 0) {
      return c.json(authError(), 401);
    }

    const user = result.rows[0];

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return c.json(authError(), 401);
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    setCookie(c, "token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return c.json({
      message: "Signed in successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("SIGN-IN ERROR:", err);
    return c.json(
      { message: "Internal server error." },
      500
    );
  }
});

/* ----------------------------- LOGOUT ----------------------------- */

authRoute.post("/logout", async (c) => {
  deleteCookie(c, "token", {
    path: "/",
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });

  return c.json({
    message: "Logged out successfully.",
  });
});
