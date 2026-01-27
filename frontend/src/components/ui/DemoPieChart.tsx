import React from "react";

export const DemoPieChart: React.FC = () => {
  return (
    <div className="mt-6 flex items-center gap-5">
      {/* Pie */}
      <svg
        width="96"
        height="96"
        viewBox="0 0 36 36"
        className="shrink-0"
        aria-hidden
      >
        {/* Base track */}
        <circle
          cx="18"
          cy="18"
          r="15.9155"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3.5"
        />

        {/* Rotate so chart starts at top */}
        <g transform="rotate(-90 18 18)">
          {/* Performance – 45% */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#A855F7"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="45 55"
            strokeDashoffset="0"
          />

          {/* UI / UX – 30% */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#5A0091"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="30 70"
            strokeDashoffset="-45"
          />

          {/* Bugs – 25% */}
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray="25 75"
            strokeDashoffset="-75"
          />
        </g>
      </svg>

      {/* Legend */}
      <div className="text-xs text-white/70 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
          <span>Performance</span>
          <span className="text-white/40">45%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#5A0091]" />
          <span>UI / UX</span>
          <span className="text-white/40">30%</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
          <span>Bugs</span>
          <span className="text-white/40">25%</span>
        </div>
      </div>
    </div>
  );
};
