import React from "react";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";
import { usePendingFeedbackCount } from "../../hooks/feedbacks/usePendingFeedbackCount";

type Props = {
  className?: string;
};

const PendingFeedbackCountCard: React.FC<Props> = ({ className = "" }) => {
  const { pendingCount, status, refreshPendingCount } =
    usePendingFeedbackCount();

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div
      className={`
        relative
        rounded-2xl
        bg-white/[0.03]
        border border-white/10
        backdrop-blur-xl

        p-5
        shadow-[0_12px_30px_rgba(0,0,0,0.45)]
        transition-all duration-300
        hover:bg-white/[0.05] hover:border-purple-500/20

        ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Bell
                className={`w-5 h-5 ${
                  pendingCount > 0 && !hasError
                    ? "text-purple-400"
                    : "text-white/25"
                }`}
              />
            </div>

            {/* Status dot */}
            {pendingCount > 0 && !hasError && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-500" />
              </span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-white/85">
              Pending feedback
            </p>
            <p className="text-xs text-white/45">
              Feedback awaiting theming
            </p>
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            refreshPendingCount();
          }}
          disabled={isLoading}
          className="
            p-2 rounded-xl
            bg-white/5 border border-white/10
            text-white/40 hover:text-purple-400 hover:bg-white/10
            transition
            disabled:opacity-40 disabled:cursor-not-allowed
          "
          title="Refresh count"
          aria-label="Refresh pending feedback count"
        >
          <RefreshCw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Main content */}
      <div className="mt-6">
        {hasError ? (
          <div className="flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>Failed to load</span>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <span
              className={`
                text-4xl font-bold tracking-tight
                ${isLoading ? "text-white/20" : "text-white"}
              `}
            >
              {isLoading
                ? "--"
                : pendingCount.toString().padStart(2, "0")}
            </span>
            <span className="text-sm text-white/50 mb-1">
              items
            </span>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-xs text-white/35">
        Review or bulk-theme feedback to clear this queue.
      </div>

      {/* Loading pulse (non-intrusive) */}
      {isLoading && (
        <div className="absolute bottom-4 right-4">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default PendingFeedbackCountCard;
