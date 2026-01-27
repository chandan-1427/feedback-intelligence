import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Github, Linkedin, Twitter } from "lucide-react";

type SocialLinks = {
  github: string;
  linkedin: string;
  x: string;
};

const SOCIALS: SocialLinks = {
  github: "https://github.com/chandan-1427",
  linkedin: "https://www.linkedin.com/in/chandan-dakka-805068360/",
  x: "https://x.com/chandan_1427",
};

const AuthorizedFooter: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0D0E0E] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div
          className="
            relative isolate w-full max-w-full overflow-hidden
            rounded-2xl
            bg-white/[0.03] backdrop-blur-xl
            border border-white/10
            shadow-[0_12px_35px_rgba(0,0,0,0.45)]
          "
        >
          {/* soft ambient glows (smaller) */}
          <div className="pointer-events-none absolute -top-14 -left-14 w-44 h-44 bg-[#5A0091]/20 blur-[70px] rounded-full" />
          <div className="pointer-events-none absolute -bottom-14 -right-14 w-44 h-44 bg-[#7A00C5]/10 blur-[80px] rounded-full" />

          <div className="relative px-5 md:px-8 py-6">
            {/* Top */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              {/* Brand + short text */}
              <div className="min-w-0 max-w-md">
                <div className="flex items-center gap-3">
                  <div className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/90 truncate">
                      Feedback<span className="text-[#A855F7]">Intel</span>
                    </p>
                    <p className="text-[11px] text-white/35">Authorized area</p>
                  </div>
                </div>

                <p className="text-sm text-white/50 mt-3 leading-relaxed">
                  Collect feedback, group it into themes, and generate solution ideas.
                </p>

                {/* Socials */}
                <div className="mt-4 flex items-center gap-2">
                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      p-2 rounded-lg
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
                      p-2 rounded-lg
                      bg-white/5 border border-white/10
                      text-white/55 hover:text-white
                      hover:bg-white/10 transition
                    "
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>

                  <a
                    href={SOCIALS.x}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      p-2 rounded-lg
                      bg-white/5 border border-white/10
                      text-white/55 hover:text-white
                      hover:bg-white/10 transition
                    "
                    aria-label="X"
                    title="X"
                  >
                    <Twitter className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-semibold text-white/80 mb-3">
                    Quick links
                  </p>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/dashboard"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/insights"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Insights
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/solutions"
                        className="text-sm text-white/55 hover:text-white transition"
                      >
                        Solutions
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-white/80 mb-3">
                    Tech
                  </p>
                  <ul className="space-y-2">
                    <li className="text-sm text-white/55">JWT cookies</li>
                    <li className="text-sm text-white/55">PostgreSQL</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 my-5" />

            {/* Bottom */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <p className="text-xs text-white/35">© {year} FeedbackIntel</p>

              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/35">
                <span>React</span>
                <span className="hidden md:inline text-white/15">•</span>
                <span>Hono</span>
                <span className="hidden md:inline text-white/15">•</span>
                <span>AI theming</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>
    </footer>
  );
};

export default AuthorizedFooter;
