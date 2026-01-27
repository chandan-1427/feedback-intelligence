import { groq } from "./groqClient.js";
import { env } from "@/config/env.js";

export type FeedbackTheme =
  | "login_issue"
  | "performance_issue"
  | "ui_ux_issue"
  | "feature_request"
  | "bug_report"
  | "payment_issue"
  | "account_issue"
  | "other";

export type ThemingResult = {
  theme: FeedbackTheme;
  sentiment: "negative" | "neutral" | "positive";
  confidence: number; // 0 to 1
  summary: string;
};

const THEMES: FeedbackTheme[] = [
  "login_issue",
  "performance_issue",
  "ui_ux_issue",
  "feature_request",
  "bug_report",
  "payment_issue",
  "account_issue",
  "other",
];

export async function themeFeedbackWithGroq(message: string): Promise<ThemingResult> {
  const prompt = `
You are classifying user feedback for a SaaS product.

Return ONLY valid JSON with these fields:
{
  "theme": one of ${JSON.stringify(THEMES)},
  "sentiment": "negative" | "neutral" | "positive",
  "confidence": number between 0 and 1,
  "summary": short 1-line summary (max 18 words)
}

Feedback:
"""${message}"""
`;

  const completion = await groq.chat.completions.create({
    model: env.GROQ_MODEL,
    messages: [
      { role: "system", content: "You are a strict JSON generator." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned empty response");

  // Safety: extract JSON even if model adds accidental extra text
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) throw new Error(`Invalid JSON output: ${text}`);

  const parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));

  return {
    theme: parsed.theme,
    sentiment: parsed.sentiment,
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
    summary: String(parsed.summary || "").slice(0, 140),
  };
}
