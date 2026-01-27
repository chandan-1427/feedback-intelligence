import { useState } from "react";
import { logoutApi } from "../../lib/api/auth";

export function useLogout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const logout = async () => {
    setIsLoading(true);
    setError("");

    try {
      await logoutApi();
      return true;
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Logout failed";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
}
