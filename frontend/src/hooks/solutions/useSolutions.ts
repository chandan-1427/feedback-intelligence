import { useEffect, useState, useCallback, useRef } from "react";
import { getSolutionsApi } from "../../lib/api/solutions";

type SolutionRow = {
  theme: string;
  total_feedbacks: number;
  solution_summary: string;
  priority: string;
  confidence: number;
  updated_at: string;
};

export function useSolutions() {
  const [solutions, setSolutions] = useState<SolutionRow[]>([]);
  // ✅ Fix 1: Initialize status to 'loading' if you intend to fetch immediately.
  // This prevents the need for a synchronous setState('loading') inside the effect.
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("loading");
  const [error, setError] = useState("");
  
  // Use a ref to prevent double-fetching in React 18+ Dev mode
  const hasFetched = useRef(false);

  // ✅ Fix 2: Wrap in useCallback so the function identity is stable.
  const fetchSolutions = useCallback(async () => {
    // Only set loading if we aren't already in that state
    setStatus((prev) => (prev === "loading" ? prev : "loading"));
    setError("");

    try {
      const res = await getSolutionsApi();
      setSolutions(res.solutions);
      setStatus("success");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to load solutions";
      setStatus("error");
      setError(errorMessage);
    }
  }, []);

  useEffect(() => {
    // Guard against double-invocations
    if (hasFetched.current) return;
    
    let isMounted = true;

    const initLoad = async () => {
      if (isMounted) {
        await fetchSolutions();
      }
    };

    initLoad();
    hasFetched.current = true;

    return () => {
      isMounted = false;
    };
  }, [fetchSolutions]);

  return { solutions, status, error, fetchSolutions };
}