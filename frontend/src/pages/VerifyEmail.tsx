import { env } from "../lib/config/env";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const API_BASE_URL = env.API_BASE_URL;

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

async function verifyEmailApi(token: string): Promise<VerifyEmailResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Verification failed. Link may be expired.",
      };
    }

    return {
      success: true,
      message: data?.message || "Email verified successfully.",
    };
  } catch (err) {
    console.error("verifyEmailApi error:", err);
    return {
      success: false,
      message: "Connection error. Please try again.",
    };
  }
}

type Status = "verifying" | "success" | "error";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  // ✅ FIX: Initialize state correctly based on token presence immediately.
  // This prevents the "synchronous setState in useEffect" warning.
  const [status, setStatus] = useState<Status>(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "Verifying your email..." : "Invalid link: Missing token."
  );
  
  const hasFetched = useRef(false);

  useEffect(() => {
    // ✅ If no token, state is already "error" from line 52. Just exit.
    if (!token) return;

    // Prevent double-fetch in React StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verify = async () => {
      const result = await verifyEmailApi(token);

      if (result.success) {
        setStatus("success");
        setMessage(result.message || "Email verified successfully!");
        setTimeout(() => navigate("/signin"), 3000);
      } else {
        setStatus("error");
        setMessage(result.message || "Verification failed.");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0D0E0E] text-white font-work flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center">
        
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <Loader2 className="w-16 h-16 text-[#A855F7] animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </div>

        <h2 className="text-2xl font-semibold mb-2">
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Verified!"}
          {status === "error" && "Verification Failed"}
        </h2>

        <p className="text-white/60 mb-8">{message}</p>

        {status === "error" && (
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;