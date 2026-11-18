/** "Up 6 points on last week." for the This week cards. */
export function describeDelta(delta: number | null | undefined): string {
  if (delta == null) return "Not enough data to compare yet.";
  if (delta === 0) return "Same as last week.";
  const n = Math.abs(delta);
  return `${delta > 0 ? "Up" : "Down"} ${n} ${n === 1 ? "point" : "points"} on last week.`;
}
