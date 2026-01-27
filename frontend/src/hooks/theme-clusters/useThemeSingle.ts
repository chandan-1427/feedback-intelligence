import { useState } from "react";
import { themeFeedbackByIdApi } from "../../lib/api/feedbackAi";
import type { FeedbackAiAnalysis } from "../../lib/types/feedbackAi";

export function useThemeSingle() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAiAnalysis | null>(null);
  const [error, setError] = useState("");

  const themeOne = async (id: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await themeFeedbackByIdApi(id);
      setAnalysis(res.analysis);
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Theming failed";
      
      setAnalysis(null);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { themeOne, isLoading, analysis, error, setAnalysis };
}
