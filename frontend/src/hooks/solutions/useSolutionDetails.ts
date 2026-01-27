import { useState } from "react";
import { getSolutionByThemeApi } from "../../lib/api/solutions";
import type { ClusterSolution } from "../../lib/types/solutions";
export function useSolutionDetails() {
  const [solution, setSolution] = useState<ClusterSolution | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [error, setError] = useState("");

  const fetchSolution = async (theme: string) => {
    setStatus("loading");
    setError("");

    try {
      const res = await getSolutionByThemeApi(theme);
      
      // ✅ Check if the backend returned a null solution (404 case)
      if (!res.solution) {
        setSolution(null);
        setStatus("idle"); // 'idle' tells the UI: "Ready to generate"
        return true;
      }

      setSolution(res.solution);
      setStatus("success");
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Network error";
      setSolution(null);
      setStatus("error");
      setError(errorMessage);
      return false;
    }
  };

  return { solution, status, error, fetchSolution, setSolution };
}