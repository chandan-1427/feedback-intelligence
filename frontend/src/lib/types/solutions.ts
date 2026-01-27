
export type ClusterSolution = {
  theme: string;
  total_feedbacks: number;
  solution_summary: string;
  root_cause: string;
  quick_fix: string;
  long_term_fix: string;
  action_steps: string[];
  priority: string;
  confidence: number;
  updated_at: string;
  created_at?: string;
};

export type SolutionGenerateResponse = {
  message: string;
  theme: string;
  totalFeedbacks: number;
  solution: {
    solution_summary: string;
    root_cause: string;
    quick_fix: string;
    long_term_fix: string;
    action_steps: string[];
    priority: string;
    confidence: number;
  };
};

export type SolutionsListResponse = {
  message: string;
  solutions: Array<{
    theme: string;
    total_feedbacks: number;
    solution_summary: string;
    priority: string;
    confidence: number;
    updated_at: string;
  }>;
};

export type SolutionDetailsResponse = {
  message: string;
  solution: ClusterSolution | null;
};
