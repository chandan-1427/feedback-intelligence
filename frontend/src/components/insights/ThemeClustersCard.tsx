import React, { useMemo, useState } from "react";
import { Layers, RefreshCw, Search, AlertCircle } from "lucide-react";
import type { ThemeCluster } from "../../lib/types/clusters";

type Props = {
  clusters: ThemeCluster[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  onSelectTheme: (theme: string) => void;

  /** optional (recommended) */
  selectedTheme?: string | null;
};

const ThemeClustersCard: React.FC<Props> = ({
  clusters,
  loading,
  error,
  onRefresh,
  onSelectTheme,
  selectedTheme = null,
}) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clusters;

    return clusters.filter((c) => c.theme.toLowerCase().includes(q));
  }, [clusters, query]);

  const totalClusters = clusters.length;

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-5 shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold font-poppins text-white/90">
            Theme clusters
          </h3>
          <p className="text-xs text-white/50 mt-1">
            Pick a theme to view solutions.
          </p>
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="
            shrink-0 inline-flex items-center gap-2
            px-3 py-2 rounded-xl
            bg-white/5 border border-white/10
            text-xs font-semibold text-white/75
            hover:bg-white/10 hover:text-white
            transition active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Refresh clusters"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div className="mt-4 rounded-xl bg-black/20 border border-white/5 px-3 py-2 flex items-center gap-2">
        <Search className="w-4 h-4 text-white/35" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search themes (${totalClusters})`}
          className="
            w-full bg-transparent outline-none
            text-sm text-white placeholder-white/30
          "
        />
      </div>

      {/* States */}
      {error && (
        <div className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-4 space-y-2 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-3 py-3"
            >
              <div className="h-3 w-1/2 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && !error && clusters.length === 0 && (
        <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-4">
          <p className="text-sm text-white/70 font-semibold">
            No clusters yet
          </p>
          <p className="text-xs text-white/45 mt-1">
            Run bulk theming first to generate theme clusters.
          </p>
        </div>
      )}

      {/* List */}
      {!loading && !error && clusters.length > 0 && (
        <div className="mt-4 space-y-2 max-h-[360px] overflow-auto pr-1 custom-scrollbar min-w-0">
          {filtered.length === 0 ? (
            <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3 text-sm text-white/55">
              No themes match{" "}
              <span className="text-white/80 font-semibold">
                "{query.trim()}"
              </span>
            </div>
          ) : (
            filtered.map((c) => {
              const active = selectedTheme === c.theme;

              return (
                <button
                  key={c.theme}
                  onClick={() => onSelectTheme(c.theme)}
                  className={`
                    w-full text-left
                    rounded-xl px-3 py-3
                    border transition-all active:scale-[0.99]
                    ${
                      active
                        ? "bg-[#5A0091]/15 border-[#5A0091]/30"
                        : "bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/10"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Layers className="w-4 h-4 text-white/40 shrink-0" />
                      <span className="text-sm font-semibold text-white/85 truncate">
                        {c.theme}
                      </span>
                    </div>

                    <span
                      className="
                        shrink-0
                        text-[11px] font-semibold
                        px-2.5 py-1 rounded-full
                        bg-white/5 border border-white/10
                        text-white/65
                      "
                      title="Feedback count"
                    >
                      {c.total}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Footer hint */}
      {!loading && !error && clusters.length > 0 && (
        <div className="mt-3 text-[11px] text-white/35">
          Showing <span className="text-white/60">{filtered.length}</span> of{" "}
          <span className="text-white/60">{clusters.length}</span> themes
        </div>
      )}
    </div>
  );
};

export default ThemeClustersCard;
