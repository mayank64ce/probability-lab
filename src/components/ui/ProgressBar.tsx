interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  label?: string;
  /** Renders a thinner bar for use inside cards. */
  compact?: boolean;
  tone?: "accent" | "good";
}

export function ProgressBar({ value, label, compact = false, tone = "accent" }: ProgressBarProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={`bg-sunken w-full overflow-hidden rounded-full ${compact ? "h-1.5" : "h-2.5"}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ease-out ${
          tone === "good" ? "bg-good" : "bg-accent"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * One pip per screen, which tells the learner how much of a lesson is left at
 * a glance — a continuous bar hides whether "80%" means one screen or four.
 */
export function SegmentedProgress({
  total,
  current,
  completed,
  label,
}: {
  total: number;
  /** Zero-based index of the screen on show. */
  current: number;
  /** Indices already answered. */
  completed: Set<number>;
  label: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.min(current + 1, total)}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={label}
      aria-valuetext={`Screen ${Math.min(current + 1, total)} of ${total}`}
      className="flex w-full items-center gap-1.5"
    >
      {Array.from({ length: total }, (_, i) => {
        const done = completed.has(i);
        const here = i === current;
        return (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              done ? "bg-accent" : here ? "bg-accent/45" : "bg-sunken"
            }`}
          />
        );
      })}
    </div>
  );
}
