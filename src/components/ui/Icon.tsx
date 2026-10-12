import type { SVGProps } from "react";

/**
 * A small hand-built icon set.
 *
 * Stroke-only, 1.75 units wide with round joins, all on a 24-unit grid, so the
 * icons sit at the same optical weight as the semibold UI type next to them.
 * A dependency-free set of eight beats pulling in an icon library for eight.
 */
export type IconName =
  | "home"
  | "book"
  | "target"
  | "repeat"
  | "settings"
  | "sun"
  | "moon"
  | "close"
  | "check"
  | "chevron"
  | "arrow-left"
  | "lightbulb"
  | "external"
  | "sparkle"
  | "lock";

const PATHS: Record<IconName, string> = {
  home: "M3.5 10.3 12 3.5l8.5 6.8V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z",
  book: "M4 4.5h6a2.5 2.5 0 0 1 2.5 2.5v12A2 2 0 0 0 10.5 17H4zM20 4.5h-6A2.5 2.5 0 0 0 11.5 7v12A2 2 0 0 1 13.5 17H20z",
  target: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
  repeat: "M4 11a8 8 0 0 1 13.7-5.6L20 7.5M20 13a8 8 0 0 1-13.7 5.6L4 16.5M20 3.5v4h-4M4 20.5v-4h4",
  settings:
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1h-.2a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5v-.2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10M12 1.8v2.4M12 19.8v2.4M4.8 4.8l1.7 1.7M17.5 17.5l1.7 1.7M1.8 12h2.4M19.8 12h2.4M4.8 19.2l1.7-1.7M17.5 6.5l1.7-1.7",
  moon: "M20.5 14.3A8.7 8.7 0 0 1 9.7 3.5a8.7 8.7 0 1 0 10.8 10.8",
  close: "M6 6l12 12M18 6L6 18",
  check: "M4.5 12.8 9.5 18 19.5 6.5",
  chevron: "M9 5.5 15.5 12 9 18.5",
  "arrow-left": "M19 12H5M11 5.5 4.5 12 11 18.5",
  lightbulb:
    "M9.2 17.5h5.6M10 21h4M12 2.8a6.2 6.2 0 0 0-3.6 11.2c.5.4.8 1 .8 1.6v.4h5.6v-.4c0-.6.3-1.2.8-1.6A6.2 6.2 0 0 0 12 2.8",
  external:
    "M14 4.5h5.5V10M19 5 11 13M18 14.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19V7.5A1.5 1.5 0 0 1 5 6h4.5",
  sparkle:
    "M12 3.2 13.9 9 19.8 10.9 13.9 12.8 12 18.7 10.1 12.8 4.2 10.9 10.1 9zM18.5 16.5l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z",
  lock: "M7 10.5V7.8a5 5 0 0 1 10 0v2.7M5.8 10.5h12.4a1.2 1.2 0 0 1 1.2 1.2v8a1.2 1.2 0 0 1-1.2 1.2H5.8a1.2 1.2 0 0 1-1.2-1.2v-8a1.2 1.2 0 0 1 1.2-1.2",
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Pixel size of the square box. */
  size?: number;
}

export function Icon({ name, size = 20, className = "", ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
