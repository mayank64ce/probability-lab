import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";
import { InlineText } from "../ui/RichText";

export type FeedbackTone = "correct" | "partial" | "incorrect";

export interface Feedback {
  tone: FeedbackTone;
  title: string;
  /** Misconception-specific text. Supports inline maths. */
  message?: string;
}

export const FEEDBACK_SURFACE: Record<FeedbackTone, string> = {
  correct: "bg-good-soft",
  partial: "bg-warn-soft",
  incorrect: "bg-bad-soft",
};

const MARK: Record<
  FeedbackTone,
  { bg: string; fg: string; icon: "check" | "close" | "lightbulb" }
> = {
  correct: { bg: "bg-good", fg: "text-good-ink", icon: "check" },
  partial: { bg: "bg-warn", fg: "text-warn-ink", icon: "lightbulb" },
  incorrect: { bg: "bg-bad", fg: "text-bad-ink", icon: "close" },
};

/**
 * The verdict, shown in the action bar at the bottom of a lesson rather than
 * inline, so the answer the learner just gave stays put on screen while the
 * explanation arrives underneath it.
 */
export function FeedbackPanel({
  feedback,
  children,
}: {
  feedback: Feedback;
  /** Actions rendered beside the verdict on wide screens. */
  children?: ReactNode;
}) {
  const mark = MARK[feedback.tone];

  return (
    <div role="status" aria-live="polite" className="flex items-start gap-3.5">
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${mark.bg}`}
      >
        <Icon name={mark.icon} size={18} strokeWidth={2.75} />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className={`text-[1.05rem] font-extrabold ${mark.fg}`}>{feedback.title}</p>
        {feedback.message && (
          <p className="text-[0.95rem] leading-relaxed">
            <InlineText text={feedback.message} />
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
