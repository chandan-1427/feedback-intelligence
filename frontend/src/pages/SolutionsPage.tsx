import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, Wand2 } from "lucide-react";

import { useMe } from "../hooks/auth/useMe";
import { useSolutions } from "../hooks/solutions/useSolutions";
import { useSolutionDetails } from "../hooks/solutions/useSolutionDetails";

import SolutionsListCard from "../components/solutions/SolutionsListCard";
import SolutionDetailsCard from "../components/solutions/SolutionDetailsCard";

const SolutionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { status } = useMe();

  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const solutions = useSolutions();
  const solutionDetails = useSolutionDetails();

  useEffect(() => {
    if (status === "unauthorized") navigate("/signin");
  }, [status, navigate]);

  const handleSolutionSelect = (theme: string) => {
    setActiveTheme(theme);
    solutionDetails.fetchSolution(theme);
  };

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-screen bg-[#0D0E0E] text-white flex items-center justify-center">
        <RefreshCw className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (status === "unauthorized") return null;

  return (
    <div className="min-h-screen pt-20 bg-[#0D0E0E] font-work text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Wand2 className="w-4 h-4 text-[#A855F7]" />
            Solutions
          </div>

          <h1 className="mt-3 text-2xl md:text-4xl font-bold font-poppins text-white/90">
            Solutions
          </h1>

          <p className="mt-2 text-sm text-white/50 max-w-2xl">
            Generate, review, and refine solution plans for your themes.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
};

export default SolutionsPage;
