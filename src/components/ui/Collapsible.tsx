import { useId, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

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
    <div className="border-line bg-surface overflow-hidden rounded-card border">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) onOpen?.();
        }}
        className="hover:bg-raised flex min-h-13 w-full items-center justify-between gap-3 px-5 py-3.5 text-left text-[0.95rem] font-bold transition-colors"
      >
        <span className="flex items-center gap-2.5">
          <Icon name="sparkle" size={18} className="text-accent" />
          {title}
        </span>
        <Icon
          name="chevron"
          size={18}
          className="text-ink-muted transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : undefined }}
        />
      </button>
      {open && (
        <div
          id={contentId}
          className="border-line animate-rise border-t px-5 pt-4 pb-5 text-[0.95rem]"
        >
          {children}
        </div>
      )}
    </div>
  );
}
