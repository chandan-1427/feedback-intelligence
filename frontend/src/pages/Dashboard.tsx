import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, RefreshCw, ChevronDown, BarChart3 } from "lucide-react";

import { useMe } from "../hooks/auth/useMe";
import { useFeedbackStats } from "../hooks/feedbacks/useFeedbackStats";
import { useFeedbacks } from "../hooks/feedbacks/useFeedbacks";

// ✅ NEW hooks
import { usePendingFeedbacks } from "../hooks/feedbacks/usePendingFeedbacks";
import { usePendingFeedbackCount } from "../hooks/feedbacks/usePendingFeedbackCount";

// ✅ NEW components
import PendingFeedbackCountBadge from "../components/dashboard/PendingFeedbackCountBadge";
import PendingFeedbackListCard from "../components/dashboard/PendingFeedbackListCard";

import FeedbackComposer from "../components/dashboard/FeedbackComposer";
import FeedbackList from "../components/dashboard/FeedbackList";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, status } = useMe();
  const [isStatsOpen, setIsStatsOpen] = useState(true);
  const stats = useFeedbackStats();
  const feedbacks = useFeedbacks(10);

  // ✅ pending feedback section
  const pending = usePendingFeedbacks(10);
  const pendingCount = usePendingFeedbackCount();

  useEffect(() => {
    if (status === "unauthorized") navigate("/signin");
  }, [status, navigate]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-[#0D0E0E] text-white flex items-center justify-center font-work">
        <div className="flex items-center gap-3 text-white/70">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") return null;

  const refreshAll = async () => {
    await Promise.all([
      stats.fetchStats(),
      feedbacks.refresh(),
      pending.refresh(),
      pendingCount.refreshPendingCount(),
    ]);
  };

  return (
    <div className="min-h-screen pt-20 bg-[#0D0E0E] font-work text-white selection:bg-[#5A0091]/30">
      {/* ===========================
          HEADER
      ============================ */}
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          {/* Left */}
          <div className="flex flex-col gap-5 min-w-0">
            <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/70 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
              <span className="uppercase tracking-widest text-[10px]">
                Dashboard
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-lg md:text-3xl font-bold font-poppins text-white/90 tracking-wide">
                Overview
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/50 font-work">
                <span className="font-bold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded-md border border-indigo-500/10">
                  {user?.username}
                </span>

                <span className="hidden sm:inline text-white/10">/</span>

                <span className="truncate max-w-[220px] sm:max-w-none text-white/60">
                  {user?.email}
                </span>

                <span className="hidden lg:inline text-white/10">•</span>

                <span className="w-full lg:w-auto text-white/30 italic text-xs md:text-sm">
                  Architecting feedback, themes, and solutions
                </span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={refreshAll}
              className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-xl
                bg-white/5 border border-white/10
                text-sm font-semibold text-white/80
                hover:bg-white/10 hover:text-white
                transition-all active:scale-[0.98]
              "
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* ===========================
          STATS SECTION
      ============================ */}
<section className="max-w-6xl mx-auto px-6 py-4">
  <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md overflow-hidden">
    {/* Header / Trigger */}
    <button
      onClick={() => setIsStatsOpen(!isStatsOpen)}
      className="
        w-full flex items-center justify-between
        px-5 py-4 md:px-6
        hover:bg-white/[0.03] transition-colors
      "
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-white/70" />
        </div>

        <div className="text-left">
          <h3 className="text-sm font-semibold text-white/90">
            Stats overview
          </h3>
          <p className="text-xs text-white/40">
            Feedback in your database
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Small preview when closed */}
        {!isStatsOpen && (
          <div className="hidden md:flex items-center gap-3 text-xs text-white/50">
            <span>
              Total <span className="text-white/80 font-semibold">{stats.total}</span>
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span>
              Today <span className="text-white/80 font-semibold">+{stats.today}</span>
            </span>
          </div>
        )}

        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform duration-300 ${
            isStatsOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>
    </button>

    {/* Collapsible content */}
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isStatsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <div className="h-px bg-white/10 mb-5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total feedback */}
            <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4">
              <p className="text-[11px] text-white/40 font-medium">
                Total feedback
              </p>

              <p className="mt-2 text-2xl font-semibold text-white/90">
                {stats.status === "loading" ? "..." : stats.total.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-white/35">
                All feedback stored so far
              </p>
            </div>

            {/* Today */}
            <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4">
              <p className="text-[11px] text-white/40 font-medium">
                Added today
              </p>

              <p className="mt-2 text-2xl font-semibold text-white/90">
                {stats.status === "loading" ? "..." : `+${stats.today}`}
              </p>

              <p className="mt-1 text-xs text-white/35">
                New feedback submitted today
              </p>
            </div>

            {/* Pending badge (keep as-is) */}
            <div className="min-w-0">
              <PendingFeedbackCountBadge className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* ===========================
          MAIN CONTENT
      ============================ */}
      <main className="max-w-6xl mx-auto px-6 mt-8 pb-20 space-y-6">
        {/* ✅ SECTION 1: COMPOSER (FULL WIDTH) */}
        <section className="min-w-0">
          <FeedbackComposer
            onSuccess={async () => {
              await Promise.all([
                stats.fetchStats(),
                feedbacks.fetchFeedbacks(1),
                pending.refresh(),
                pendingCount.refreshPendingCount(),
              ]);
            }}
          />
        </section>

        {/* ✅ SECTION 2: LISTS (COLUMN LAYOUT) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
          {/* LEFT: Pending */}
          <div className="min-w-0">
            <PendingFeedbackListCard limit={10} />
          </div>

          {/* RIGHT: Raw feedback list */}
          <div className="min-w-0">
            <FeedbackList
              feedbacks={feedbacks.feedbacks}
              status={feedbacks.status}
              error={feedbacks.error}
              page={feedbacks.page}
              onPrev={feedbacks.prevPage}
              onNext={feedbacks.nextPage}
              onRefresh={feedbacks.refresh}
              onRemoveItem={(id) => feedbacks.removeFeedback(id)}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
