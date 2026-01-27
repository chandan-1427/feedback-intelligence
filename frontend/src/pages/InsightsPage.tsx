import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RefreshCw,
  Sparkles,
  ChevronRight,
  Layers,
  FileText,
} from "lucide-react";

import { useMe } from "../hooks/auth/useMe";
import { useClusters } from "../hooks/theme-clusters/useClusters";

import BulkThemeCard from "../components/insights/BulkThemeCard";
import ThemeClustersCard from "../components/insights/ThemeClustersCard";
import ThemeClusterDetailsCard from "../components/insights/ThemeClusterDetailsCard";
import ThemeAnalyticsChart from "../components/insights/ThemeAnalyticsChart";

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { status } = useMe();

  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const clusters = useClusters();

  useEffect(() => {
    if (status === "unauthorized") navigate("/signin");
  }, [status, navigate]);

  const handleClusterSelect = (theme: string) => {
    setActiveTheme(theme);
    clusters.fetchThemeDetails(theme, 20);
  };

  const currentFocusLabel = useMemo(() => {
    if (!activeTheme) return "No theme selected";
    return `Selected theme: ${activeTheme}`;
  }, [activeTheme]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-[#0D0E0E] text-white flex items-center justify-center font-work">
        <div className="flex items-center gap-3 text-white/70">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading Insights...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") return null;

  return (
    <div className="min-h-screen pt-20 bg-[#0D0E0E] font-work text-white selection:bg-[#5A0091]/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        {/* ================= HEADER ================= */}
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              AI Insights
            </div>

            <h1 className="mt-4 text-2xl md:text-4xl font-bold font-poppins text-white/90">
              Insights
            </h1>

            <p className="mt-2 text-sm md:text-base text-white/50 max-w-2xl">
              Analyze feedback, group it into themes, and understand what matters.
            </p>

            <div className="mt-3 text-xs text-white/40">
              {currentFocusLabel}
            </div>
          </div>

          {/* Step nav */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#bulk"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10"
            >
              1. Bulk
            </a>
            <a
              href="#clusters"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10"
            >
              2. Themes
            </a>
          </div>
        </header>

        {/* ================= QUICK FLOW ================= */}
        <section className="mt-7 rounded-2xl bg-white/[0.02] border border-white/10 p-4 sm:p-5">
          <p className="text-sm font-semibold text-white/85">
            How this page works
          </p>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <Layers className="w-4 h-4 text-white/35" />
              Pick a theme
              <ChevronRight className="w-4 h-4 text-white/20" />
              Read feedback
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
              <FileText className="w-4 h-4 text-white/35" />
              Understand patterns
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="mt-9 space-y-10">
          {/* BULK */}
          <section id="bulk" className="space-y-3">
            <p className="text-sm font-semibold text-white/80">
              Step 1 — Bulk theme
            </p>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
              <BulkThemeCard />

              <div className="xl:sticky xl:top-28">
                <ThemeAnalyticsChart
                  clusters={clusters.clusters}
                  loading={clusters.loadingClusters}
                />
              </div>
            </div>

          </section>

          {/* CLUSTERS */}
          <section id="clusters" className="space-y-3">
            <p className="text-sm font-semibold text-white/80">
              Step 2 — Explore themes
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ThemeClustersCard
                clusters={clusters.clusters}
                loading={clusters.loadingClusters}
                error={clusters.errorClusters}
                onRefresh={clusters.fetchClusters}
                onSelectTheme={handleClusterSelect}
              />

              <ThemeClusterDetailsCard
                theme={clusters.selectedTheme}
                total={clusters.themeTotal}
                feedbacks={clusters.themeFeedbacks}
                loading={clusters.loadingTheme}
                error={clusters.errorTheme}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
