import type { ThemeSingleResponse, BulkThemeResponse } from "../types/feedbackAi";
import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function themeFeedbackByIdApi(id: string): Promise<ThemeSingleResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback-ai/${id}/theme`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Failed to theme feedback");
  }

  return data as ThemeSingleResponse;
}

export async function bulkThemeFeedbackApi(limit = 20): Promise<BulkThemeResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback-ai/theme/bulk?limit=${limit}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Bulk theming failed");
  }

  return data as BulkThemeResponse;
}
