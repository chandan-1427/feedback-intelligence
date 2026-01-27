export type FeedbackAiAnalysis = {
  theme: string;
  sentiment: string;
  confidence: number;
  summary: string;
};

export type ThemeSingleResponse = {
  message: string;
  analysis: FeedbackAiAnalysis;
};

export type BulkThemeResult =
  | { feedbackId: string; ok: true; analysis: FeedbackAiAnalysis }
  | { feedbackId: string; ok: false; error: string };

export type BulkThemeResponse = {
  message: string;
  total: number;
  results: BulkThemeResult[];
};
