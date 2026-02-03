import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import { Hono } from "hono";

/* ------------------ MOCKS ------------------ */

// mock pg pool
jest.unstable_mockModule("../src/db/client.js", () => ({
  pool: {
    query: jest.fn(),
  },
}));

// mock bcrypt
jest.unstable_mockModule("bcrypt", () => ({
  default: {
    hash: jest.fn(),
  },
}));

/* ------------------ IMPORTS AFTER MOCKS ------------------ */

const { authRoute } = await import("../src/routes/auth.route.js");
const { pool } = await import("../src/db/client.js");
const bcrypt = (await import("bcrypt")).default;

/* ------------------ APP SETUP ------------------ */

const app = new Hono();
app.route("/auth", authRoute);

const request = (path: string, body: any) =>
  app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

/* ------------------ TESTS ------------------ */

describe("POST /auth/sign-up", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if fields are missing", async () => {
    const res = await request("/auth/sign-up", {
      email: "test@example.com",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("All fields are required.");
  });

  it("returns 400 for invalid email", async () => {
    const res = await request("/auth/sign-up", {
      username: "chandan",
      email: "invalid-email",
      password: "password123",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("Invalid email format.");
  });

  it("returns 400 for weak password", async () => {
    const res = await request("/auth/sign-up", {
      username: "chandan",
      email: "test@example.com",
      password: "123",
    });

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe(
      "Password must be at least 8 characters long."
    );
  });

  it("returns 409 if email already exists", async () => {
    (pool.query as jest.Mock<(...args: any[]) => any>).mockResolvedValueOnce({
      rows: [{ id: 1 }],
    });

    const res = await request("/auth/sign-up", {
      username: "chandan",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.message).toBe("Unable to create account.");
  });

  it("creates user successfully", async () => {
    // 1. Cast pool.query to accept any function signature
    (pool.query as jest.Mock<(...args: any[]) => any>)
      // First call: email check (returns empty rows)
      .mockResolvedValueOnce({ rows: [] })
      // Second call: insert user (returns user object)
      .mockResolvedValueOnce({
        rows: [
          {
            id: 1,
            username: "chandan",
            email: "test@example.com",
            created_at: new Date(),
          },
        ],
      });

    // 2. Cast bcrypt.hash to accept any function signature
    (bcrypt.hash as jest.Mock<(...args: any[]) => any>)
      .mockResolvedValue("hashed-password");

    const res = await request("/auth/sign-up", {
      username: "chandan",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.message).toBe("Account created successfully.");
    expect(json.user.email).toBe("test@example.com");

    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it("returns 500 on unexpected error", async () => {
    // Silence the console.error for this specific test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    (pool.query as jest.Mock<(...args: any[]) => any>).mockRejectedValueOnce(
      new Error("DB failure")
    );

    const res = await request("/auth/sign-up", {
      username: "chandan",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.message).toBe("Internal server error.");

    // Clean up the spy
    consoleSpy.mockRestore();
  });
});
