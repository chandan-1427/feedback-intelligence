import React, { useMemo, useState } from "react";
import {
  Clock,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Loader2,
  Layers,
} from "lucide-react";
import { usePendingFeedbacks } from "../../hooks/feedbacks/usePendingFeedbacks";
import { useBulkTheme } from "../../hooks/theme-clusters/useBulkTheme";
import { useThemeSingle } from "../../hooks/theme-clusters/useThemeSingle";

// small local clamp utility
function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

type Props = {
  limit?: number;
};

const PendingFeedbackListCard: React.FC<Props> = ({ limit = 10 }) => {
  const { pendingFeedbacks, status, error, refresh, removePendingFeedback } =
    usePendingFeedbacks(limit);

  // ✅ Single theme hook (REUSED)
  const {
    themeOne,
    isLoading: isSingleLoading,
    error: singleThemeError,
  } = useThemeSingle();

  // ✅ Bulk theme hook
  const {
    bulkTheme,
    isLoading: isBulkLoading,
    result: bulkResult,
    error: bulkError,
  } = useBulkTheme();

  const safeLimit = useMemo(() => clamp(Number(limit || 0), 1, 100), [limit]);

  const [isExpanded, setIsExpanded] = useState(false);
  const [themingId, setThemingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isLoading = status === "loading";
  const isError = status === "error";

  const subtitle = useMemo(() => {
    if (isLoading) return "Loading...";
    if (isError) return "Failed to load";
    if (pendingFeedbacks.length === 0) return "No pending feedback";
    return `${pendingFeedbacks.length} pending`;
  }, [isLoading, isError, pendingFeedbacks.length]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 900);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // ✅ SINGLE THEME (via hook)
  const themeNow = async (id: string) => {
    setActionError("");
    setThemingId(id);

    try {
      const ok = await themeOne(id);
      if (ok) {
        removePendingFeedback(id);
      }
    } catch {
      // error already handled in hook
      setActionError(singleThemeError || "Theming failed");
    } finally {
      setThemingId(null);
    }
  };

  // ✅ BULK THEME
  const runBulkTheme = async () => {
    setActionError("");

    try {
      await bulkTheme(safeLimit);
      await refresh();
    } catch (e: unknown) {
      setActionError(
        e instanceof Error ? e.message : "Bulk theming failed"
      );
    }
  };

  // Prevent conflicting actions
  const disableActions = isLoading || isBulkLoading || isSingleLoading;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden min-w-0">
      {/* Header */}
      <div className="px-5 py-4 md:px-6">
        <div className="flex items-start justify-between gap-3">
          {/* Left: title + toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((p) => !p)}
            className="flex items-center gap-3 text-left min-w-0"
            aria-expanded={isExpanded}
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70">
              <Sparkles className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white/90">
                Pending feedback
              </h3>
              <p className="text-xs text-white/40 truncate">{subtitle}</p>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-white/35 shrink-0 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Refresh */}
            <button
              type="button"
              onClick={() => refresh()}
              disabled={disableActions}
              className="
                p-2 rounded-xl
                bg-white/5 border border-white/10
                text-white/50 hover:text-white hover:bg-white/10
                transition-all active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              title="Refresh"
              aria-label="Refresh pending feedback"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            {/* ✅ Bulk Theme Button (replaces Insights) */}
            {/* Bulk Theme — Desktop */}
            <button
              type="button"
              onClick={runBulkTheme}
              disabled={disableActions}
              className="
                hidden sm:inline-flex items-center gap-2
                px-3 py-2 rounded-xl
                bg-white/5 border border-white/10
                text-xs font-semibold text-white/80
                hover:bg-white/10 hover:text-white
                transition active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title={`Run bulk theme (max ${safeLimit})`}
            >
              {isBulkLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  Bulk theme
                </>
              )}
            </button>

            {/* Bulk Theme — Mobile (icon only) */}
            <button
              type="button"
              onClick={runBulkTheme}
              disabled={disableActions}
              className="
                sm:hidden
                p-2 rounded-xl
                bg-white/5 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10
                transition active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed
              "
              title={`Run bulk theme (max ${safeLimit})`}
              aria-label="Run bulk theme"
            >
              {isBulkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Layers className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${
            isExpanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 md:px-6 md:pb-6 space-y-4">
            <div className="h-px bg-white/10" />

            {/* Errors */}
            {(isError || actionError || bulkError) && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  {error ||
                    actionError ||
                    bulkError ||
                    "Something went wrong."}
                </p>
              </div>
            )}

            {/* ✅ Bulk result (optional small hint) */}
            {!bulkError && bulkResult?.message && (
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3 text-xs text-white/60">
                {bulkResult.message}{" "}
                <span className="text-white/35">
                  • Processed {bulkResult.total}
                </span>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/[0.03] border border-white/10 p-4"
                  >
                    <div className="h-3 w-4/5 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-2/5 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && pendingFeedbacks.length === 0 && (
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4 text-sm text-white/55">
                No pending feedback right now
              </div>
            )}

            {/* List */}
            {!isLoading && pendingFeedbacks.length > 0 && (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1 custom-scrollbar min-w-0">
                {pendingFeedbacks.map((f) => (
                  <div
                    key={f.id}
                    className="
                      rounded-xl bg-white/[0.02]
                      border border-white/10
                      p-4
                      hover:bg-white/[0.03]
                      transition-colors
                      min-w-0
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white/80 leading-relaxed break-words">
                          {f.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2 text-xs text-white/35">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(f.created_at).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Copy */}
                        <button
                          type="button"
                          onClick={() => handleCopy(f.id, f.message)}
                          className="
                            p-2 rounded-lg
                            bg-transparent border border-white/10
                            text-white/40 hover:text-white hover:bg-white/5
                            transition-all active:scale-95
                          "
                          title="Copy"
                          aria-label="Copy feedback"
                        >
                          {copiedId === f.id ? (
                            <Check className="w-4 h-4 text-emerald-300" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Theme Now */}
                        <button
                          type="button"
                          onClick={() => themeNow(f.id)}
                          disabled={themingId === f.id || disableActions}
                          className="
                            inline-flex items-center gap-2
                            px-3 py-2 rounded-lg
                            bg-[#5A0091] text-white
                            hover:bg-[#7A00C5]
                            transition-all active:scale-95
                            text-xs font-semibold
                            disabled:opacity-40 disabled:cursor-not-allowed
                          "
                          title="Theme now"
                          aria-label="Theme feedback now"
                        >
                          {themingId === f.id ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Theming...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              Theme
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Small helper */}
            <p className="text-[11px] text-white/30 text-center">
              You can theme feedback one-by-one, or run bulk theme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingFeedbackListCard;
