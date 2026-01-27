import { useEffect, useState, useCallback, useRef } from "react";
import { getFeedbacksApi } from "../../lib/api/feedback";
import type { FeedbackItem } from "../../lib/types/feedback";

export function useFeedbacks(limit = 20) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [page, setPage] = useState(1);
  // ✅ Fix 1: Initialize status to 'loading' if you're fetching on mount
  // This avoids needing to call setStatus('loading') synchronously in the effect
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("loading");
  const [error, setError] = useState("");
  
  // Use a ref to prevent double-fetching in React Strict Mode (Dev)
  const hasFetched = useRef(false);

  const fetchFeedbacks = useCallback(async (pageToLoad: number) => {
    // Only set loading if we aren't already in a loading state
    setStatus((prev) => (prev === "loading" ? prev : "loading"));
    setError("");
    
    try {
      const res = await getFeedbacksApi(pageToLoad, limit);
      setFeedbacks(res.feedbacks);
      setPage(res.page);
      setStatus("success");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Something went wrong";
      setStatus("error");
      setError(errorMessage);
    }
  }, [limit]); 

  const removeFeedback = (id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    if (hasFetched.current) return;
    
    let isMounted = true;

    // ✅ Fix 2: Wrap the call in an async IIFE or a simple function
    // This clarifies to the linter that the execution is part of a sync process
    const initFetch = async () => {
      if (isMounted) {
        await fetchFeedbacks(1);
      }
    };

    initFetch();
    hasFetched.current = true;

    return () => {
      isMounted = false;
    };
  }, [fetchFeedbacks]);

  return {
    feedbacks,
    page,
    limit,
    status,
    error,
    fetchFeedbacks,
    removeFeedback,
    nextPage: () => fetchFeedbacks(page + 1),
    prevPage: () => fetchFeedbacks(Math.max(1, page - 1)),
    refresh: () => fetchFeedbacks(page),
  };
}