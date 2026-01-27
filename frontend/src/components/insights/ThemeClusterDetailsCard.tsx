import React, { useMemo, useState } from "react";
import {
  Clock,
  ChevronDown,
  ListFilter,
  AlertCircle,
  Search,
  Copy,
  Check,
} from "lucide-react";
import type { ClusterFeedbackItem } from "../../lib/types/clusters";

type Props = {
  theme: string | null;
  total: number;
  feedbacks: ClusterFeedbackItem[];
  loading: boolean;
  error?: string;
};

const ThemeClusterDetailsCard: React.FC<Props> = ({
  theme,
  total,
  feedbacks,
  loading,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasTheme = Boolean(theme);
  const isLoading = loading;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return feedbacks;
    return feedbacks.filter((f) => f.message.toLowerCase().includes(q));
  }, [feedbacks, query]);

  const copyText = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // clipboard can fail in some browsers/permissions
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <button
        type="button"
        disabled={!hasTheme}
        onClick={() => hasTheme && setIsExpanded((p) => !p)}
        className={`
          w-full flex items-center justify-between gap-4
          px-5 py-4 text-left
          transition
          ${hasTheme ? "hover:bg-white/[0.02] cursor-pointer" : "cursor-default"}
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`
              p-2 rounded-xl bg-white/5 border border-white/10 text-white/60
              transition-transform
              ${hasTheme && isExpanded ? "rotate-0" : "-rotate-90"}
            `}
          >
            <ListFilter className="w-4 h-4" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold font-poppins text-white/90">
              Theme details
            </h3>

            <p className="text-[11px] text-white/50 truncate">
              {hasTheme ? (
                <>
                  <span className="text-white/75 font-semibold">{theme}</span>
                  <span className="text-white/20"> • </span>
                  {total} messages
                </>
              ) : (
                "Select a theme to view messages"
              )}
            </p>
          </div>
        </div>

        {hasTheme && (
          <ChevronDown
            className={`w-4 h-4 text-white/35 transition-transform ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        )}
      </button>

      {/* Collapsible content */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${isExpanded && hasTheme ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-4 min-w-0">
            <div className="h-px bg-white/10" />

            {/* Top controls */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0 rounded-xl bg-black/20 border border-white/5 px-3 py-2 flex items-center gap-2">
                <Search className="w-4 h-4 text-white/35" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search messages..."
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30"
                />
              </div>

              <div className="text-[11px] text-white/40 shrink-0">
                Showing <span className="text-white/70">{filtered.length}</span>
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4"
                  >
                    <div className="h-3 w-4/5 bg-white/10 rounded mb-2" />
                    <div className="h-3 w-2/5 bg-white/10 rounded" />
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && error && (
              <div className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !error && feedbacks.length === 0 && (
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4">
                <p className="text-sm text-white/70 font-semibold">
                  No messages found
                </p>
                <p className="text-xs text-white/45 mt-1">
                  This theme has no feedback yet.
                </p>
              </div>
            )}

            {/* List */}
            {!isLoading && !error && feedbacks.length > 0 && (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1 custom-scrollbar min-w-0">
                {filtered.length === 0 ? (
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4 text-sm text-white/55">
                    No results for{" "}
                    <span className="text-white/75 font-semibold">
                      "{query.trim()}"
                    </span>
                  </div>
                ) : (
                  filtered.map((f) => {
                    const conf =
                      typeof f.confidence === "number"
                        ? f.confidence
                        : typeof f.confidence === "string"
                        ? Number(f.confidence)
                        : null;

                    const pct =
                      conf !== null && Number.isFinite(conf)
                        ? Math.round(conf * 100)
                        : null;

                    const sentiment = (f.sentiment ?? "neutral").toLowerCase();

                    return (
                      <div
                        key={f.id}
                        className="
                          rounded-xl bg-white/[0.01] border border-white/[0.06]
                          px-4 py-3 hover:bg-white/[0.02] transition
                          min-w-0
                        "
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm text-white/80 leading-relaxed break-words min-w-0 flex-1">
                            {f.message}
                          </p>

                          <button
                            type="button"
                            onClick={() => copyText(f.id, f.message)}
                            className="
                              shrink-0 p-2 rounded-lg
                              bg-white/5 border border-white/10
                              text-white/55 hover:text-white hover:bg-white/10
                              transition active:scale-95
                            "
                            title="Copy message"
                          >
                            {copiedId === f.id ? (
                              <Check className="w-4 h-4 text-emerald-300" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(f.created_at).toLocaleDateString()}
                          </span>

                          <span className="text-white/20">•</span>

                          <span
                            className={`
                              px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wide
                              ${
                                sentiment === "positive"
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                  : sentiment === "negative"
                                  ? "bg-red-500/10 border-red-500/20 text-red-300"
                                  : "bg-white/5 border-white/10 text-white/60"
                              }
                            `}
                          >
                            {sentiment}
                          </span>

                          {pct !== null && (
                            <>
                              <span className="text-white/20">•</span>
                              <span className="text-white/45">
                                {pct}% match
                              </span>
                            </>
                          )}
                        </div>

                        {f.summary && (
                          <div className="mt-3 rounded-lg bg-black/20 border border-white/5 px-3 py-2">
                            <p className="text-[11px] text-white/40 font-semibold">
                              Summary
                            </p>
                            <p className="text-xs text-white/60 mt-1 leading-relaxed">
                              {f.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeClusterDetailsCard;
