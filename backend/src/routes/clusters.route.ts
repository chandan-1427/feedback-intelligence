import { Hono } from "hono";
import { pool } from "../db/client.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables & {
  jwtPayload: {
    userId: string;
    email: string;
    username: string;
  };
};

export const clusterRoute = new Hono<{ Variables: Variables }>();

/* -----------------------------
   Helpers
----------------------------- */
const normalizeTheme = (theme: string) =>
  theme.trim().toLowerCase().replace(/\s+/g, " ");

const validateTheme = (theme: string) =>
  theme.length >= 2 && theme.length <= 100;

/* -----------------------------------------
   GET /api/clusters/themes
----------------------------------------- */
clusterRoute.get("/themes", async (c) => {
  const { userId } = c.get("jwtPayload");

  try {
    const result = await pool.query(
      `
      SELECT
        theme,
        COUNT(*)::int AS total
      FROM feedbacks
      WHERE user_id = $1
        AND theme_status = 'done'
        AND theme IS NOT NULL
      GROUP BY theme
      ORDER BY total DESC
      `,
      [userId]
    );

    return c.json({ clusters: result.rows });
  } catch (err) {
    console.error("[clusters/themes]", err);
    return c.json({ message: "Failed to fetch clusters" }, 500);
  }
});

/* -----------------------------------------
   GET /api/clusters/themes/:theme
----------------------------------------- */
clusterRoute.get("/themes/:theme", async (c) => {
  const { userId } = c.get("jwtPayload");

  const rawTheme = c.req.param("theme")?.trim();
  if (!rawTheme || !validateTheme(rawTheme)) {
    return c.json({ message: "Invalid theme" }, 400);
  }

  const theme = normalizeTheme(rawTheme);

  const limitQ = Number(c.req.query("limit") || 20);
  const limit =
    Number.isFinite(limitQ) && limitQ > 0
      ? Math.min(limitQ, 100)
      : 20;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        message,
        created_at,
        sentiment,
        confidence,
        summary
      FROM feedbacks
      WHERE user_id = $1
        AND theme = $2
        AND theme_status = 'done'
      ORDER BY created_at DESC
      LIMIT $3
      `,
      [userId, theme, limit]
    );

    return c.json({
      theme,
      total: result.rows.length,
      limit,
      feedbacks: result.rows,
    });
  } catch (err) {
    console.error("[clusters/themes/:theme]", {
      userId,
      theme,
      err,
    });

    return c.json(
      { message: "Failed to fetch theme feedbacks" },
      500
    );
  }
});
