import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Github, Linkedin, X } from "lucide-react";

interface SocialLinks {
  github: string;
  linkedin: string;
  x: string;
}

const SOCIALS: SocialLinks = {
  github: "https://github.com/chandan-1427",
  linkedin: "https://www.linkedin.com/in/chandan-dakka-805068360/",
  x: "https://x.com/chandan_1427",
};

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D0E0E] px-4 pt-10 pb-8">
      <div className="max-w-6xl mx-auto">
        <div
          className="
            relative overflow-hidden rounded-2xl
            bg-white/[0.03] backdrop-blur-xl
            border border-white/10
            shadow-[0_12px_30px_rgba(0,0,0,0.45)]
          "
        >
          {/* subtle ambient glow (smaller + less aggressive) */}
          <div className="pointer-events-none absolute -top-16 -left-16 w-40 h-40 bg-[#5A0091]/20 blur-[70px] rounded-full" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 w-40 h-40 bg-[#7A00C5]/15 blur-[80px] rounded-full" />

          <div className="relative px-5 sm:px-6 py-7">
            {/* Top */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Brand */}
              <div className="min-w-0 max-w-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="leading-tight">
                    <div className="text-sm sm:text-base font-semibold font-poppins text-white/90">
                      Feedback<span className="text-[#A855F7]">Intel</span>
                    </div>
                    <div className="text-[10px] text-white/35">AI analytics</div>
                  </div>
                </div>

                <p className="mt-3 text-sm text-white/55 leading-relaxed">
                  Turn feedback into insights and action items for faster product decisions.
                </p>

                {/* Socials */}
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={SOCIALS.x}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      p-2 rounded-xl
                      bg-white/5 border border-white/10
                      text-white/55 hover:text-white
                      hover:bg-white/10 transition
                    "
                    aria-label="X"
                    title="X"
                  >
                    <X className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      p-2 rounded-xl
                      bg-white/5 border border-white/10
                      text-white/55 hover:text-white
                      hover:bg-white/10 transition
                    "
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <Github className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href={SOCIALS.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      p-2 rounded-xl
                      bg-white/5 border border-white/10
                      text-white/55 hover:text-white
                      hover:bg-white/10 transition
                    "
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-8 shrink-0">
                <div>
                  <h3 className="text-xs font-semibold text-white/80 tracking-wide mb-3">
                    Account
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/signin"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/signup"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Sign up
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-white/80 tracking-wide mb-3">
                    Legal
                  </h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/privacy"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/terms"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 my-6" />

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-white/35">
                © {year} FeedbackIntel
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/30">
                <span>React + TypeScript</span>
                <span className="hidden sm:inline">•</span>
                <span>Secure Auth</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </footer>
  );
};

export default Footer;
