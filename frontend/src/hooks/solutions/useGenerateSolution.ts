import { useState } from "react";
import { generateSolutionApi } from "../../lib/api/solutions";

export function useGenerateSolution() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generate = async (theme: string, limit = 25) => {
    setIsLoading(true);
    setError("");

    try {
      await generateSolutionApi(theme, limit);
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to generate solution";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading, error };
}
