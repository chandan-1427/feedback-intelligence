import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, LogIn } from "lucide-react";

import { useSignIn } from "../hooks/auth/useSignIn";

import FormAlert from "../components/ui/FormAlert";
import TextInput from "../components/ui/TextInput";
import PasswordInput from "../components/ui/PasswordInput";
import SubmitButton from "../components/ui/SubmitButton";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { signIn, isLoading, error } = useSignIn();

  const disableFields = isLoading;

  const canSubmit = useMemo(() => {
    return email.trim().length > 3 && password.trim().length >= 4 && !isLoading;
  }, [email, password, isLoading]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    const ok = await signIn({ email, password });
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0D0E0E] text-white font-work selection:bg-[#5A0091]/30">
      <div className="mx-auto w-full max-w-md px-4 sm:px-6 pt-24 pb-14">
        {/* Small header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white/70">
            <LogIn className="w-4 h-4 text-white/60" />
            Sign in
          </div>

          <h1 className="mt-4 text-2xl sm:text-3xl font-semibold font-poppins tracking-tight text-white/90">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-white/55">
            Use your email and password to continue.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-5 sm:p-6 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
          <form className="space-y-4" onSubmit={handleSignIn}>
            {error && <FormAlert type="error" message={error} />}

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
              text="Sign in"
              loadingText="Signing in..."
              successText="Signed in!"
              isLoading={isLoading}
              success={false}
              disabled={!canSubmit}
            />

            {/* Footer section */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-white/45 text-center">
                Don&apos;t have an account?
              </p>

              <div className="mt-2 text-center">
                <Link
                  to="/signup"
                  className="
                    inline-flex items-center justify-center
                    text-sm font-semibold text-[#A855F7]
                    hover:text-[#C084FC] transition
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A855F7]/40
                    focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0E0E]
                    active:scale-[0.98]
                  "
                >
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Small bottom hint (optional) */}
        <p className="mt-5 text-center text-xs text-white/30">
          Your session is secured using JWT cookies.
        </p>
      </div>
    </div>
  );
};

export default SignIn;
