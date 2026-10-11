interface ProgressBarProps {
  /** 0 to 1. */
  value: number;
  label?: string;
  /** Renders a thinner bar for use inside cards. */
  compact?: boolean;
}

export function ProgressBar({ value, label, compact = false }: ProgressBarProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className="w-full overflow-hidden rounded-full"
      style={{ background: "var(--surface-sunken)", height: compact ? 6 : 10 }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-300"
        style={{ width: `${pct}%`, background: "var(--accent)" }}
      />
    </div>
  );
}
