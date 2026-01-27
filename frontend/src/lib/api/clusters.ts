import type { GetThemeClustersResponse, GetThemeClusterDetailsResponse } from "../types/clusters";
import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function getThemeClustersApi(): Promise<GetThemeClustersResponse> {
  const res = await fetch(`${API_BASE_URL}/api/clusters/themes`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch clusters");

  return data as GetThemeClustersResponse;
}

export async function getThemeClusterDetailsApi(theme: string, limit = 20): Promise<GetThemeClusterDetailsResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/clusters/themes/${encodeURIComponent(theme)}?limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch theme feedbacks");

  return data as GetThemeClusterDetailsResponse;
}
