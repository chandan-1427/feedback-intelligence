import { useState } from "react";
import { signUpApi } from "../../lib/api/auth";

export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const signUp = async (payload: {
    username: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError("");

    const result = await signUpApi(payload);

    if (result.success) {
      setSuccess(true);
      setError("");
      setIsLoading(false);
      return true;
    }

    setSuccess(false);
    setError(result.message);
    setIsLoading(false);
    return false;
  };

  return {
    signUp,
    isLoading,
    success,
    error,
    setError,
    setSuccess,
  };
}
