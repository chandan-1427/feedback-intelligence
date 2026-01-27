import { Hono } from "hono";
import { pool } from "../db/client.js";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables & {
  jwtPayload?: {
    userId: string;
    email: string;
  };
};

export const feedbackRoute = new Hono<{ Variables: Variables }>();

/* ----------------------------- helpers ----------------------------- */

const MAX_MESSAGE_LENGTH = 2000;
const MAX_BULK_COUNT = 50;

function requireAuth(c: any) {
  const payload = c.get("jwtPayload");
  if (!payload?.userId) {
    throw new Error("UNAUTHORIZED");
  }
  return payload.userId;
}

function safePageLimit(page?: string, limit?: string) {
  const p = Number(page);
  const l = Number(limit);

  const safePage = Number.isFinite(p) && p > 0 ? p : 1;
  const safeLimit =
    Number.isFinite(l) && l > 0 && l <= 100 ? l : 20;

  return {
    page: safePage,
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
  };
}

function validateMessage(msg: string) {
  if (!msg) return "Feedback message is required.";
  if (msg.length > MAX_MESSAGE_LENGTH) {
    return `Feedback must be under ${MAX_MESSAGE_LENGTH} characters.`;
  }
  return null;
}

/* ----------------------------- STORE SINGLE ----------------------------- */

feedbackRoute.post("/store-feedback", async (c) => {
  try {
    const userId = requireAuth(c);
    const { message } = await c.req.json();

    const clean = String(message || "").trim();
    const error = validateMessage(clean);
    if (error) {
      return c.json({ message: error }, 400);
    }

    const result = await pool.query(
      `
      INSERT INTO feedbacks (user_id, message)
      VALUES ($1, $2)
      RETURNING id, user_id, message, created_at
      `,
      [userId, clean]
    );

    return c.json(
      {
        message: "Feedback stored successfully.",
        feedback: result.rows[0],
      },
      201
    );
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return c.json({ message: "Unauthorized." }, 401);
    }
    console.error("STORE FEEDBACK ERROR:", err);
    return c.json({ message: "Internal server error." }, 500);
  }
});

/* ----------------------------- STORE BULK ----------------------------- */

feedbackRoute.post("/store-bulk", async (c) => {
  const client = await pool.connect();

  try {
    const userId = requireAuth(c);
    const { messages } = await c.req.json();

    if (!Array.isArray(messages)) {
      return c.json({ message: "Messages must be an array." }, 400);
    }

    const cleaned = messages
      .map((m) => String(m || "").trim())
      .filter(Boolean);

    if (cleaned.length === 0) {
      return c.json(
        { message: "At least one feedback message is required." },
        400
      );
    }

    if (cleaned.length > MAX_BULK_COUNT) {
      return c.json(
        { message: `Maximum ${MAX_BULK_COUNT} feedbacks allowed.` },
        400
      );
    }

    for (const msg of cleaned) {
      const err = validateMessage(msg);
      if (err) {
        return c.json({ message: err }, 400);
      }
    }

    await client.query("BEGIN");

    const values: any[] = [];
    const placeholders: string[] = [];

    cleaned.forEach((msg, i) => {
      const base = i * 2;
      placeholders.push(`($${base + 1}, $${base + 2})`);
      values.push(userId, msg);
    });

    const result = await client.query(
      `
      INSERT INTO feedbacks (user_id, message)
      VALUES ${placeholders.join(", ")}
      RETURNING id, user_id, message, created_at
      `,
      values
    );

    await client.query("COMMIT");

    return c.json(
      {
        message: "Bulk feedback stored successfully.",
        count: result.rows.length,
        feedbacks: result.rows,
      },
      201
    );
  } catch (err) {
    await client.query("ROLLBACK");
    if ((err as Error).message === "UNAUTHORIZED") {
      return c.json({ message: "Unauthorized." }, 401);
    }
    console.error("STORE BULK ERROR:", err);
    return c.json({ message: "Internal server error." }, 500);
  } finally {
    client.release();
  }
});

/* ----------------------------- GET PENDING ----------------------------- */

feedbackRoute.get("/pending", async (c) => {
  try {
    const userId = requireAuth(c);
    const { page, limit, offset } = safePageLimit(
      c.req.query("page"),
      c.req.query("limit")
    );

    const result = await pool.query(
      `
      SELECT id, user_id, message, created_at, theme_status
      FROM feedbacks
      WHERE user_id = $1 AND theme_status = 'pending'
      ORDER BY created_at DESC, id DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset]
    );

    return c.json({ page, limit, feedbacks: result.rows });
  } catch (err) {
    return c.json({ message: "Unauthorized." }, 401);
  }
});

/* ----------------------------- GET ALL ----------------------------- */

feedbackRoute.get("/get-feedbacks", async (c) => {
  try {
    const userId = requireAuth(c);
    const { page, limit, offset } = safePageLimit(
      c.req.query("page"),
      c.req.query("limit")
    );

    const result = await pool.query(
      `
      SELECT id, user_id, message, created_at
      FROM feedbacks
      WHERE user_id = $1
      ORDER BY created_at DESC, id DESC
      LIMIT $2 OFFSET $3
      `,
      [userId, limit, offset]
    );

    return c.json({ page, limit, feedbacks: result.rows });
  } catch {
    return c.json({ message: "Unauthorized." }, 401);
  }
});

/* ----------------------------- COUNTS & STATS ----------------------------- */

feedbackRoute.get("/pending/count", async (c) => {
  try {
    const userId = requireAuth(c);
    const result = await pool.query(
      `
      SELECT COUNT(*)::int AS total
      FROM feedbacks
      WHERE user_id = $1 AND theme_status = 'pending'
      `,
      [userId]
    );

    return c.json({ total: result.rows[0]?.total ?? 0 });
  } catch {
    return c.json({ message: "Unauthorized." }, 401);
  }
});

feedbackRoute.get("/stats", async (c) => {
  try {
    const userId = requireAuth(c);

    const [totalRes, todayRes] = await Promise.all([
      pool.query(
        `SELECT COUNT(*)::int AS total FROM feedbacks WHERE user_id = $1`,
        [userId]
      ),
      pool.query(
        `
        SELECT COUNT(*)::int AS today
        FROM feedbacks
        WHERE user_id = $1 AND created_at::date = CURRENT_DATE
        `,
        [userId]
      ),
    ]);

    return c.json({
      total: totalRes.rows[0].total,
      today: todayRes.rows[0].today,
    });
  } catch {
    return c.json({ message: "Unauthorized." }, 401);
  }
});
