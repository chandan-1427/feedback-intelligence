import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { env } from "@/config/env.js";
import { connectDB } from "@/db/connect.js";
import { pool } from "@/db/client.js";
import { authRoute } from "@/routes/auth.route.js";
import { feedbackRoute } from "@/routes/feedback.route.js";
import { feedbackThemeRoute } from "./routes/feedbackTheme.route.js";
import { clusterRoute } from "./routes/clusters.route.js";
import { solutionsRoute } from "./routes/solutions.route.js";

type Variables = JwtVariables & {
  jwtPayload: {
    userId: string;
    email: string;
    username: string;
    exp: number;
  };
};

const app = new Hono<{ Variables: Variables }>();

app.onError((err, c) => {
  console.error("🛑 [HONO ERROR FULL]:", err); // ✅ important
  console.error("🛑 [HONO ERROR NAME]:", err.name);
  console.error("🛑 [HONO ERROR MESSAGE]:", err.message);

  if (err.name === "JwtTokenInvalid" || err.name === "JwtTokenNotFound") {
    return c.json({ message: "JWT Token is invalid or missing" }, 403);
  }

  return c.json({ message: err.message || "Internal Server Error" }, 500);
});


app.use(logger());

app.use("*", cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

if (env.NODE_ENV === "production") {
  app.use("*", csrf({ origin: env.FRONTEND_URL }));
}

// 5. PROTECTED ROUTE MIDDLEWARE
// This will intercept any request starting with /api/
app.use(
  "/api/*",
  jwt({
    secret: env.JWT_SECRET,
    cookie: "token", // Look for the JWT in the 'token' cookie
    alg: "HS256",    // Explicitly set algorithm to satisfy TS
  })
);

await connectDB();

app.get("/", (c) => c.text("Hello, Hono 1"));

// Example of a Protected Route
app.get("/api/me", (c) => {
  const payload = c.get("jwtPayload"); // Fully typed!
  return c.json({
    message: "Authorized",
    user: {
      id: payload.userId,
      email: payload.email,
      username: payload.username,
    },
  });
});

app.get("/db-check", async (c) => {
  const result = await pool.query("SELECT NOW()");
  return c.json({ status: "Connected", dbTime: result.rows[0] });
});

app.route("/auth", authRoute);
app.route("/api/feedback", feedbackRoute);
app.route("/api/feedback-ai", feedbackThemeRoute);
app.route("/api/clusters", clusterRoute);
app.route("/api/solutions", solutionsRoute);

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server running on http://localhost:${info.port}`);
  }
);

let isShuttingDown = false;

const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("Shutting down server...");
  await pool.end();
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
