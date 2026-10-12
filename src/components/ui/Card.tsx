import type { ReactNode } from "react";

type Tone = "plain" | "raised" | "accent";

const TONES: Record<Tone, string> = {
  plain: "bg-surface border-line",
  raised: "bg-raised border-line",
  accent: "bg-accent-soft border-accent/25",
};

export function Card({
  children,
  className = "",
  tone = "plain",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  /** Adds the hover lift used by cards that are really links. */
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-card border p-5 shadow-card sm:p-6 ${TONES[tone]} ${
        interactive ? "liftable hover:border-line-strong" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  action,
  hint,
}: {
  title: string;
  action?: ReactNode;
  hint?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold">{title}</h2>
        {hint && <p className="text-ink-muted mt-0.5 text-sm">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

/** A square, tinted glyph holder — the motif that carries colour on list rows. */
export function IconTile({
  children,
  tone = "accent",
  className = "",
}: {
  children: ReactNode;
  tone?: "accent" | "good" | "warn" | "neutral";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent-soft text-accent-ink",
    good: "bg-good-soft text-good-ink",
    warn: "bg-warn-soft text-warn-ink",
    neutral: "bg-sunken text-ink-muted",
  };

  return (
    <span
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
