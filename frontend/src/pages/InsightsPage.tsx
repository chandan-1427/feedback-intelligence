import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Sparkles, ChevronRight, Layers, FileText, Wand2 } from "lucide-react";

import { useMe } from "../hooks/auth/useMe";
import { useClusters } from "../hooks/theme-clusters/useClusters";
import { useSolutions } from "../hooks/solutions/useSolutions";
import { useSolutionDetails } from "../hooks/solutions/useSolutionDetails";

import BulkThemeCard from "../components/insights/BulkThemeCard";
import ThemeClustersCard from "../components/insights/ThemeClustersCard";
import ThemeClusterDetailsCard from "../components/insights/ThemeClusterDetailsCard";
import SolutionsListCard from "../components/insights/SolutionsListCard";
import SolutionDetailsCard from "../components/insights/SolutionDetailsCard";
import ThemeAnalyticsChart from "../components/insights/ThemeAnalyticsChart";

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { status } = useMe();

  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const clusters = useClusters();
  const solutions = useSolutions();
  const solutionDetails = useSolutionDetails();

  useEffect(() => {
    if (status === "unauthorized") navigate("/signin");
  }, [status, navigate]);

  const handleClusterSelect = (theme: string) => {
    setActiveTheme(theme);
    clusters.fetchThemeDetails(theme, 20);
    solutionDetails.fetchSolution(theme);
  };

  const handleSolutionSelect = (theme: string) => {
    setActiveTheme(theme);
    solutionDetails.fetchSolution(theme);
    clusters.fetchThemeDetails(theme, 20);
  };

  const currentFocusLabel = useMemo(() => {
    if (!activeTheme) return "No theme selected";
    return `Selected: ${activeTheme}`;
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
        {/* =========================
            HEADER
        ========================== */}
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              AI Insights
            </div>

            <h1 className="mt-4 text-2xl md:text-4xl font-bold font-poppins tracking-tight text-white/90">
              Insights
            </h1>

            <p className="mt-2 text-sm md:text-base text-white/50 max-w-2xl">
              Group feedback into themes and generate a clear solution plan you can act on.
            </p>

            <div className="mt-3 text-xs text-white/40">{currentFocusLabel}</div>
          </div>

          {/* Top navigation / steps */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="#bulk"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              1. Bulk
            </a>
            <a
              href="#clusters"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              2. Themes
            </a>
            <a
              href="#solutions"
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:text-white hover:bg-white/10 transition"
            >
              3. Solutions
            </a>
          </div>
        </header>

        {/* =========================
            QUICK MANUAL (FLOW)
        ========================== */}
        <section className="mt-7 rounded-2xl bg-white/[0.02] border border-white/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white/85">How this page works</p>
              <p className="text-xs text-white/45 mt-1">
                Go from raw feedback → theme cluster → saved solution.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 text-xs text-white/60">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <Layers className="w-4 h-4 text-white/35" />
                <span>Pick a theme</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
                <span>Read messages</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <Wand2 className="w-4 h-4 text-white/35" />
                <span>Generate a plan</span>
                <ChevronRight className="w-4 h-4 text-white/20" />
                <span>Auto saved</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <FileText className="w-4 h-4 text-white/35" />
                <span>Open anytime</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <div className="mt-9 space-y-10 min-w-0">
          {/* ========== SECTION 1: BULK + CHART ========== */}
          <section id="bulk" className="space-y-3 min-w-0">
            <div>
              <p className="text-sm font-semibold text-white/80">Step 1 — Bulk theme</p>
              <p className="text-xs text-white/45 mt-1">
                Run once to auto-theme feedback that is not analyzed yet.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 items-stretch">
              <div className="min-w-0">
                <BulkThemeCard />
              </div>

              <div className="min-w-0">
                <ThemeAnalyticsChart
                  clusters={clusters.clusters}
                  loading={clusters.loadingClusters}
                />
              </div>
            </div>
          </section>

          {/* ========== SECTION 2: CLUSTERS + DETAILS ========== */}
          <section id="clusters" className="space-y-3 min-w-0">
            <div>
              <p className="text-sm font-semibold text-white/80">Step 2 — Explore clusters</p>
              <p className="text-xs text-white/45 mt-1">
                Select a theme to preview the related feedback messages.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 items-start">
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

          {/* ========== SECTION 3: SOLUTIONS + DETAILS ========== */}
          <section id="solutions" className="space-y-3 min-w-0">
            <div>
              <p className="text-sm font-semibold text-white/80">
                Step 3 — Generate or open solutions
              </p>
              <p className="text-xs text-white/45 mt-1">
                Pick a saved plan or generate a new one for your theme.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0 items-start">
              <SolutionsListCard
                solutions={solutions.solutions}
                status={solutions.status}
                error={solutions.error}
                onRefresh={solutions.fetchSolutions}
                onSelectTheme={handleSolutionSelect}
              />

              <SolutionDetailsCard
                selectedTheme={activeTheme}
                solution={solutionDetails.solution}
                status={solutionDetails.status}
                error={solutionDetails.error}
                onReload={(theme) => {
                  solutionDetails.fetchSolution(theme);
                  solutions.fetchSolutions();
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
