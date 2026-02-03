import { Resend } from "resend";
import { env } from "../config/env.js";

if (!env.RESEND_API_KEY) {
  console.warn("⚠️ RESEND_API_KEY is not set. Emails will not be sent.");
}

const resend = env.RESEND_API_KEY
  ? new Resend(env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Feedback Intel <onboarding@resend.dev>";

export const sendVerificationEmail = async (
  to: string,
  token: string
) => {
  if (!resend) return;

  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome!</h2>
          <p>Please click the button below to verify your email address:</p>
          <a href="${link}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p>${link}</p>
          <p>This link expires in 24 hours.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("❌ Verification email error:", response.error);
      return;
    }

    console.log("✅ Verification email sent:", response.data?.id);
    return response.data;
  } catch (error) {
    console.error("❌ Verification email failed:", error);
  }
};

export const sendPasswordResetEmail = async (
  to: string,
  token: string
) => {
  if (!resend) return;

  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Reset your password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset</h2>
          <p>You requested a password reset. Click below:</p>
          <a href="${link}" 
             style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p>This link expires in 1 hour.</p>
        </div>
      `,
    });

    if (response.error) {
      console.error("❌ Password reset email error:", response.error);
      return;
    }

    console.log("✅ Password reset email sent:", response.data?.id);
    return response.data;
  } catch (error) {
    console.error("❌ Password reset email failed:", error);
  }
};
