import { useEffect, useMemo, useState } from "react";
import type { VisualizationProps } from "./types";

/**
 * A probability mass function as bars, with optional overlays for the mean and
 * for one standard deviation either side of it.
 *
 * Expectation is drawn as a balance point rather than stated as a formula: the
 * mean is the place the distribution would balance, and the spread band shows
 * what the variance is measuring. The same chart carries the geometric,
 * binomial and Poisson distributions later in the curriculum.
 */

interface Bar {
  x: number;
  p: number;
  /** Optional display label; defaults to the numeric value. */
  label?: string;
}

function barsFrom(config: Record<string, unknown>): Bar[] {
  const raw = config.values;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (b): b is Bar =>
      typeof b === "object" &&
      b !== null &&
      typeof (b as Bar).x === "number" &&
      typeof (b as Bar).p === "number",
  );
}

function textFrom(config: Record<string, unknown>, key: string, fallback: string): string {
  const value = config[key];
  return typeof value === "string" ? value : fallback;
}

const fmt = (n: number) => String(Number(n.toFixed(4)));

type Overlay = "none" | "mean" | "spread";

export function PmfChart({ config, onStateChange }: VisualizationProps) {
  const bars = useMemo(() => barsFrom(config), [config]);
  const xLabel = textFrom(config, "xLabel", "Value");
  const title = textFrom(config, "title", "Probability mass function");
  const offerMean = config.offerMean !== false;
  const offerSpread = config.offerSpread === true;

  const [overlay, setOverlay] = useState<Overlay>("none");

  useEffect(() => {
    onStateChange?.(overlay);
  }, [overlay, onStateChange]);

  const totalP = bars.reduce((s, b) => s + b.p, 0);
  const mean = bars.reduce((s, b) => s + b.x * b.p, 0);
  const variance = bars.reduce((s, b) => s + (b.x - mean) ** 2 * b.p, 0);
  const sd = Math.sqrt(variance);
  const maxP = bars.reduce((m, b) => Math.max(m, b.p), 0) || 1;

  const minX = bars.reduce((m, b) => Math.min(m, b.x), Infinity);
  const maxX = bars.reduce((m, b) => Math.max(m, b.x), -Infinity);
  const span = maxX - minX || 1;
  /** Position of a value along the chart, as a percentage of its width. */
  const at = (x: number) => ((x - minX + 0.5) / (span + 1)) * 100;

  const options: [Overlay, string][] = [["none", "Just the distribution"]];
  if (offerMean) options.push(["mean", "Show the mean"]);
  if (offerSpread) options.push(["spread", "Show the spread"]);

  return (
    <figure className="space-y-4">
      {options.length > 1 && (
        <div
          className="bg-sunken flex gap-1.5 rounded-2xl p-1.5"
          role="group"
          aria-label="Chart overlay"
        >
          {options.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={overlay === value}
              onClick={() => setOverlay(value)}
              className={`min-h-11 flex-1 rounded-xl px-2 text-xs font-bold transition-colors sm:text-sm ${
                overlay === value
                  ? "bg-accent text-white shadow-card"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className="border-line bg-surface rounded-card border p-4 shadow-card sm:p-5">
        <div className="relative h-48">
          {overlay === "spread" && sd > 0 && (
            <div
              className="bg-accent/10 border-accent/30 absolute inset-y-0 rounded-lg border-x-2 transition-all duration-300"
              style={{
                left: `${Math.max(0, at(mean - sd))}%`,
                right: `${Math.max(0, 100 - at(mean + sd))}%`,
              }}
              aria-hidden="true"
            />
          )}

          <div className="absolute inset-0 flex items-end gap-1.5">
            {bars.map((bar) => (
              // h-full matters: the bar's height is a percentage, and a
              // percentage of an auto-height parent collapses to nothing.
              <div
                key={bar.x}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
              >
                {bars.length <= 6 && (
                  <span className="text-ink-muted mb-1 text-[0.6rem] font-bold tabular-nums sm:text-[0.7rem]">
                    {fmt(bar.p)}
                  </span>
                )}
                <div
                  className="bg-accent w-full rounded-t-md transition-[height] duration-500"
                  style={{ height: `${(bar.p / maxP) * 78}%` }}
                >
                  <span className="sr-only">{`Value ${bar.label ?? bar.x}: probability ${fmt(bar.p)}.`}</span>
                </div>
              </div>
            ))}
          </div>

          {overlay !== "none" && bars.length > 0 && (
            <div
              className="bg-bad absolute inset-y-0 w-0.5 transition-all duration-300"
              style={{ left: `${at(mean)}%` }}
              aria-hidden="true"
            >
              <span className="bg-bad absolute -top-1 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[0.65rem] font-extrabold whitespace-nowrap text-white">
                mean {fmt(mean)}
              </span>
            </div>
          )}
        </div>

        <div className="border-line mt-2 flex gap-1.5 border-t pt-2">
          {bars.map((bar) => (
            <span
              key={bar.x}
              className="text-ink-muted min-w-0 flex-1 text-center text-[0.65rem] font-bold tabular-nums sm:text-xs"
            >
              {bar.label ?? bar.x}
            </span>
          ))}
        </div>
        <p className="text-ink-muted mt-1.5 text-center text-[0.7rem] font-bold tracking-wide uppercase">
          {xLabel}
        </p>
      </div>

      <div className="bg-accent-soft rounded-card px-5 py-4" aria-live="polite">
        <p className="text-accent-ink text-xs font-extrabold tracking-wide">{title}</p>
        {overlay === "none" ? (
          <p className="mt-1 text-2xl font-extrabold tabular-nums">
            {bars.length} values, totalling {fmt(totalP)}
          </p>
        ) : overlay === "mean" ? (
          <p className="mt-1 text-2xl font-extrabold tabular-nums">E[X] = {fmt(mean)}</p>
        ) : (
          <p className="mt-1 text-2xl font-extrabold tabular-nums">
            var(X) = {fmt(variance)} · SD = {fmt(sd)}
          </p>
        )}
      </div>
    </figure>
  );
}
