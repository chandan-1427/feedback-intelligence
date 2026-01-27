import React, { useMemo, useState } from "react";
import { RefreshCw, FileText, Search, ArrowUpDown } from "lucide-react";

type SolutionRow = {
  theme: string;
  total_feedbacks: number;
  solution_summary: string;
  priority: string;
  confidence: number;
  updated_at: string;
};

type Props = {
  solutions: SolutionRow[];
  status: "idle" | "loading" | "error" | "success";
  error?: string;
  onRefresh: () => void;
  onSelectTheme: (theme: string) => void;
};

type SortBy = "recent" | "confidence" | "feedbacks";

const SolutionsListCard: React.FC<Props> = ({
  solutions,
  status,
  error,
  onRefresh,
  onSelectTheme,
}) => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const isLoading = status === "loading";
  const isError = status === "error";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const list = solutions.filter((s) => {
      const matchesQuery =
        !q ||
        s.theme.toLowerCase().includes(q) ||
        s.solution_summary.toLowerCase().includes(q);

      const p = (s.priority || "").toLowerCase();
      const matchesPriority =
        priorityFilter === "all" ? true : p === priorityFilter;

      return matchesQuery && matchesPriority;
    });

    const sorted = [...list].sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
      }

      if (sortBy === "confidence") {
        return Number(b.confidence) - Number(a.confidence);
      }

      return Number(b.total_feedbacks) - Number(a.total_feedbacks);
    });

    return sorted;
  }, [solutions, query, sortBy, priorityFilter]);

  const formatConfidence = (c: number) => {
    if (!Number.isFinite(c)) return "--";
    return `${Math.round(c * 100)}%`;
  };

  const priorityBadge = (priority: string) => {
    const p = (priority || "").toLowerCase();

    if (p === "high") {
      return "bg-red-500/10 border-red-500/20 text-red-300";
    }
    if (p === "medium") {
      return "bg-amber-500/10 border-amber-500/20 text-amber-300";
    }
    if (p === "low") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-300";
    }
    return "bg-white/5 border-white/10 text-white/60";
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold font-poppins text-white/90">
              Saved solutions
            </h3>
            <p className="text-[12px] text-white/45">
              Pick a theme to view the saved plan.
            </p>
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
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
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Controls */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="flex-1 min-w-0 rounded-xl bg-black/20 border border-white/5 px-3 py-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-white/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search theme or summary..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder-white/30"
            />
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as typeof priorityFilter)
            }
            className="
              w-full sm:w-36
              rounded-xl bg-black/20 border border-white/5
              px-3 py-2 text-sm text-white/80
              outline-none
            "
          >
            <option value="all">All priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Sort */}
          <button
            type="button"
            onClick={() => {
              setSortBy((prev) =>
                prev === "recent"
                  ? "confidence"
                  : prev === "confidence"
                  ? "feedbacks"
                  : "recent"
              );
            }}
            className="
              w-full sm:w-40
              inline-flex items-center justify-center gap-2
              rounded-xl bg-white/5 border border-white/10
              px-3 py-2 text-sm text-white/70
              hover:bg-white/10 hover:text-white
              transition active:scale-95
            "
            title="Change sorting"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortBy === "recent"
              ? "Recent"
              : sortBy === "confidence"
              ? "Confidence"
              : "Feedbacks"}
          </button>
        </div>

        <div className="mt-4 h-px bg-white/10" />
      </div>

      {/* Body */}
      <div className="px-5 pb-5">
        {/* Loading */}
        {isLoading && (
          <div className="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3"
              >
                <div className="h-3 w-1/2 bg-white/10 rounded mb-2" />
                <div className="h-3 w-4/5 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            {error || "Failed to load solutions."}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && solutions.length === 0 && (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4">
            <p className="text-sm text-white/70 font-semibold">
              No saved solutions yet
            </p>
            <p className="text-xs text-white/45 mt-1">
              Generate a solution from a theme cluster and it will appear here.
            </p>
          </div>
        )}

        {/* No matches */}
        {!isLoading && !isError && solutions.length > 0 && filtered.length === 0 && (
          <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4 text-sm text-white/55">
            No results found for{" "}
            <span className="text-white/75 font-semibold">
              "{query.trim()}"
            </span>
          </div>
        )}

        {/* List */}
        {!isLoading && !isError && filtered.length > 0 && (
          <div className="space-y-2 max-h-[420px] overflow-auto pr-1 custom-scrollbar min-w-0">
            {filtered.map((s) => (
              <button
                key={s.theme}
                onClick={() => onSelectTheme(s.theme)}
                className="
                  w-full text-left min-w-0
                  rounded-xl bg-white/[0.01] border border-white/[0.06]
                  px-4 py-3
                  hover:bg-white/[0.02] hover:border-[#5A0091]/35
                  transition active:scale-[0.99]
                "
              >
                <div className="flex items-start justify-between gap-3 min-w-0">
                  {/* Left */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-white/45 shrink-0" />
                      <p className="text-sm font-semibold text-white/85 truncate">
                        {s.theme}
                      </p>
                    </div>

                    <p className="text-xs text-white/45 mt-1 line-clamp-2 leading-relaxed break-words">
                      {s.solution_summary}
                    </p>

                    <p className="text-[11px] text-white/30 mt-2">
                      Updated {new Date(s.updated_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right badges */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/65">
                      {s.total_feedbacks}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold uppercase tracking-wide ${priorityBadge(
                          s.priority
                        )}`}
                      >
                        {s.priority || "N/A"}
                      </span>

                      <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/65 font-semibold">
                        {formatConfidence(Number(s.confidence))}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SolutionsListCard;
