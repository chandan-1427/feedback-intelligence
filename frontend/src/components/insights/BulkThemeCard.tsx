import React, { useMemo, useState } from "react";
import { Layers, Loader2, RotateCcw } from "lucide-react";
import { useBulkTheme } from "../../hooks/theme-clusters/useBulkTheme";

const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

const BulkThemeCard: React.FC = () => {
  const [limit, setLimit] = useState<number>(20);
  const { bulkTheme, isLoading, result, error } = useBulkTheme();

  const safeLimit = useMemo(() => clamp(Number(limit || 0), 1, 100), [limit]);

  const run = async () => {
    // ✅ always send a safe value
    await bulkTheme(safeLimit);
  };

  const presets = [10, 20, 50];

  const stats = useMemo(() => {
    const rows = result?.results ?? [];
    const ok = rows.filter((r) => r.ok).length;
    const failed = rows.length - ok;
    return { ok, failed, total: rows.length };
  }, [result]);

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-5 shadow-[0_14px_35px_rgba(0,0,0,0.45)] min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold font-poppins text-white/90">
            Bulk theming
          </h3>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            Theme feedback that hasn’t been analyzed yet.
          </p>
        </div>

        {/* Compact action */}
        <button
          onClick={run}
          disabled={isLoading}
          className="
            shrink-0 inline-flex items-center gap-2
            px-3 py-2 rounded-xl
            bg-white/5 border border-white/10
            text-xs font-semibold text-white/80
            hover:bg-white/10 hover:text-white
            transition active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running
            </>
          ) : (
            <>
              <Layers className="w-4 h-4" />
              Run
            </>
          )}
        </button>
      </div>

      {/* Controls */}
      <div className="rounded-xl bg-black/20 border border-white/5 p-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={100}
              value={limit}
              disabled={isLoading}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="
                w-full sm:w-28
                px-3 py-2 rounded-xl
                bg-white/5 border border-white/10
                text-white text-sm
                outline-none focus:border-[#5A0091] focus:ring-2 focus:ring-[#5A0091]/25
                disabled:opacity-60
              "
            />

            <span className="text-xs text-white/40">
              items (1–100)
            </span>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-2">
            {presets.map((n) => (
              <button
                key={n}
                type="button"
                disabled={isLoading}
                onClick={() => setLimit(n)}
                className="
                  px-3 py-2 rounded-xl
                  text-xs font-semibold
                  bg-white/5 border border-white/10
                  text-white/70 hover:text-white hover:bg-white/10
                  transition active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
                title={`Set limit to ${n}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Small hint */}
        <div className="mt-2 text-[11px] text-white/40 leading-relaxed">
          Tip: Start with <span className="text-white/60 font-semibold">20</span>{" "}
          to avoid rate limits and keep results clean.
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-4">
          {/* Summary row */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-white/65">
              <span className="text-white/85 font-semibold">
                {result.message}
              </span>
              <span className="text-white/35"> • processed </span>
              <span className="text-white/85 font-semibold">{result.total}</span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-semibold">
                {stats.ok} ok
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 font-semibold">
                {stats.failed} failed
              </span>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  inline-flex items-center gap-1.5
                  px-2.5 py-1 rounded-full
                  bg-white/5 border border-white/10
                  text-white/60 hover:text-white hover:bg-white/10
                  transition active:scale-[0.98]
                "
                title="Reset view"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>

          {/* List */}
          <div className="mt-3 space-y-2">
            <div className="text-xs text-white/50">
              Bulk theming completed.
              Refresh clusters to see updated themes.
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default BulkThemeCard;
