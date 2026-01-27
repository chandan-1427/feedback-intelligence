import { Hono } from "hono";
import { pool } from "../db/client.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables & {
  jwtPayload: {
    userId: string;
    email: string;
    username: string;
    exp: number;
  };
};

export const clusterRoute = new Hono<{ Variables: Variables }>();

/**
 * GET /api/clusters/themes
 * Returns theme clusters only for the logged-in user
 */
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

    return c.json({
      clusters: result.rows,
    });
  } catch (err) {
    console.error("[clusters/themes] error:", err);
    return c.json({ message: "Failed to fetch clusters" }, 500);
  }
});

/**
 * GET /api/clusters/themes/:theme?limit=20
 * Returns feedbacks for one theme cluster (user scoped)
 */
clusterRoute.get("/themes/:theme", async (c) => {
  const { userId } = c.get("jwtPayload");

  // ✅ sanitize + normalize theme
  const rawTheme = c.req.param("theme")?.trim();
  if (!rawTheme || rawTheme.length > 100) {
    return c.json({ message: "Invalid theme" }, 400);
  }

  const theme = rawTheme; // keep original casing if you prefer

  const limitQ = Number(c.req.query("limit") || 20);
  const limit =
    Number.isFinite(limitQ) && limitQ > 0
      ? Math.min(limitQ, 100)
      : 20;

  try {
    // ✅ total count (for UI correctness)
    const countRes = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM feedbacks
      WHERE user_id = $1
        AND theme = $2
        AND theme_status = 'done'
      `,
      [userId, theme]
    );

    // ✅ paged data
    const dataRes = await pool.query(
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
      total: countRes.rows[0]?.total ?? 0,
      limit,
      feedbacks: dataRes.rows,
    });
  } catch (err) {
    console.error("[clusters/themes/:theme] error:", {
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
