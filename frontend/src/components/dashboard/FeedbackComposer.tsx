import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, Loader2, X, CheckCircle2, AlertTriangle, ChevronDown } from "lucide-react";
import { storeBulkFeedbackApi, storeFeedbackApi } from "../../lib/api/feedback";

type Props = {
  onSuccess?: () => void;
  maxLength?: number;
};

const DRAFT_KEY = "feedback_draft_v1";

// ✅ helper: split textarea into multiple feedback messages
function parseBulkMessages(text: string) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // ✅ de-duplicate
  return Array.from(new Set(lines));
}

const FeedbackComposer: React.FC<Props> = ({ onSuccess, maxLength = 500 }) => {
  const [message, setMessage] = useState("");
  const [showBulkTemplate, setShowBulkTemplate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load draft
  useEffect(() => {
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) setMessage(draft);
    } catch (err) {
      console.error("Draft load failed:", err);
    }
  }, []);

  // Save draft
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, message);
    } catch (err) {
      console.error("Draft save failed:", err);
    }
  }, [message]);

  // Auto resize
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  }, [message]);

  const trimmed = useMemo(() => message.trim(), [message]);
  const remaining = maxLength - message.length;

  const bulkMessages = useMemo(() => parseBulkMessages(message), [message]);
  const isBulk = bulkMessages.length > 1;

  const canSubmit =
    trimmed.length > 0 && !isSubmitting && message.length <= maxLength;

  const clearMessage = () => {
    setMessage("");
    setError("");
    setSavedToast(false);

    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (err) {
      console.error("Draft clear failed:", err);
    }

    textareaRef.current?.focus();
  };

  const singleTemplates = [
    "Dashboard loads slow on mobile.",
    "Insights page is confusing to navigate.",
    "Please add export/download for reports.",
  ];

  const bulkTemplate = `Login takes too long on poor network.
  Password reset email sometimes doesn’t arrive.
  Dashboard freezes when switching between tabs.
  Search results feel irrelevant.
  Charts take time to render on large datasets.`;

  const applyTemplate = (text: string) => {
    if (isSubmitting) return;
    setMessage(text);
    setError("");
    setSavedToast(false);
    textareaRef.current?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSavedToast(false);

    if (!trimmed) {
      setError("Please type your feedback.");
      textareaRef.current?.focus();
      return;
    }

    if (message.length > maxLength) {
      setError(`Too long. Max ${maxLength} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ BULK MODE: multiple feedback lines
      if (isBulk) {
        // optional limit safeguard
        if (bulkMessages.length > 50) {
          setError("Too many feedbacks. Please upload up to 50 at a time.");
          setIsSubmitting(false);
          return;
        }

        await storeBulkFeedbackApi(bulkMessages);
      } else {
        // ✅ SINGLE MODE
        await storeFeedbackApi(trimmed);
      }

      setMessage("");
      setSavedToast(true);

      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch (err) {
        console.error("Draft remove failed:", err);
      }

      onSuccess?.();

      setTimeout(() => setSavedToast(false), 1400);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md p-4 md:p-5 min-w-0">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white/90">
            Submit feedback
          </h3>
          <p className="text-xs text-white/45 mt-0.5">
            {isBulk
              ? `Bulk upload enabled • ${bulkMessages.length} feedbacks detected`
              : "One message is enough. Keep it clear and specific."}
          </p>
        </div>

        {/* saved toast */}
        <div
          className={`
            inline-flex items-center gap-1.5
            px-2.5 py-1 rounded-lg text-[11px] font-semibold
            border transition-all
            ${
              savedToast
                ? "opacity-100 bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "opacity-0 pointer-events-none border-transparent text-transparent"
            }
          `}
        >
          <CheckCircle2 className="w-4 h-4" />
          Saved
        </div>
      </div>

      {/* Templates (compact) */}
      <div className="flex flex-col gap-3 mb-3">

        {/* Single templates */}
        <div className="flex flex-wrap items-center gap-2">
          {singleTemplates.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => applyTemplate(t)}
              disabled={isSubmitting}
              className="
                px-3 py-1.5 rounded-lg text-xs font-medium
                bg-white/5 border border-white/10 text-white/60
                hover:bg-white/10 hover:text-white
                transition-all active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {t}
            </button>
          ))}

          {message.length > 0 && (
            <button
              type="button"
              onClick={clearMessage}
              disabled={isSubmitting}
              className="
                inline-flex items-center gap-1.5
                px-3 py-1.5 rounded-lg text-xs font-medium
                bg-red-500/10 border border-red-500/20 text-red-300
                hover:bg-red-500/15 transition-all active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* Bulk template accordion */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowBulkTemplate((v) => !v)}
            disabled={isSubmitting}
            className="
              w-full flex items-center justify-between
              px-3 py-2 text-xs font-semibold
              text-white/70 hover:text-white
              hover:bg-white/5 transition-all
            "
          >
            <span>Bulk demo feedback</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showBulkTemplate ? "rotate-180" : ""
              }`}
            />
          </button>

          {showBulkTemplate && (
            <div className="px-3 pb-3 pt-1 space-y-2 animate-in fade-in slide-in-from-top-1">
              <pre
                className="
                  text-[11px] leading-relaxed
                  text-white/60 whitespace-pre-wrap
                  bg-black/30 rounded-lg p-3
                  border border-white/5
                "
              >
                {bulkTemplate}
              </pre>

              <button
                type="button"
                onClick={() => {
                  applyTemplate(bulkTemplate)
                  setShowBulkTemplate(false)
                }}
                disabled={isSubmitting}
                className="
                  w-full inline-flex items-center justify-center
                  px-3 py-2 rounded-lg text-xs font-semibold
                  bg-[#5A0091]/20 text-[#C084FC]
                  hover:bg-[#5A0091]/30 transition-all
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Use bulk template
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="space-y-3">
        <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
              setSavedToast(false);
            }}
            disabled={isSubmitting}
            placeholder={
              "Example:\nDashboard is slow on mobile.\nInsights page is confusing.\nAdd export to PDF."
            }
            className="
              w-full min-h-[96px] max-h-[180px] resize-none
              rounded-lg bg-transparent
              text-sm text-white/85 placeholder-white/25
              outline-none
            "
          />

          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-white/35">
              Tip: new line = new feedback.
            </span>

            <span
              className={`font-medium ${
                remaining < 0
                  ? "text-red-300"
                  : remaining <= 50
                  ? "text-amber-300"
                  : "text-white/35"
              }`}
            >
              {message.length}/{maxLength}
            </span>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-200">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="
            w-full inline-flex items-center justify-center gap-2
            py-2.5 rounded-xl
            bg-[#5A0091] text-white text-sm font-semibold
            hover:bg-[#7A00C5]
            transition-all active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isBulk ? "Uploading..." : "Sending..."}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {isBulk ? `Upload ${bulkMessages.length} feedbacks` : "Submit"}
            </>
          )}
        </button>

        <p className="text-[11px] text-white/30 text-center">
          Stored securely and used for theming later.
        </p>
      </form>
    </div>
  );
};

export default FeedbackComposer;
