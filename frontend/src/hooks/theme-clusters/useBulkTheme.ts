import { useState } from "react";
import { bulkThemeFeedbackApi } from "../../lib/api/feedbackAi";
import type { BulkThemeResponse } from "../../lib/types/feedbackAi";

export function useBulkTheme() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkThemeResponse | null>(null);
  const [error, setError] = useState("");

  const bulkTheme = async (limit = 20) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await bulkThemeFeedbackApi(limit);
      setResult(res);
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Bulk theming failed";
      setResult(null);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { bulkTheme, isLoading, result, error, setResult };
}
