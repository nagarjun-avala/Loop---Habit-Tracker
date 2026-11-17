export const HEATMAP_DAYS = 84; // 12 weeks

/** Mock contribution levels 0-4, oldest first, trending upward. Deterministic so SSR and client match. */
export function buildHeatmap(): number[] {
  let seed = 7;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  return Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const bias = 0.35 + (i / HEATMAP_DAYS) * 0.5;
    const r = rand() * 0.75 + bias * 0.45;
    return r < 0.3 ? 0 : r < 0.5 ? 1 : r < 0.7 ? 2 : r < 0.88 ? 3 : 4;
  });
}
