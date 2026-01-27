import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X, ArrowRight, Sparkles, Loader2 } from "lucide-react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState<"signup" | "signin" | null>(null);

  const navigate = useNavigate();

  const goTo = (path: string, btn: "signup" | "signin") => {
    setLoadingBtn(btn);

    setTimeout(() => {
      navigate(path);
      setIsOpen(false);
      setLoadingBtn(null);
    }, 250);
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <nav
        className="
          pointer-events-auto
          w-full max-w-5xl
          rounded-2xl
          bg-white/[0.03] backdrop-blur-xl
          border border-white/10
          shadow-[0_12px_30px_rgba(0,0,0,0.45)]
          overflow-hidden
          font-work
        "
      >
        {/* Top bar */}
        <div className="px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-3">
            {/* Brand */}
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 shrink-0 active:scale-95 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white/80" />
              </div>

              <div className="leading-tight">
                <div className="text-sm sm:text-base font-semibold font-poppins text-white/90">
                  Feedback<span className="text-[#A855F7]">Intel</span>
                </div>
                <div className="hidden sm:block text-[10px] text-white/35">
                  AI analytics
                </div>
              </div>
            </Link>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/signup")}
                className="
                  px-4 py-2 rounded-xl
                  text-sm font-medium
                  text-white/70 hover:text-white
                  hover:bg-white/5
                  transition active:scale-95
                "
              >
                Sign up
              </button>

              <button
                onClick={() => navigate("/signin")}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-xl
                  bg-white/5 border border-white/10
                  text-sm font-semibold text-white/85
                  hover:bg-white/10 hover:text-white
                  transition active:scale-95
                "
              >
                Sign in
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen((p) => !p)}
                className="
                  p-2 rounded-xl
                  bg-white/5 border border-white/10
                  text-white/70 hover:text-white hover:bg-white/10
                  transition
                "
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`
            md:hidden overflow-hidden border-t border-white/10
            transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 sm:px-6 py-4 space-y-2">
            {/* Sign up */}
            <button
              onClick={() => goTo("/signup", "signup")}
              disabled={loadingBtn !== null}
              className="
                w-full flex items-center justify-between
                px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-sm font-medium text-white/80
                hover:bg-white/10 hover:text-white
                transition active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              <span>{loadingBtn === "signup" ? "Opening..." : "Sign up"}</span>
              {loadingBtn === "signup" ? (
                <Loader2 className="w-4 h-4 animate-spin text-white/70" />
              ) : (
                <span className="text-white/30">→</span>
              )}
            </button>

            {/* Sign in */}
            <button
              onClick={() => goTo("/signin", "signin")}
              disabled={loadingBtn !== null}
              className="
                w-full inline-flex items-center justify-center gap-2
                px-4 py-3 rounded-xl
                bg-white/5 border border-white/10
                text-sm font-semibold text-white/85
                hover:bg-white/10 hover:text-white
                transition active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {loadingBtn === "signin" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
