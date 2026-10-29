
export type GameSpecialStatus =
  | "POSPUESTO"
  | "SUSPENDIDO"
  | "RETRASADO";

export function getGameSpecialStatus(
  detailedState?: string | null
): GameSpecialStatus | null {
  const state = String(
    detailedState ?? ""
  ).trim().toLowerCase();

  if (
    /postponed|postponement|pospuest|aplazad/.test(
      state
    )
  ) {
    return "POSPUESTO";
  }

  if (
    /suspended|suspension|suspendid|suspensi[oó]n/.test(
      state
    )
  ) {
    return "SUSPENDIDO";
  }

  if (
    /delayed|delay|retrasad|retraso|demorad|demora/.test(
      state
    )
  ) {
    return "RETRASADO";
  }

  return null;
}
