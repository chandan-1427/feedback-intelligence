import type { SolutionGenerateResponse, SolutionsListResponse, SolutionDetailsResponse } from "../types/solutions";

import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function generateSolutionApi(theme: string, limit = 25): Promise<SolutionGenerateResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/solutions/themes/${encodeURIComponent(theme)}/generate?limit=${limit}`,
    {
      method: "POST",
      credentials: "include",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to generate solution");

  return data as SolutionGenerateResponse;
}

export async function getSolutionsApi(): Promise<SolutionsListResponse> {
  const res = await fetch(`${API_BASE_URL}/api/solutions`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch solutions list");

  return data as SolutionsListResponse;
}

export async function getSolutionByThemeApi(theme: string): Promise<SolutionDetailsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/solutions/themes/${encodeURIComponent(theme)}`, {
    method: "GET",
    credentials: "include",
  });

  // Handle 404 gracefully
  if (res.status === 404) {
    return { message: "Not Found", solution: null }; 
  }

  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch solution");
  }

  return data as SolutionDetailsResponse;
}