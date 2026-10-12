import type { ReactNode } from "react";
import type { MasteryState } from "../../engine/masteryTracker";
import { MASTERY_LABELS } from "../../engine/masteryTracker";

type Tone = "neutral" | "accent" | "correct" | "wrong" | "warn" | "outline";

const TONES: Record<Tone, string> = {
  neutral: "bg-sunken text-ink-muted",
  accent: "bg-accent-soft text-accent-ink",
  correct: "bg-good-soft text-good-ink",
  wrong: "bg-bad-soft text-bad-ink",
  warn: "bg-warn-soft text-warn-ink",
  outline: "border border-line text-ink-muted",
};

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-bold tracking-wide whitespace-nowrap ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

const MASTERY_TONES: Record<MasteryState, Tone> = {
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

/** The small uppercase line that labels a hero card. */
export function Eyebrow({ children, tone = "accent" }: { children: ReactNode; tone?: Tone }) {
  const colour =
    tone === "warn" ? "text-warn-ink" : tone === "correct" ? "text-good-ink" : "text-accent-ink";
  return (
    <p className={`text-[0.7rem] font-extrabold tracking-[0.1em] uppercase ${colour}`}>
      {children}
    </p>
  );
}
