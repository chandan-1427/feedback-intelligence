import React, { useMemo, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  RefreshCw,
  MessageSquarePlus,
  Layers,
  Wand2,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  MousePointerClick,
} from "lucide-react";

type Step = {
  id: string;
  icon: React.ReactNode;
  title: string;
  summary: string;
  details: React.ReactNode;
};

const UserManual: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [activeStepId, setActiveStepId] = useState<string>("dashboard");

  const steps: Step[] = useMemo(
    () => [
      {
        id: "dashboard",
        icon: <LayoutDashboard className="w-4 h-4 text-[#A855F7]" />,
        title: "Start on Dashboard",
        summary: "View your stats and submit new feedback.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              The Dashboard is the main page where you can submit feedback and
              see what’s happening in your account.
            </p>

            <ul className="space-y-2 text-[13px] text-white/65">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5" />
                See your account info (username + email)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5" />
                Use{" "}
                <span className="inline-flex items-center gap-1 text-white/80">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </span>{" "}
                to reload stats and lists
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "stats",
        icon: <FileText className="w-4 h-4 text-[#A855F7]" />,
        title: "Understand the stats",
        summary: "Quick numbers that explain your activity.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              Stats help you quickly understand how much feedback you’ve
              collected and what still needs AI theming.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[10px] tracking-widest text-white/35 font-semibold uppercase">
                  Total
                </p>
                <p className="text-[12px] text-white/70 mt-1">
                  Total feedback stored so far
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[10px] tracking-widest text-white/35 font-semibold uppercase">
                  Today
                </p>
                <p className="text-[12px] text-white/70 mt-1">
                  Feedback submitted today
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[10px] tracking-widest text-white/35 font-semibold uppercase">
                  Pending
                </p>
                <p className="text-[12px] text-white/70 mt-1">
                  Waiting for AI theming
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "submit",
        icon: <MessageSquarePlus className="w-4 h-4 text-[#A855F7]" />,
        title: "Submit feedback",
        summary: "Write one clear message. Use templates if needed.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              Use the Feedback Composer to submit user issues, requests, and
              ideas. Keep it short and specific.
            </p>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3 text-[13px] text-white/65">
              <p className="text-white/80 font-semibold">Good example</p>
              <p className="mt-1 text-white/65">
                “Dashboard takes 8–10 seconds to load on mobile after login.”
              </p>
            </div>

            <ul className="space-y-2 text-[13px] text-white/65">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5" />
                After submit, feedback appears in <span className="text-white/80">Pending</span>
              </li>
              <li className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-300 mt-0.5" />
                “Pending” means AI theming is not done yet
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "theming",
        icon: <Wand2 className="w-4 h-4 text-[#A855F7]" />,
        title: "Theme feedback with AI",
        summary: "Manual (one) or bulk (many). Bulk is faster.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              AI theming adds a label (like “UI”, “Login”, “Performance”). This
              is required to create clusters and generate solutions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[13px] font-semibold text-white/85">
                  Manual theming
                </p>
                <p className="text-[12px] text-white/60 mt-1">
                  Theme one item from Pending list.
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[13px] font-semibold text-white/85">
                  Bulk theming (recommended)
                </p>
                <p className="text-[12px] text-white/60 mt-1">
                  Theme multiple items in one click from Insights.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3 text-[12px] text-white/60 flex gap-2">
              <Info className="w-4 h-4 mt-0.5 text-white/40" />
              If clusters look empty, run bulk theming first.
            </div>
          </div>
        ),
      },
      {
        id: "clusters",
        icon: <Layers className="w-4 h-4 text-[#A855F7]" />,
        title: "Explore theme clusters",
        summary: "See grouped feedback messages by theme.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              After theming, feedback is grouped into clusters (themes). This
              helps you quickly see repeated problems.
            </p>

            <ul className="space-y-2 text-[13px] text-white/65">
              <li className="flex gap-2">
                <MousePointerClick className="w-4 h-4 text-white/40 mt-0.5" />
                Click a theme to view related messages
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 mt-0.5" />
                You can review message sentiment and AI summary (if available)
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: "solutions",
        icon: <FileText className="w-4 h-4 text-[#A855F7]" />,
        title: "Generate and reuse solutions",
        summary: "Create a plan per theme and save it for later.",
        details: (
          <div className="space-y-3">
            <p className="text-[13px] text-white/70 leading-relaxed">
              Solutions are saved action plans created for a theme cluster. They
              help teams decide what to fix first.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[13px] font-semibold text-white/85">
                  Saved solutions
                </p>
                <p className="text-[12px] text-white/60 mt-1">
                  Open any saved solution from the list.
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] border border-white/10 px-3 py-3">
                <p className="text-[13px] font-semibold text-white/85">
                  Generate new solution
                </p>
                <p className="text-[12px] text-white/60 mt-1">
                  If no plan exists for a theme, generate one and it saves automatically.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  const activeStep = steps.find((s) => s.id === activeStepId) ?? steps[0];

  return (
    <div className="mt-20 backdrop-blur-md shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold">
              <BookOpen className="w-4 h-4 text-[#A855F7]" />
              <span>User manual</span>
            </div>

            <h2 className="mt-3 text-lg md:text-xl font-semibold font-poppins text-white/90">
              How to use FeedbackIntel
            </h2>

            <p className="mt-1 text-[13px] text-white/50 max-w-2xl leading-relaxed">
              A simple guide from submitting feedback → AI theming → clusters → solutions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="
              shrink-0 inline-flex items-center gap-2
              px-3 py-2 rounded-xl
              bg-white/5 border border-white/10
              text-xs font-semibold text-white/70
              hover:bg-white/10 hover:text-white
              transition active:scale-95
            "
          >
            {open ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${open ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="px-5 pb-5">
          {/* Flow chips */}
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/60">
              Submit feedback
            </span>
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/60">
              Theme with AI
            </span>
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/60">
              Explore clusters
            </span>
            <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 text-white/60">
              Generate solutions
            </span>
          </div>

          {/* Two-column layout (mobile friendly) */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 items-start">
            {/* Left: step list */}
            <div className="rounded-xl bg-white/[0.02] border border-white/10 p-2">
              <div className="space-y-1">
                {steps.map((s) => {
                  const active = s.id === activeStepId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveStepId(s.id)}
                      className={`
                        w-full text-left rounded-xl px-3 py-2
                        transition active:scale-[0.99]
                        ${active
                          ? "bg-white/5 border border-white/10"
                          : "hover:bg-white/[0.03] border border-transparent"}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`
                            mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center
                            ${active ? "bg-[#5A0091]/15 border border-[#5A0091]/25" : "bg-white/5 border border-white/10"}
                          `}
                        >
                          {s.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white/85">
                            {s.title}
                          </p>
                          <p className="text-[12px] text-white/45 mt-0.5 line-clamp-2">
                            {s.summary}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: active step details */}
            <div className="rounded-xl bg-black/20 border border-white/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  {activeStep.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white/90">
                    {activeStep.title}
                  </p>
                  <p className="text-[13px] text-white/45 mt-0.5">
                    {activeStep.summary}
                  </p>
                </div>
              </div>

              <div className="mt-4">{activeStep.details}</div>

              {/* Footer helper */}
              <div className="mt-5 pt-4 border-t border-white/10 text-[12px] text-white/45">
                Tip: If clusters are empty, run <span className="text-white/70">Bulk theming</span> first.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Small bottom strip (always visible) */}
      <div className="px-5 py-3 border-t border-white/10 text-[12px] text-white/45">
        This manual is for new users and demos. Keep feedback short and specific for better results.
      </div>
    </div>
  );
};

export default UserManual;
