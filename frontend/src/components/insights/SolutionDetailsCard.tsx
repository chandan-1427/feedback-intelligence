import React, { useMemo, useState } from "react";
import {
  Wand2,
  Loader2,
  BadgeCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import type { ClusterSolution } from "../../lib/types/solutions";
import { useGenerateSolution } from "../../hooks/solutions/useGenerateSolution";

type Props = {
  selectedTheme: string | null;
  solution: ClusterSolution | null;
  status: "idle" | "loading" | "error" | "success";
  error?: string;
  onReload: (theme: string) => void;
};

const SolutionDetailsCard: React.FC<Props> = ({
  selectedTheme,
  solution,
  status,
  error,
  onReload,
}) => {
  const [limit, setLimit] = useState(25);
  const { generate, isLoading, error: genError } = useGenerateSolution();

  const isLoadingSolution = status === "loading";
  const isErrorSolution = status === "error";
  const hasSolution = status === "success" && !!solution;

  const canGenerate =
    !!selectedTheme && !isLoadingSolution && !isLoading && !hasSolution;

  const steps = useMemo(() => {
    const raw = solution?.action_steps;

    if (!raw) return [];
    if (Array.isArray(raw)) return raw;

    if (typeof raw === "string") {
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }, [solution?.action_steps]);

  const onGenerate = async () => {
    if (!selectedTheme) return;
    const ok = await generate(selectedTheme, limit);
    if (ok) onReload(selectedTheme);
  };

  const onRegenerate = async () => {
    if (!selectedTheme) return;
    const ok = await generate(selectedTheme, limit);
    if (ok) onReload(selectedTheme);
  };

  const confidencePct =
    solution?.confidence && Number.isFinite(solution.confidence)
      ? Math.round(solution.confidence * 100)
      : null;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold font-poppins text-white/90">
              Solution
            </h3>
            <p className="text-[12px] text-white/45">
              {selectedTheme ? (
                <>
                  Theme:{" "}
                  <span className="text-white/75 font-semibold">
                    {selectedTheme}
                  </span>
                </>
              ) : (
                "Select a theme to view or generate a solution."
              )}
            </p>
          </div>

          {/* Small actions */}
          {selectedTheme && (
            <button
              onClick={() => onReload(selectedTheme)}
              disabled={isLoadingSolution}
              className="
                shrink-0
                inline-flex items-center justify-center gap-2
                px-3 py-2 rounded-xl
                bg-white/5 border border-white/10
                text-xs font-semibold text-white/70
                hover:bg-white/10 hover:text-white
                transition active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Reload"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoadingSolution ? "animate-spin" : ""}`}
              />
              Reload
            </button>
          )}
        </div>

        <div className="mt-4 h-px bg-white/10" />
      </div>

      {/* Body */}
      <div className="px-5 pb-5 space-y-4 min-w-0">
        {/* Loading */}
        {isLoadingSolution && (
          <div className="flex items-center gap-2 text-sm text-white/55 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading solution...
          </div>
        )}

        {/* Error */}
        {!isLoadingSolution && isErrorSolution && (
          <div className="flex items-start gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">
              {error || "Failed to load solution."}
            </span>
          </div>
        )}

        {/* Idle */}
        {!selectedTheme && status !== "loading" && (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4 text-sm text-white/55">
            Pick a theme on the left to view details here.
          </div>
        )}

        {/* Generate panel (only when theme selected but no solution) */}
        {selectedTheme && !hasSolution && status !== "loading" && (
          <div className="rounded-xl bg-white/[0.015] border border-white/[0.06] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white/85">
                  No saved solution
                </p>
                <p className="text-xs text-white/45 mt-1">
                  Generate one using the latest feedback from this theme.
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <div className="sm:w-32">
                <label className="block text-[11px] text-white/35 mb-1">
                  Limit
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="
                    w-full px-3 py-2 rounded-xl
                    bg-black/20 border border-white/10
                    text-sm text-white/85
                    outline-none
                    focus:border-[#5A0091]
                    focus:ring-2 focus:ring-[#5A0091]/20
                  "
                />
              </div>

              <button
                onClick={onGenerate}
                disabled={!canGenerate}
                className="
                  flex-1
                  inline-flex items-center justify-center gap-2
                  px-4 py-2 rounded-xl
                  bg-[#5A0091] text-white
                  text-sm font-semibold
                  hover:bg-[#6d0da8]
                  transition active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate solution
                  </>
                )}
              </button>
            </div>

            {genError && (
              <div className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {genError}
              </div>
            )}
          </div>
        )}

        {/* Solution content */}
        {hasSolution && solution && (
          <>
            {/* Summary */}
            <div className="rounded-xl bg-white/[0.015] border border-white/[0.06] p-4">
              <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                Summary
              </p>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                {solution.solution_summary}
              </p>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/65">
                Priority:{" "}
                <span className="text-white/80 font-semibold">
                  {solution.priority || "N/A"}
                </span>
              </span>

              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/65 inline-flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-white/40" />
                Confidence:{" "}
                <span className="text-white/80 font-semibold">
                  {confidencePct !== null ? `${confidencePct}%` : "--"}
                </span>
              </span>

              <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/55">
                Updated:{" "}
                {solution.updated_at
                  ? new Date(solution.updated_at).toLocaleDateString()
                  : "--"}
              </span>
            </div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 gap-3">
              <InfoBlock title="Root cause" text={solution.root_cause} />
              <InfoBlock title="Quick fix" text={solution.quick_fix} />
              <InfoBlock title="Long-term fix" text={solution.long_term_fix} />
              <div className="rounded-xl bg-white/[0.015] border border-white/[0.06] p-4">
                <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">
                  Actions
                </p>

                {Array.isArray(steps) && steps.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {steps.slice(0, 6).map((s: string, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-white/70 leading-relaxed flex gap-2"
                      >
                        <span className="text-white/35">{idx + 1}.</span>
                        <span className="break-words">{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-2 text-sm text-white/45">
                    No steps saved.
                  </div>
                )}

                {/* Regenerate */}
                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onRegenerate}
                    disabled={isLoading}
                    className="
                      inline-flex items-center justify-center gap-2
                      px-3 py-2 rounded-xl
                      bg-white/5 border border-white/10
                      text-xs font-semibold text-white/70
                      hover:bg-white/10 hover:text-white
                      transition active:scale-95
                      disabled:opacity-50 disabled:cursor-not-allowed
                    "
                    title="Regenerate with latest data"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        Regenerate
                      </>
                    )}
                  </button>

                  <div className="text-[11px] text-white/35">
                    Uses the latest feedback.
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InfoBlock = ({ title, text }: { title: string; text: string }) => {
  return (
    <div className="rounded-xl bg-white/[0.015] border border-white/[0.06] p-4 min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-white/40 font-semibold">
        {title}
      </p>
      <p className="mt-2 text-sm text-white/70 leading-relaxed break-words">
        {text || "--"}
      </p>
    </div>
  );
};

export default SolutionDetailsCard;
