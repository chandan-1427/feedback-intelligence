import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, UserPlus } from "lucide-react";

import { useSignUp } from "../hooks/auth/useSignUp";

import FormAlert from "../components/ui/FormAlert";
import TextInput from "../components/ui/TextInput";
import PasswordInput from "../components/ui/PasswordInput";
import SubmitButton from "../components/ui/SubmitButton";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { signUp, isLoading, success, error } = useSignUp();

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 2 &&
      email.trim().length >= 5 &&
      password.trim().length >= 4 &&
      !isLoading &&
      !success
    );
  }, [username, email, password, isLoading, success]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await signUp({ username, email, password });
    
    if (ok) {
      // ✅ UPDATED: Redirect to a "Check your email" instruction page
      // instead of straight to login.
      setTimeout(() => navigate("/verify-instruction"), 1200);
    }
  };

  const disableFields = isLoading || success;

  return (
    <div className="min-h-screen bg-[#0D0E0E] text-white font-work selection:bg-[#5A0091]/30">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6 pt-24 pb-14">
        {/* Small header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70">
            <UserPlus className="w-4 h-4 text-white/60" />
            Create account
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-semibold font-poppins tracking-tight text-white/90">
            Get started
          </h1>

          <p className="mt-1 text-sm text-white/55">
            Create an account to manage feedback and insights.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
          <form className="space-y-4" onSubmit={handleSignUp}>
            {/* Alerts */}
            {error && <FormAlert type="error" message={error} />}

            {success && (
              <FormAlert
                type="success"
                message="Account created! Check your email to verify."
              />
            )}

            <TextInput
              label="Username"
              icon={User}
              value={username}
              onChange={setUsername}
              placeholder="Chandan"
              required
              disabled={disableFields}
            />

            <TextInput
              label="Email"
              icon={Mail}
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="chandan@example.com"
              required
              disabled={disableFields}
            />

            <PasswordInput
              value={password}
              onChange={setPassword}
              required
              disabled={disableFields}
            />

            <SubmitButton
              text="Create account"
              loadingText="Creating..."
              successText="Created"
              isLoading={isLoading}
              success={success}
              disabled={!canSubmit}
            />

            {/* Small terms text */}
            <p className="text-xs text-white/35 leading-relaxed">
              By creating an account, you agree to our{" "}
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
                Terms
              </span>{" "}
              and{" "}
              <span className="text-white/60 hover:text-white cursor-pointer transition-colors">
                Privacy Policy
              </span>
              .
            </p>

            {/* Sign in link */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/45 text-center">
                Already have an account?
              </p>

              <div className="mt-2 text-center">
                <Link
                  to="/signin"
                  className="
                    inline-flex items-center justify-center
                    text-sm font-semibold text-[#A855F7]
                    hover:text-[#C084FC] transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]/40
                    focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0E0E]
                    active:scale-[0.98]
                  "
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Small bottom hint */}
        <p className="mt-5 text-center text-xs text-white/30">
          You'll need to verify your email before signing in.
        </p>
      </div>
    </div>
  );
};

export default SignUp;