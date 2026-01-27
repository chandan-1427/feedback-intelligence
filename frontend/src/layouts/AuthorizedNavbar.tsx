import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  BarChart3,
  LogOut,
  Loader2,
  Menu,
  X,
  UserCog,
} from "lucide-react";
import { useLogout } from "../hooks/auth/useLogout";

const AuthorizedNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isLoading } = useLogout();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    const ok = await logout();
    if (ok) {
      navigate("/signin");
      setIsOpen(false);
    }
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
        "
      >
        {/* Top bar */}
        <div className="px-4 sm:px-6">
          <div className="h-14 flex items-center justify-between gap-3">
            {/* Brand */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 shrink-0 active:scale-95 transition"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white/80" />
              </div>

              <div className="leading-tight">
                <div className="text-sm font-semibold font-poppins text-white/90">
                  Feedback<span className="text-[#A855F7]">Intel</span>
                </div>
                <div className="hidden sm:block text-[10px] text-white/35">
                  Authorized
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1.5">
              <DesktopNavLink
                to="/user-manual"
                active={isActive("/user-manual")}
                icon={<UserCog className="w-4 h-4" />}
                label="User Manual"
              />
              <DesktopNavLink
                to="/dashboard"
                active={isActive("/dashboard")}
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Dashboard"
              />
              <DesktopNavLink
                to="/insights"
                active={isActive("/insights")}
                icon={<BarChart3 className="w-4 h-4" />}
                label="Insights"
              />

              <div className="w-px h-5 bg-white/10 mx-2" />

              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-xl
                  bg-white/5 border border-white/10
                  text-sm font-semibold text-white/80
                  hover:bg-white/10 hover:text-white
                  transition active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                Logout
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
            ${isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 sm:px-6 py-4 space-y-2">
            <MobileMenuButton
              onClick={() => handleNavigation("/user-manual")}
              active={isActive("/user-manual")}
              icon={<UserCog className="w-4 h-4" />}
              label="User Manual"
            />
            
            <MobileMenuButton
              onClick={() => handleNavigation("/dashboard")}
              active={isActive("/dashboard")}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="Dashboard"
            />
            
            <MobileMenuButton
              onClick={() => handleNavigation("/insights")}
              active={isActive("/insights")}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Insights"
            />

            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="
                w-full inline-flex items-center justify-center gap-2
                px-4 py-2.5 rounded-xl
                bg-red-500/10 border border-red-500/20
                text-red-300 text-sm font-semibold
                hover:bg-red-500/15
                transition active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

/* ---------- SUB COMPONENTS ---------- */

const DesktopNavLink = ({
  to,
  active,
  icon,
  label,
}: {
  to: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) => (
  <Link
    to={to}
    className={`
      inline-flex items-center gap-2
      px-4 py-2 rounded-xl
      text-sm font-medium
      transition active:scale-95
      ${active
        ? "bg-white/10 border border-white/15 text-white"
        : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"}
    `}
  >
    {icon}
    {label}
  </Link>
);

const MobileMenuButton = ({
  onClick,
  active,
  icon,
  label,
}: {
  onClick: () => void;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between
      px-4 py-3 rounded-xl
      text-sm font-medium
      transition active:scale-[0.98]
      ${active
        ? "bg-white/10 border border-white/15 text-white"
        : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"}
    `}
  >
    <div className="flex items-center gap-2.5">
      {icon}
      <span>{label}</span>
    </div>

    {active && <div className="w-2 h-2 rounded-full bg-[#A855F7]" />}
  </button>
);

export default AuthorizedNavbar;
