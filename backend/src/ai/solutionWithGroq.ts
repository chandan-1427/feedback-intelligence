import { groq } from "./groqClient.js";
import { env } from "../config/env.js";

export type ClusterSolution = {
  solution_summary: string;
  root_cause: string;
  quick_fix: string;
  long_term_fix: string;
  action_steps: string[];
  priority: "low" | "medium" | "high";
  confidence: number;
};

export async function generateClusterSolutionWithGroq(args: {
  theme: string;
  feedbackMessages: string[];
}): Promise<ClusterSolution> {
  const { theme, feedbackMessages } = args;

  const prompt = `
You are an expert product engineer and support lead.

Your job:
Given a cluster theme and user feedback messages, generate a solution plan.

Return ONLY valid JSON exactly with this schema:
{
  "solution_summary": "string (max 25 words)",
  "root_cause": "string",
  "quick_fix": "string",
  "long_term_fix": "string",
  "action_steps": ["step1", "step2", "step3"],
  "priority": "low" | "medium" | "high",
  "confidence": number between 0 and 1
}

Theme: "${theme}"

Feedback messages:
${feedbackMessages.map((m, i) => `${i + 1}. ${m}`).join("\n")}
`;

  const completion = await groq.chat.completions.create({
    model: env.GROQ_MODEL,
    temperature: 0.2,
    messages: [
      { role: "system", content: "You output strict JSON only." },
      { role: "user", content: prompt },
    ],
  });

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq returned empty response");

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error(`Invalid JSON output: ${text}`);

  const parsed = JSON.parse(text.slice(start, end + 1));

  return {
    solution_summary: String(parsed.solution_summary || "").slice(0, 250),
    root_cause: String(parsed.root_cause || ""),
    quick_fix: String(parsed.quick_fix || ""),
    long_term_fix: String(parsed.long_term_fix || ""),
    action_steps: Array.isArray(parsed.action_steps) ? parsed.action_steps.map(String) : [],
    priority: parsed.priority || "medium",
    confidence: Math.max(0, Math.min(1, Number(parsed.confidence) || 0)),
  };
}
