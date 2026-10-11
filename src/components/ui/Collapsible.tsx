import { useId, useState } from "react";
import type { ReactNode } from "react";

/**
 * Optional depth, closed by default.
 *
 * Built on a real button with aria-expanded rather than <details>, so the
 * open state can be reported alongside the rest of the lesson telemetry and
 * styled consistently across browsers.
 */
export function Collapsible({
  title,
  children,
  onOpen,
}: {
  title: string;
  children: ReactNode;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const contentId = useId();

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border)", background: "var(--surface-raised)" }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) onOpen?.();
        }}
        className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold"
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          className="shrink-0 text-xs transition-transform duration-200"
          style={{ color: "var(--text-muted)", transform: open ? "rotate(90deg)" : "none" }}
        >
          ▶
        </span>
      </button>
      {open && (
        <div
          id={contentId}
          className="px-4 pb-4 text-[0.95rem]"
          style={{ borderTop: "1px solid var(--border)", paddingTop: "0.875rem" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
