/**
 * Every visualization takes an opaque config from lesson content and may
 * report a state string back, which a `visual` exercise grades against its
 * `solvedWhen` value.
 */
export interface VisualizationProps {
  config: Record<string, unknown>;
  onStateChange?: (state: string) => void;
}

export function numberFrom(config: Record<string, unknown>, key: string, fallback: number): number {
  const value = config[key];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
