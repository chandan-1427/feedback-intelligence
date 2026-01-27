const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "❌ VITE_API_BASE_URL is missing. Please define it in your .env file."
  );
}

export const env = {
  API_BASE_URL,
} as const;
