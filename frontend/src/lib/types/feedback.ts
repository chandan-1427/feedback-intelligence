export type FeedbackItem = {
  id: string;
  user_id: string | null;
  message: string;
  created_at: string;
  theme_status?: "pending" | "processing" | "done" | "failed";
};

export type GetFeedbacksResponse = {
  page: number;
  limit: number;
  feedbacks: FeedbackItem[];
};

export type FeedbackStatsResponse = {
  total: number;
  today: number;
};

export type StoreFeedbackResponse = {
  message: string;
  feedback: FeedbackItem;
};

export type StoreBulkFeedbackResponse = {
  message: string;
  count: number;
  feedbacks: FeedbackItem[];
};

export type PendingFeedbackCountResponse = {
  message: string;
  total: number;
};
