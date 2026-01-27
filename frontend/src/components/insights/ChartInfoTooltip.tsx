import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

const ChartInfoTooltip = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside tap (mobile-friendly)
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative group shrink-0"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="About this chart"
        className="
          p-2 rounded-xl
          bg-white/5 border border-white/10
          text-white/40
          hover:text-white hover:bg-white/10
          transition
        "
      >
        <Info className="w-4 h-4" />
      </button>

      {/* Tooltip */}
      <div
        className={`
          pointer-events-none
          absolute right-0 mt-2 w-56
          rounded-xl border border-white/10
          bg-[#0D0E0E] px-3 py-2
          text-[11px] text-white/60
          shadow-xl

          transition-all duration-200
          ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}
          group-hover:opacity-100
          group-hover:translate-y-0
        `}
      >
        Shows how feedback is split across themes.
      </div>
    </div>
  );
};

export default ChartInfoTooltip;
