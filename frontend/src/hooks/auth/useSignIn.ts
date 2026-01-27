import { useState } from "react";
import { signInApi } from "../../lib/api/auth";

export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async (payload: { email: string; password: string }) => {
    setIsLoading(true);
    setError("");

    const result = await signInApi(payload);

    if (result.success) {
      setIsLoading(false);
      return true;
    }

    setError(result.message);
    setIsLoading(false);
    return false;
  };

  return { signIn, isLoading, error, setError };
}
