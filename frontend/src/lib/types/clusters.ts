export type ThemeCluster = {
  theme: string;
  total: number;
};

export type GetThemeClustersResponse = {
  message: string;
  clusters: ThemeCluster[];
};

export type ClusterFeedbackItem = {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  sentiment: string;
  confidence: number | string;
  summary: string;
};

export type GetThemeClusterDetailsResponse = {
  message: string;
  theme: string;
  total: number;
  feedbacks: ClusterFeedbackItem[];
};
