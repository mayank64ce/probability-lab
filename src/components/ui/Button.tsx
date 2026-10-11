import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold " +
  "transition-colors disabled:cursor-not-allowed disabled:opacity-45 select-none";

export function Button({ variant = "primary", className = "", children, ...rest }: ButtonProps) {
  const style =
    variant === "primary"
      ? { background: "var(--accent)", color: "#fff" }
      : variant === "secondary"
        ? {
            background: "var(--surface-raised)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }
        : { background: "transparent", color: "var(--accent-text)" };

  return (
    <button type="button" className={`${BASE} ${className}`} style={style} {...rest}>
      {children}
    </button>
  );
}
