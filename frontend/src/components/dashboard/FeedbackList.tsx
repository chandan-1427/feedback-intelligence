import React, { useMemo, useState } from "react";
import {
  Clock,
  RefreshCw,
  ChevronDown,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { FeedbackItem } from "../../lib/types/feedback";

type Props = {
  feedbacks: FeedbackItem[];
  status: "idle" | "loading" | "error" | "success";
  error?: string;
  page: number;
  onPrev: () => void;
  onNext: () => void;
  onRefresh: () => void;
  onRemoveItem: (id: string) => void; // kept for future actions
};

const FeedbackList: React.FC<Props> = ({
  feedbacks,
  status,
  error,
  page,
  onPrev,
  onNext,
  onRefresh,
}) => {
  // collapsed by default (cleaner dashboard)
  const [isExpanded, setIsExpanded] = useState(false);

  // copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isLoading = status === "loading";
  const isError = status === "error";

  const canGoPrev = page > 1 && !isLoading;
  const canGoNext = !isLoading && feedbacks.length > 0;

  const headerSubtitle = useMemo(() => {
    if (isLoading) return "Loading feedback...";
    if (isError) return "Failed to load";
    if (feedbacks.length === 0) return "No feedback yet";
    return `${feedbacks.length} items • Page ${page}`;
  }, [isLoading, isError, feedbacks.length, page]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 900);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden min-w-0">
      {/* HEADER */}
      <div className="px-5 py-4 md:px-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left toggle */}
          <button
            type="button"
            onClick={() => setIsExpanded((p) => !p)}
            className="flex items-center gap-3 text-left min-w-0"
            aria-expanded={isExpanded}
          >
            <div
              className={`
                w-9 h-9 rounded-xl
                bg-white/5 border border-white/10
                flex items-center justify-center
                text-white/70
              `}
            >
              <MessageSquare className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white/90">
                Raw feedback
              </h3>
              <p className="text-xs text-white/40 truncate">{headerSubtitle}</p>
            </div>

            <ChevronDown
              className={`
                w-4 h-4 text-white/35 shrink-0
                transition-transform duration-300
                ${isExpanded ? "rotate-180" : "rotate-0"}
              `}
            />
          </button>

          {/* Right actions */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="
              p-2 rounded-xl
              bg-white/5 border border-white/10
              text-white/50 hover:text-white hover:bg-white/10
              transition-all active:scale-95
              disabled:opacity-40 disabled:cursor-not-allowed
            "
            title="Refresh"
            aria-label="Refresh feedback"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* COLLAPSIBLE */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 md:px-6 md:pb-6 space-y-4">
            <div className="h-px bg-white/10" />

            {/* Error */}
            {isError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-200">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p className="leading-relaxed">
                  {error || "Something went wrong while fetching feedback."}
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
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
            {!isLoading && !isError && feedbacks.length === 0 && (
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4 text-sm text-white/55">
                No feedback submitted yet.
              </div>
            )}

            {/* List */}
            {!isLoading && feedbacks.length > 0 && (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1 custom-scrollbar">
                {feedbacks.map((f) => (
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
                      <p className="text-sm text-white/80 leading-relaxed break-words min-w-0 flex-1">
                        {f.message}
                      </p>

                      <button
                        type="button"
                        onClick={() => handleCopy(f.id, f.message)}
                        className="
                          shrink-0
                          p-2 rounded-lg
                          bg-transparent
                          border border-white/10
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
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-white/35">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(f.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && feedbacks.length > 0 && (
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onPrev}
                  disabled={!canGoPrev}
                  className="
                    inline-flex items-center gap-2
                    px-3 py-2 rounded-xl
                    bg-white/5 border border-white/10
                    text-xs font-semibold text-white/70
                    hover:bg-white/10 hover:text-white
                    transition-all active:scale-95
                    disabled:opacity-30 disabled:cursor-not-allowed
                  "
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>

                <span className="text-xs text-white/35">
                  Page <span className="text-white/70 font-semibold">{page}</span>
                </span>

                <button
                  onClick={onNext}
                  disabled={!canGoNext}
                  className="
                    inline-flex items-center gap-2
                    px-3 py-2 rounded-xl
                    bg-white/5 border border-white/10
                    text-xs font-semibold text-white/70
                    hover:bg-white/10 hover:text-white
                    transition-all active:scale-95
                    disabled:opacity-30 disabled:cursor-not-allowed
                  "
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Small hint */}
            <p className="text-[11px] text-white/30 text-center">
              These messages are used for theming and clustering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
