import type { SignUpPayload, SignUpResponse } from "../types/auth";
import { env } from "../config/env";

const API_BASE_URL = env.API_BASE_URL;

export async function signUpApi(payload: SignUpPayload): Promise<SignUpResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Registration failed. Please try again.",
      };
    }

    return { success: true, message: data?.message };
  } catch (err) {
    console.error("signUpApi error:", err);
    return {
      success: false,
      message: "Connection error. Please check your internet and try again.",
    };
  }
}

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse =
  | { success: true; message?: string }
  | { success: false; message: string };

export async function signInApi(payload: SignInPayload): Promise<SignInResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include", // ✅ receive/set httpOnly cookie
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Authentication failed",
      };
    }

    return { success: true, message: data?.message };
  } catch (err) {
    console.error("signInApi error:", err);
    return {
      success: false,
      message: "Connection error. Please try again.",
    };
  }
}

export async function logoutApi(): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // ✅ important to send cookie
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Logout failed");
  }

  return data as { message: string };
}
