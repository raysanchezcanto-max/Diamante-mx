/**
 * Etiqueta de LMP para el último turno confirmado por la fuente.
 * Middle = acabó ALTA N; End = acabó BAJA N.
 * Nunca anuncia el siguiente turno hasta que llegue Top/Bottom.
 */
export function getLmpInningLabel(
  inningState?: string,
  inning?: number
): string | null {
  if (typeof inning !== "number" || !Number.isInteger(inning) || inning < 1) {
    return null;
  }
  const state = inningState?.trim().toLowerCase();
  if (state === "top" || state === "middle") {
    return `ALTA ${inning}`;
  }
  if (state === "bottom" || state === "end") {
    return `BAJA ${inning}`;
  }
  return null;
}
