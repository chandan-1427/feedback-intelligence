import React from "react";
import { Bell, RefreshCw, AlertCircle } from "lucide-react";
import { usePendingFeedbackCount } from "../../hooks/feedbacks/usePendingFeedbackCount";

type Props = {
  className?: string;
};

const PendingFeedbackCountBadge: React.FC<Props> = ({ className = "" }) => {
  const { pendingCount, status, refreshPendingCount } =
    usePendingFeedbackCount();

  const isLoading = status === "loading";
  const hasError = status === "error";

  return (
    <div
      className={`
        relative group flex items-center gap-3 rounded-full
        bg-white/[0.03] border border-white/10 backdrop-blur-xl
        pl-2 pr-4 py-1.5 transition-all duration-500
        hover:bg-white/[0.06] hover:border-purple-500/20
        ${className}
      `}
    >
      {/* Icon with integrated Status Dot */}
      <div className="relative shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <Bell className={`w-4 h-4 ${pendingCount > 0 ? "text-purple-400" : "text-white/20"}`} />
        </div>
        
        {pendingCount > 0 && !hasError && (
          <span className="absolute top-0 right-0 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
        )}
      </div>

      {/* Primary Info: Simple and Clean */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          {hasError ? (
            <button
              onClick={(e) => { e.stopPropagation(); refreshPendingCount(); }}
              className="flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase tracking-widest"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Retry</span>
            </button>
          ) : (
            <>
              <span className={`text-sm font-bold font-work ${isLoading ? "text-white/20" : "text-white/90"}`}>
                {isLoading ? "--" : pendingCount.toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-wide">
                Pending
              </span>
            </>
          )}
        </div>
      </div>

      {/* Subtle Sync Trigger (Hidden on Mobile, Visible on Desktop Hover) */}
      <button 
        onClick={(e) => { e.stopPropagation(); refreshPendingCount(); }}
        disabled={isLoading}
        className="hidden md:flex ml-1 p-1 text-white/10 hover:text-purple-400 transition-colors"
      >
        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
      </button>

      {/* Layout Stabilizer for Loading */}
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
           <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default PendingFeedbackCountBadge;