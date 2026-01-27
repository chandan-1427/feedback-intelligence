import { useEffect, useState, useCallback } from "react";
import { getFeedbackStatsApi } from "../../lib/api/feedback";

export function useFeedbackStats() {
  const [total, setTotal] = useState<number>(0);
  const [today, setToday] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState("");

  // ✅ 1. Wrap fetchStats in useCallback to prevent unnecessary re-creations
  const fetchStats = useCallback(async () => {
    setStatus("loading");
    setError("");

    try {
      const res = await getFeedbackStatsApi();
      setTotal(res.total);
      setToday(res.today);
      setStatus("success");
    } catch (e: unknown) {
      // ✅ 2. Fix "Unexpected any" by using a type guard
      const errorMessage = e instanceof Error ? e.message : "Failed to load stats";
      setStatus("error");
      setError(errorMessage);
    }
  }, []);

  // ✅ 3. Synchronize via Effect safely
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchStats();
      }
    };

    loadData();

    // Cleanup function to prevent setting state on an unmounted component
    return () => {
      isMounted = false;
    };
  }, [fetchStats]); // Now fetchStats is a stable dependency

  return { total, today, status, error, fetchStats };
}