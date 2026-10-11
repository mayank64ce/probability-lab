import { InlineText } from "../ui/RichText";

export type FeedbackTone = "correct" | "partial" | "incorrect";

export interface Feedback {
  tone: FeedbackTone;
  title: string;
  /** Misconception-specific text. Supports inline maths. */
  message?: string;
}

const TONES: Record<FeedbackTone, { bg: string; fg: string; icon: string }> = {
  correct: { bg: "var(--correct-soft)", fg: "var(--correct)", icon: "✓" },
  partial: { bg: "var(--warn-soft)", fg: "var(--warn)", icon: "!" },
  incorrect: { bg: "var(--wrong-soft)", fg: "var(--wrong)", icon: "✕" },
};

export function FeedbackBanner({ feedback }: { feedback: Feedback }) {
  const tone = TONES[feedback.tone];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex gap-3 rounded-xl px-4 py-3"
      style={{ background: tone.bg }}
    >
      <span
        aria-hidden="true"
        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{ background: tone.fg, color: "var(--surface)" }}
      >
        {tone.icon}
      </span>
      <div className="min-w-0 space-y-1 text-[0.95rem]">
        <p className="font-semibold" style={{ color: tone.fg }}>
          {feedback.title}
        </p>
        {feedback.message && (
          <p className="leading-relaxed">
            <InlineText text={feedback.message} />
          </p>
        )}
      </div>
    </div>
  );
}
