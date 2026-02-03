import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

const FROM_EMAIL = "Feedback Intel<onboarding@resend.dev>"; 

export const sendVerificationEmail = async (to: string, token: string) => {
  const link = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome!</h2>
        <p>Please click the button below to verify your email address:</p>
        <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Verify Email
        </a>
        <p>Or copy this link: ${link}</p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const link = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to proceed:</p>
        <a href="${link}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
      </div>
    `,
  });
};
