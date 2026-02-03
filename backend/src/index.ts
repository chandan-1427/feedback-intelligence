import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { verify } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { getCookie } from "hono/cookie";
import { env } from "./config/env.js";
import { connectDB } from "./db/connect.js";
import { pool } from "./db/client.js";
import { authRoute } from "./routes/auth.route.js";
import { feedbackRoute } from "./routes/feedback.route.js";
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
app.use("/api/*", async (c, next) => {
  const token = getCookie(c, "access_token");

  if (!token) {
    return c.json({ message: "Unauthorized" }, 401);
  }
;
  try {
    // FIX 1: Add "HS256"
    // Cast payload to 'any' or your specific type if TS complains about strict shape
    const payload = await verify(token, env.JWT_SECRET, "HS256") as unknown as Variables['jwtPayload'];
    
    // FIX 2: Set "user" to match the type definition above
    c.set("jwtPayload", payload);
    
    await next();
  } catch (err) {
    return c.json({ message: "Invalid or expired token" }, 401);
  }
});

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

  console.log("Graceful shutdown initiated...");

  // Set a timeout to force exit if closing takes too long
  const forceExit = setTimeout(() => {
    console.error("Could not close connections in time, forcefully shutting down");
    process.exit(1);
  }, 10000);

  try {
    await pool.end(); // Close DB first
    server.close();   // Stop accepting new requests
    clearTimeout(forceExit);
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
