import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  raised = false,
}: {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 ${className}`}
      style={{
        background: raised ? "var(--surface-raised)" : "var(--surface)",
        border: "1px solid var(--border)",
      }}
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
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold">{title}</h2>
        {hint && (
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
            {hint}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
