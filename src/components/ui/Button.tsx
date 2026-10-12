import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "ghost-bad" | "good" | "bad";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const BASE =
  "pressable inline-flex items-center justify-center gap-2 rounded-2xl font-bold " +
  "whitespace-nowrap select-none disabled:cursor-not-allowed disabled:opacity-40";

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-5 text-[0.9rem]",
  lg: "min-h-13 px-6 text-base",
};

/**
 * The solid bottom edge is what makes these feel pressable rather than painted
 * on. It is a box-shadow rather than a border so the button's own height never
 * shifts when it is disabled and the edge disappears.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-white",
  secondary: "bg-surface text-ink border-2 border-line-strong",
  ghost: "bg-transparent text-accent-ink hover:bg-accent-soft",
  "ghost-bad": "bg-transparent text-bad-ink hover:bg-bad-soft",
  good: "bg-good text-white",
  bad: "bg-bad text-white",
};

const EDGES: Record<Variant, string | undefined> = {
  primary: "var(--color-accent-deep)",
  secondary: "var(--color-line-strong)",
  ghost: undefined,
  "ghost-bad": undefined,
  good: "var(--color-good-deep)",
  bad: "var(--color-bad-deep)",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  style,
  children,
  ...rest
}: ButtonProps) {
  const edge = EDGES[variant];
  const pressStyle = { ...(edge ? ({ "--press-edge": edge } as CSSProperties) : {}), ...style };

  return (
    <button
      type="button"
      className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
      style={pressStyle}
      {...rest}
    >
      {children}
    </button>
  );
}
