import { useEffect, useMemo, useState } from "react";
import type { VisualizationProps } from "./types";

/**
 * A sample space laid out as a grid of equally likely outcomes.
 *
 * Events are selected from a list and highlighted in place, so the learner
 * sees a probability as *a count of cells over a count of cells* before any
 * formula appears. Used for two-die sample spaces, the axioms, counting, and
 * joint distributions.
 *
 * Events are declared as data — a rule, not a predicate — because lesson
 * content must never need to ship a function.
 */

type Rule =
  | { kind: "all" }
  | { kind: "sum"; value: number }
  | { kind: "sumAtLeast"; value: number }
  | { kind: "row"; value: number }
  | { kind: "col"; value: number }
  | { kind: "match" }
  | { kind: "notMatch" }
  | { kind: "cells"; cells: [number, number][] };

interface GridView {
  id: string;
  label: string;
  rule: Rule;
}

function matches(rule: Rule, row: number, col: number): boolean {
  switch (rule.kind) {
    case "all":
      return true;
    case "sum":
      return row + col === rule.value;
    case "sumAtLeast":
      return row + col >= rule.value;
    case "row":
      return row === rule.value;
    case "col":
      return col === rule.value;
    case "match":
      return row === col;
    case "notMatch":
      return row !== col;
    case "cells":
      return rule.cells.some(([r, c]) => r === row && c === col);
    default:
      return false;
  }
}

function viewsFrom(config: Record<string, unknown>): GridView[] {
  const raw = config.views;
  if (!Array.isArray(raw)) return [{ id: "all", label: "All outcomes", rule: { kind: "all" } }];
  return raw.filter(
    (v): v is GridView =>
      typeof v === "object" &&
      v !== null &&
      typeof (v as GridView).id === "string" &&
      typeof (v as GridView).label === "string",
  );
}

function intFrom(config: Record<string, unknown>, key: string, fallback: number): number {
  const value = config[key];
  return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}

function textFrom(config: Record<string, unknown>, key: string, fallback: string): string {
  const value = config[key];
  return typeof value === "string" ? value : fallback;
}

export function OutcomeGrid({ config, onStateChange }: VisualizationProps) {
  const rows = intFrom(config, "rows", 6);
  const cols = intFrom(config, "cols", 6);
  const rowLabel = textFrom(config, "rowLabel", "First die");
  const colLabel = textFrom(config, "colLabel", "Second die");
  const showSum = config.showSum === true;

  const views = useMemo(() => viewsFrom(config), [config]);
  const [viewId, setViewId] = useState(views[0]?.id ?? "all");
  const view = views.find((v) => v.id === viewId) ?? views[0];

  useEffect(() => {
    onStateChange?.(viewId);
  }, [viewId, onStateChange]);

  const total = rows * cols;
  let hits = 0;
  for (let r = 1; r <= rows; r += 1) {
    for (let c = 1; c <= cols; c += 1) if (view && matches(view.rule, r, c)) hits += 1;
  }
  const probability = total === 0 ? 0 : hits / total;

  return (
    <figure className="space-y-4">
      {views.length > 1 && (
        <div
          className="bg-sunken flex flex-wrap gap-1.5 rounded-2xl p-1.5"
          role="group"
          aria-label="Event to highlight"
        >
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={v.id === viewId}
              onClick={() => setViewId(v.id)}
              className={`min-h-11 flex-1 basis-28 rounded-xl px-2 text-xs font-bold transition-colors sm:text-sm ${
                v.id === viewId
                  ? "bg-accent text-white shadow-card"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      <div className="border-line bg-surface rounded-card border p-3 shadow-card sm:p-4">
        <p className="text-ink-muted mb-2 text-center text-[0.7rem] font-bold tracking-wide uppercase">
          {colLabel} →
        </p>
        <div className="flex gap-2">
          <p
            className="text-ink-muted shrink-0 self-center text-[0.7rem] font-bold tracking-wide uppercase"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {rowLabel} →
          </p>
          <div
            className="grid flex-1 gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            role="table"
            aria-label={`${rows} by ${cols} grid of equally likely outcomes`}
          >
            {Array.from({ length: rows }, (_, ri) =>
              Array.from({ length: cols }, (_, ci) => {
                const r = ri + 1;
                const c = ci + 1;
                const on = view ? matches(view.rule, r, c) : false;
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex aspect-square items-center justify-center rounded-lg text-[0.6rem] font-bold transition-colors duration-300 sm:text-xs ${
                      on ? "bg-accent text-white" : "bg-sunken text-ink-muted/60"
                    }`}
                  >
                    <span className="sr-only">
                      {`${rowLabel} ${r}, ${colLabel} ${c}${on ? ", in the event" : ""}.`}
                    </span>
                    <span aria-hidden="true">{showSum ? r + c : `${r},${c}`}</span>
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div className="bg-accent-soft rounded-card px-5 py-4" aria-live="polite">
        <p className="text-accent-ink text-xs font-extrabold tracking-wide">
          {view?.label ?? "All outcomes"}
        </p>
        <p className="mt-1 text-3xl font-extrabold tabular-nums">
          {hits} / {total} = {(Math.round(probability * 1000) / 10).toFixed(1)}%
        </p>
      </div>

      <figcaption className="text-ink-muted text-sm">
        Every cell is one equally likely outcome, so a probability here is simply the share of cells
        the event covers.
      </figcaption>
    </figure>
  );
}
