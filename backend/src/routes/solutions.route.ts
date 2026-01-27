import { Hono } from "hono";
import { pool } from "../db/client.js";
import { generateClusterSolutionWithGroq } from "../ai/solutionWithGroq.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables & {
  jwtPayload: {
    userId: string;
    email: string;
    username: string;
    exp: number;
  };
};

export const solutionsRoute = new Hono<{ Variables: Variables }>();

/* -----------------------------
   Helpers
----------------------------- */
const normalizeTheme = (theme: string) =>
  theme.trim().toLowerCase();

const validateTheme = (theme: string) =>
  theme.length >= 2 && theme.length <= 100;

/* --------------------------------------------------
   POST /api/solutions/themes/:theme/generate
-------------------------------------------------- */
solutionsRoute.post("/themes/:theme/generate", async (c) => {
  const { userId } = c.get("jwtPayload");

  const rawTheme = c.req.param("theme")?.trim();
  if (!rawTheme || !validateTheme(rawTheme)) {
    return c.json({ message: "Invalid theme" }, 400);
  }

  const theme = normalizeTheme(rawTheme);
  const force = c.req.query("force") === "true";

  const limitQ = Number(c.req.query("limit") || 25);
  const limit = Number.isFinite(limitQ)
    ? Math.min(Math.max(limitQ, 5), 50)
    : 25;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // ✅ ensure row exists + lock it
    await client.query(
      `
      INSERT INTO cluster_solutions (user_id, theme, status)
      VALUES ($1, $2, 'processing')
      ON CONFLICT (user_id, theme)
      DO UPDATE SET status = 'processing', updated_at = NOW()
      `,
      [userId, theme]
    );

    const solutionRes = await client.query(
      `
      SELECT *
      FROM cluster_solutions
      WHERE user_id = $1 AND theme = $2
      FOR UPDATE
      `,
      [userId, theme]
    );

    const existingSolution = solutionRes.rows[0];

    // latest feedback timestamp
    const latestRes = await client.query(
      `
      SELECT MAX(created_at) AS latest_feedback_at
      FROM feedbacks
      WHERE user_id = $1
        AND theme = $2
        AND theme_status = 'done'
      `,
      [userId, theme]
    );

    const latestFeedbackAt = latestRes.rows[0]?.latest_feedback_at;

    if (!latestFeedbackAt) {
      await client.query("ROLLBACK");
      return c.json({ message: "No feedback found for this theme" }, 404);
    }

    const hasNewFeedback =
      existingSolution.last_feedback_at
        ? new Date(latestFeedbackAt).getTime() >
          new Date(existingSolution.last_feedback_at).getTime()
        : true;

    // ✅ cached response
    if (
      !force &&
      existingSolution.solution_summary &&
      !hasNewFeedback
    ) {
      await client.query("COMMIT");
      return c.json({
        cached: true,
        theme,
        solution: existingSolution,
      });
    }

    await client.query("COMMIT");

    /* ---------------- AI stage (outside tx) ---------------- */

    const fbRes = await pool.query(
      `
      SELECT message
      FROM feedbacks
      WHERE user_id = $1
        AND theme = $2
        AND theme_status = 'done'
      ORDER BY created_at DESC
      LIMIT $3
      `,
      [userId, theme, limit]
    );

    const feedbackMessages = fbRes.rows.map(r => r.message);

    if (feedbackMessages.length === 0) {
      throw new Error("No feedback messages found");
    }

    const solution = await generateClusterSolutionWithGroq({
      theme,
      feedbackMessages,
    });

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

    const totalFeedbacks = countRes.rows[0]?.total ?? 0;

    // ✅ persist result
    await pool.query(
      `
      UPDATE cluster_solutions
      SET
        total_feedbacks = $3,
        solution_summary = $4,
        root_cause = $5,
        quick_fix = $6,
        long_term_fix = $7,
        action_steps = $8,
        priority = $9,
        confidence = $10,
        last_generated_at = NOW(),
        last_feedback_at = $11,
        status = 'idle',
        updated_at = NOW()
      WHERE user_id = $1 AND theme = $2
      `,
      [
        userId,
        theme,
        totalFeedbacks,
        solution.solution_summary,
        solution.root_cause,
        solution.quick_fix,
        solution.long_term_fix,
        JSON.stringify(solution.action_steps),
        solution.priority,
        solution.confidence,
        latestFeedbackAt,
      ]
    );

    return c.json({
      cached: false,
      theme,
      totalFeedbacks,
      solution,
    });
  } catch (err: any) {
    console.error("[solutions/generate]", err);

    await pool.query(
      `
      UPDATE cluster_solutions
      SET status = 'failed', updated_at = NOW()
      WHERE user_id = $1 AND theme = $2
      `,
      [userId, normalizeTheme(rawTheme)]
    );

    return c.json({ message: "Failed to generate solution" }, 500);
  } finally {
    client.release();
  }
});

/* --------------------------------------------------
   GET /api/solutions
-------------------------------------------------- */
solutionsRoute.get("/", async (c) => {
  const { userId } = c.get("jwtPayload");

  const res = await pool.query(
    `
    SELECT theme, total_feedbacks, solution_summary, priority, confidence, updated_at
    FROM cluster_solutions
    WHERE user_id = $1
    ORDER BY updated_at DESC
    `,
    [userId]
  );

  return c.json({ solutions: res.rows });
});

/* --------------------------------------------------
   GET /api/solutions/themes/:theme
-------------------------------------------------- */
solutionsRoute.get("/themes/:theme", async (c) => {
  const { userId } = c.get("jwtPayload");

  const rawTheme = c.req.param("theme")?.trim();
  if (!rawTheme || !validateTheme(rawTheme)) {
    return c.json({ message: "Invalid theme" }, 400);
  }

  const theme = normalizeTheme(rawTheme);

  const res = await pool.query(
    `
    SELECT *
    FROM cluster_solutions
    WHERE user_id = $1 AND theme = $2
    `,
    [userId, theme]
  );

  if (res.rows.length === 0) {
    return c.json({ message: "Solution not found" }, 404);
  }

  return c.json({ solution: res.rows[0] });
});
