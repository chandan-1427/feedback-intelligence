import React from "react";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

type SubmitButtonProps = {
  text: string;
  loadingText: string;
  successText: string;
  isLoading: boolean;
  success: boolean;
  disabled?: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  text,
  loadingText,
  successText,
  isLoading,
  success,
  disabled,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading || success}
      className={`
        group relative overflow-hidden w-full py-3.5 px-6
        transition-all duration-300 active:scale-[0.98]
        rounded-2xl font-poppins font-bold text-sm tracking-wide
        flex items-center justify-center gap-2
        
        /* Deep brand background with subtle border */
        ${success 
          ? 'bg-green-600 border-green-500/30' 
          : 'bg-[#5A0091] border-white/10'}
        text-white border shadow-2xl
        
        /* Interaction States */
        hover:brightness-110 hover:shadow-[0_0_20px_rgba(90,0,145,0.3)]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale
      `}
    >
      {/* --- The Shimmer Effect --- */}
      <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* --- Button Content --- */}
      <div className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
            <span className="font-work">{loadingText}</span>
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-4.5 h-4.5 animate-in zoom-in duration-300" />
            <span className="font-work">{successText}</span>
          </>
        ) : (
          <>
            <span>{text}</span>
            <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform duration-300" />
          </>
        )}
      </div>
    </button>
  );
};

export default SubmitButton;