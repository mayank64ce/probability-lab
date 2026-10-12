import type { ComponentType } from "react";
import type { VisualizationProps } from "./types";
import { StudentGrid } from "./StudentGrid";
import { EventVenn } from "./EventVenn";

/**
 * Visualizations are referenced from lesson content by key, so content stays
 * data and never imports React components directly.
 */
export const VISUALIZATIONS: Record<string, ComponentType<VisualizationProps>> = {
  "student-grid": StudentGrid,
  "event-venn": EventVenn,
};

export function Visualization({
  viz,
  config,
  onStateChange,
}: {
  viz: string;
  config?: Record<string, unknown>;
  onStateChange?: (state: string) => void;
}) {
  const Component = VISUALIZATIONS[viz];
  if (!Component) {
    return <p className="text-ink-muted text-sm">Visualization “{viz}” is not available.</p>;
  }
  return <Component config={config ?? {}} onStateChange={onStateChange} />;
}
