import type { ReactNode } from "react";
import type { MasteryState } from "../../engine/masteryTracker";
import { MASTERY_LABELS } from "../../engine/masteryTracker";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "correct" | "wrong" | "warn";
}) {
  const palette = {
    neutral: { bg: "var(--surface-sunken)", fg: "var(--text-muted)" },
    accent: { bg: "var(--accent-soft)", fg: "var(--accent-text)" },
    correct: { bg: "var(--correct-soft)", fg: "var(--correct)" },
    wrong: { bg: "var(--wrong-soft)", fg: "var(--wrong)" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)" },
  }[tone];

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold whitespace-nowrap"
      style={{ background: palette.bg, color: palette.fg }}
    >
      {children}
    </span>
  );
}

const MASTERY_TONES: Record<MasteryState, "neutral" | "accent" | "correct" | "wrong" | "warn"> = {
  "not-started": "neutral",
  learning: "accent",
  practicing: "accent",
  proficient: "correct",
  mastered: "correct",
  "review-needed": "warn",
};

export function MasteryBadge({ state }: { state: MasteryState }) {
  return <Badge tone={MASTERY_TONES[state]}>{MASTERY_LABELS[state]}</Badge>;
}
