import type { MeResponse } from "../types/user";
import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function getMeApi(): Promise<MeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return { message: data?.message || "Unauthorized" };
  }

  return data as MeResponse;
}
