import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import type { ThemeCluster } from "../../lib/types/clusters";
import ChartInfoTooltip from "./ChartInfoTooltip";

type Props = {
  clusters: ThemeCluster[];
  loading: boolean;
};

// Minimal palette (keep consistent with your UI)
const COLORS = [
  "#5A0091",
  "#7A00C5",
  "#A855F7",
  "#6366F1",
  "#3B82F6",
  "#22C55E",
];

type ChartRow = {
  name: string;
  value: number;
};

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

const ThemeAnalyticsChart: React.FC<Props> = ({ clusters, loading }) => {
  const { chartData, total } = useMemo(() => {
    if (!clusters || clusters.length === 0) {
      return { chartData: [] as ChartRow[], total: 0 };
    }

    const sorted = [...clusters].sort((a, b) => b.total - a.total);

    const top = sorted.slice(0, 5).map((c) => ({
      name: c.theme,
      value: Number(c.total) || 0,
    }));

    const rest = sorted.slice(5);
    const othersValue = rest.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    const data = othersValue > 0 ? [...top, { name: "Others", value: othersValue }] : top;

    const totalCount = data.reduce((acc, row) => acc + row.value, 0);

    return { chartData: data, total: totalCount };
  }, [clusters]);

  // Loading
  if (loading) {
    return (
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 md:p-5 min-h-[320px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/55 text-sm">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#5A0091] animate-spin" />
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  // Empty
  if (!loading && chartData.length === 0) {
    return (
      <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 md:p-5 min-h-[320px] flex items-center justify-center text-center">
        <div>
          <div className="mx-auto w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
            <PieIcon className="w-5 h-5" />
          </div>
          <p className="mt-3 text-sm font-semibold text-white/80">
            No themes yet
          </p>
          <p className="mt-1 text-xs text-white/45 max-w-[260px]">
            Run theming first to see the distribution.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-4 md:p-5 shadow-[0_14px_35px_rgba(0,0,0,0.45)] h-full flex flex-col min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
              <PieIcon className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white/90">
                Theme distribution
              </h3>
              <p className="text-xs text-white/45">
                Top themes by feedback count
              </p>
            </div>
          </div>
        </div>

        {/* Info tooltip */}
        <ChartInfoTooltip />
      </div>

      {/* Chart */}
      <div className="mt-4 w-full min-w-0">
        <ResponsiveContainer width="100%" aspect={1.1}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={3}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              isAnimationActive
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;

                const item = payload[0];
                const name = String(item.name ?? "");
                const value = Number(item.value ?? 0);

                const pct =
                  total > 0 ? Math.round((value / total) * 100) : 0;

                return (
                  <div className="rounded-xl border border-white/10 bg-[#0D0E0E] px-3 py-2 text-xs text-white/80 shadow-xl">
                    <div className="font-semibold text-white/90">{name}</div>
                    <div className="mt-1 text-white/60">
                      {formatNumber(value)} feedback • {pct}%
                    </div>
                  </div>
                );
              }}
            />

            <Legend
              verticalAlign="bottom"
              height={32}
              formatter={(value) => (
                <span className="text-[11px] text-white/55">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/45">
        <span>Total: <span className="text-white/75 font-semibold">{formatNumber(total)}</span></span>
        <span className="text-white/30">Top 5 + Others</span>
      </div>
    </div>
  );
};

export default ThemeAnalyticsChart;
