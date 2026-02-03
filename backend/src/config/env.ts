import 'dotenv/config';

interface Env {
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  FRONTEND_URL: string;
  NODE_ENV: string;
  GROQ_API_KEY: string;
  GROQ_MODEL: string;
}

const port = Number(process.env.PORT);

export const env: Env = {
  PORT: Number.isFinite(port) ? port : 3000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  FRONTEND_URL: process.env.FRONTEND_URL || "",
  NODE_ENV: process.env.NODE_ENV || "",
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
};

if(!env.DATABASE_URL) {
  console.warn("Warning: DATABASE_URL is not set.");
}
if(!env.JWT_SECRET) {
  console.warn("Warning: JWT_SECRET is not set.");
}
if(!env.JWT_EXPIRES_IN) {
  console.warn("Warning: JWT_EXPIRES_IN is not set.");
}
if(!env.GROQ_API_KEY) {
  console.warn("Warning: GROQ_API_KEY is not set.");
}