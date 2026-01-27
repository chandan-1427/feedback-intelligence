import { Hono } from "hono";
import { pool } from "@/db/client.js";
import { themeFeedbackWithGroq } from "@/ai/themeWithGroq.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables & {
  jwtPayload?: {
    userId: string;
    email: string;
    username: string;
    exp: number;
  };
};

export const feedbackThemeRoute = new Hono<{ Variables: Variables }>();

/* ------------------------------------------------------------------ */
/* Helpers */
/* ------------------------------------------------------------------ */

const MAX_THEME_ATTEMPTS = 3;
const AI_TIMEOUT_MS = 25_000;

function requireAuth(c: any): string {
  const payload = c.get("jwtPayload");
  if (!payload?.userId) {
    throw new Error("UNAUTHORIZED");
  }
  return payload.userId;
}

function isUUID(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), ms)
    ),
  ]);
}

function safeErrorMessage(err: unknown) {
  return err instanceof Error ? err.message.slice(0, 200) : "AI failed";
}

/* ------------------------------------------------------------------ */
/* Theme single feedback */
/* POST /api/feedback-ai/:id/theme */
/* ------------------------------------------------------------------ */

feedbackThemeRoute.post("/:id/theme", async (c) => {
  const id = c.req.param("id");

  if (!isUUID(id)) {
    return c.json({ message: "Invalid feedback id." }, 400);
  }

  let userId: string;

  try {
    userId = requireAuth(c);
  } catch {
    return c.json({ message: "Unauthorized." }, 401);
  }

  try {
    const fbRes = await pool.query(
      `
      SELECT id, message, theme_status, theme_attempts
      FROM feedbacks
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (fbRes.rows.length === 0) {
      return c.json(
        { message: "Feedback not found or access denied." },
        404
      );
    }

    const feedback = fbRes.rows[0];

    if (feedback.theme_attempts >= MAX_THEME_ATTEMPTS) {
      return c.json(
        { message: "Maximum theming attempts reached." },
        429
      );
    }

    await pool.query(
      `
      UPDATE feedbacks
      SET theme_status = 'processing',
          theme_attempts = theme_attempts + 1,
          theme_error = NULL,
          theme_updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    const analysis = await withTimeout(
      themeFeedbackWithGroq(feedback.message),
      AI_TIMEOUT_MS
    );

    await pool.query(
      `
      UPDATE feedbacks
      SET theme = $3,
          sentiment = $4,
          confidence = $5,
          summary = $6,
          theme_status = 'done',
          themed_at = NOW(),
          theme_updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      `,
      [
        id,
        userId,
        analysis.theme,
        analysis.sentiment,
        String(analysis.confidence),
        analysis.summary,
      ]
    );

    return c.json({ message: "Themed successfully", analysis });
  } catch (err) {
    console.error("Theme error:", err);

    await pool.query(
      `
      UPDATE feedbacks
      SET theme_status = 'failed',
          theme_error = $3,
          theme_updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId, safeErrorMessage(err)]
    );

    return c.json({ message: "Internal server error." }, 500);
  }
});

/* ------------------------------------------------------------------ */
/* Bulk theme */
/* POST /api/feedback-ai/theme/bulk?limit=20 */
/* ------------------------------------------------------------------ */

feedbackThemeRoute.post("/theme/bulk", async (c) => {
  let userId: string;

  try {
    userId = requireAuth(c);
  } catch {
    return c.json({ message: "Unauthorized." }, 401);
  }

  const limitQ = Number(c.req.query("limit") || 20);
  const limit =
    Number.isFinite(limitQ) && limitQ > 0
      ? Math.min(limitQ, 100)
      : 20;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const pendingRes = await client.query(
      `
      SELECT id, message, theme_attempts
      FROM feedbacks
      WHERE user_id = $1
        AND theme_status = 'pending'
        AND theme_attempts < $2
      ORDER BY created_at ASC
      FOR UPDATE SKIP LOCKED
      LIMIT $3
      `,
      [userId, MAX_THEME_ATTEMPTS, limit]
    );

    const items = pendingRes.rows;

    if (items.length === 0) {
      await client.query("COMMIT");
      return c.json({
        message: "No pending feedbacks to theme.",
        total: 0,
        results: [],
      });
    }

    await client.query(
      `
      UPDATE feedbacks
      SET theme_status = 'processing',
          theme_attempts = theme_attempts + 1,
          theme_error = NULL,
          theme_updated_at = NOW()
      WHERE user_id = $1
        AND id = ANY($2::uuid[])
      `,
      [userId, items.map((i: { id: string }) => i.id)]
    );

    await client.query("COMMIT");

    const results: any[] = [];

    for (const item of items) {
      try {
        const analysis = await withTimeout(
          themeFeedbackWithGroq(item.message),
          AI_TIMEOUT_MS
        );

        await pool.query(
          `
          UPDATE feedbacks
          SET theme = $3,
              sentiment = $4,
              confidence = $5,
              summary = $6,
              theme_status = 'done',
              themed_at = NOW(),
              theme_updated_at = NOW()
          WHERE id = $1 AND user_id = $2
          `,
          [
            item.id,
            userId,
            analysis.theme,
            analysis.sentiment,
            String(analysis.confidence),
            analysis.summary,
          ]
        );

        results.push({ feedbackId: item.id, ok: true });
      } catch (err) {
        await pool.query(
          `
          UPDATE feedbacks
          SET theme_status = 'failed',
              theme_error = $3,
              theme_updated_at = NOW()
          WHERE id = $1 AND user_id = $2
          `,
          [item.id, userId, safeErrorMessage(err)]
        );

        results.push({
          feedbackId: item.id,
          ok: false,
          error: safeErrorMessage(err),
        });
      }
    }

    return c.json({
      message: "Bulk theming completed",
      total: items.length,
      results,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Bulk theme error:", err);
    return c.json({ message: "Internal server error." }, 500);
  } finally {
    client.release();
  }
});
