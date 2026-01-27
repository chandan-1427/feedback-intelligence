import type { 
  GetFeedbacksResponse, 
  FeedbackStatsResponse, 
  StoreFeedbackResponse, 
  StoreBulkFeedbackResponse, 
  PendingFeedbackCountResponse 
} from "../types/feedback";

import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function storeFeedbackApi(message: string): Promise<StoreFeedbackResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback/store-feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to store feedback");

  return data as StoreFeedbackResponse;
}

export async function storeBulkFeedbackApi(
  messages: string[]
): Promise<StoreBulkFeedbackResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback/store-bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ messages }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to store bulk feedback");

  return data as StoreBulkFeedbackResponse;
}

export async function getFeedbacksApi(page = 1, limit = 20): Promise<GetFeedbacksResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/feedback/get-feedbacks?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch feedbacks");

  return data as GetFeedbacksResponse;
}

/** ✅ NEW: returns ONLY pending feedbacks */
export async function getPendingFeedbacksApi(page = 1, limit = 20): Promise<GetFeedbacksResponse> {
  const res = await fetch(
    `${API_BASE_URL}/api/feedback/pending?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch pending feedbacks");

  return data as GetFeedbacksResponse;
}

/** ✅ NEW: count pending feedbacks */
export async function getPendingFeedbackCountApi(): Promise<PendingFeedbackCountResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback/pending/count`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch pending feedback count");

  return data as PendingFeedbackCountResponse;
}

export async function getFeedbackStatsApi(): Promise<FeedbackStatsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/feedback/stats`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch stats");

  return data as FeedbackStatsResponse;
}
