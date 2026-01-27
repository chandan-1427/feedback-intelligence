import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import AuroraBackground from "../components/ui/AuroraBackground";
import { DemoPieChart } from "../components/ui/DemoPieChart";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0D0E0E] font-work text-white selection:bg-[#5A0091]/30">
      
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden pt-24 sm:pt-28 pb-16 sm:pb-20">
        {/* Aurora only for hero */}
        <AuroraBackground />

        {/* subtle background blobs */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#5A0091]/10 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-40 right-[-80px] h-64 w-64 rounded-full bg-indigo-500/10 blur-[100px]" />

        {/* Hero content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
            <Sparkles className="w-4 h-4 text-[#A855F7]" />
            Collect → Theme → Solve
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-semibold font-poppins tracking-tight text-white/90 leading-tight">
            Turn user feedback into{" "}
            <span className="text-[#A855F7]">clear actions</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/55 leading-relaxed">
            FeedbackIntel helps you store feedback, group it into themes, and
            generate solution plans so teams can move faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/signup")}
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-full
                bg-[#5A0091] text-white text-sm font-semibold
                hover:bg-[#6d0da8] transition
                active:scale-[0.98]
              "
            >
              Create account
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="
                w-full sm:w-auto
                inline-flex items-center justify-center
                px-6 py-3 rounded-full
                bg-white/5 border border-white/10
                text-white/80 text-sm font-semibold
                hover:bg-white/10 hover:text-white transition
                active:scale-[0.98]
              "
            >
              Open dashboard
            </button>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-semibold font-poppins text-white/90">
              Built for real feedback workflows
            </h2>
            <p className="mt-2 text-sm text-white/55">
              Keep feedback organized, reduce guesswork, and decide faster.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Secure storage",
                desc: "Save feedback safely in PostgreSQL.",
                icon: <ShieldCheck className="w-4 h-4 text-[#A855F7]" />,
              },
              {
                title: "AI theming",
                desc: "Auto-classify messages into themes like UI/UX, bugs, and feature requests.",
                icon: <Sparkles className="w-4 h-4 text-[#A855F7]" />,
              },
              {
                title: "Faster decisions",
                desc: "See patterns clearly so teams can prioritize improvements.",
                icon: <MessageSquare className="w-4 h-4 text-[#A855F7]" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  rounded-2xl border border-white/10 bg-white/[0.02]
                  p-5 hover:bg-white/[0.04] transition-colors
                "
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-white/85">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm text-white/55 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOLUTIONS PREVIEW ================= */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs text-white/60">
              <BrainCircuit className="w-4 h-4 text-[#A855F7]" />
              Solution generator
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold font-poppins text-white/90 leading-snug">
              From grouped feedback → a clear plan
            </h2>

            <p className="mt-3 text-sm text-white/55 leading-relaxed max-w-lg">
              For each theme, FeedbackIntel generates a short plan with the root
              cause, quick fix, long-term fix, and priority.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">•</span> Root cause summary
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">•</span> Quick + long-term fix
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#A855F7]">•</span> Action steps and priority
              </li>
            </ul>

            <button
              onClick={() => navigate("/signup")}
              className="
                mt-7
                inline-flex items-center gap-2
                px-5 py-2.5 rounded-full
                bg-white/5 border border-white/10
                text-sm font-semibold text-white/80
                hover:bg-white/10 hover:text-white transition
                active:scale-[0.98]
              "
            >
              Try it
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: preview card */}
          <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[#5A0091]/10 blur-2xl" />

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-6">
              <div className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Example
              </div>

              <div className="mt-4 rounded-xl bg-black/30 border border-white/5 p-4">
                <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  Theme: Performance
                </p>
                <p className="mt-2 text-sm text-white/70 italic">
                  “Dashboard feels slow on mobile”
                </p>
                <p className="mt-1 text-sm text-white/70 italic">
                  “Analytics freezes sometimes”
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-[#5A0091]/10 border border-[#5A0091]/20 p-4">
                <div className="flex items-center gap-2 text-[11px] text-white/70 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Suggested plan
                </div>

                <div className="mt-3 text-sm text-white/70 space-y-1">
                  <p>
                    <span className="text-white/85 font-semibold">
                      Root cause:
                    </span>{" "}
                    heavy dashboard components
                  </p>
                  <p>
                    <span className="text-white/85 font-semibold">
                      Quick fix:
                    </span>{" "}
                    lazy-load charts
                  </p>
                  <p>
                    <span className="text-white/85 font-semibold">
                      Priority:
                    </span>{" "}
                    High
                  </p>
                </div>
              </div>

              {/* Feedback distribution */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
                  Feedback distribution
                </p>

                <DemoPieChart />
              </div>

              <p className="mt-4 text-xs text-white/35">
                Saved to your dashboard for review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 sm:py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold font-poppins text-white/90">
            Ready to organize feedback better?
          </h2>

          <p className="mt-2 text-sm text-white/55 max-w-xl mx-auto">
            Start collecting feedback, discover themes, and generate solutions.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate("/signup")}
              className="
                w-full sm:w-auto
                px-6 py-3 rounded-full
                bg-[#5A0091] text-white text-sm font-semibold
                hover:bg-[#6d0da8] transition
                active:scale-[0.98]
              "
            >
              Get started
            </button>

            <button
              onClick={() => navigate("/signin")}
              className="
                w-full sm:w-auto
                px-6 py-3 rounded-full
                bg-white/5 border border-white/10
                text-white/80 text-sm font-semibold
                hover:bg-white/10 hover:text-white transition
                active:scale-[0.98]
              "
            >
              Sign in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
