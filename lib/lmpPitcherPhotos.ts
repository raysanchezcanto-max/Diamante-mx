// Fuente común de retratos LMP para ABRIÓ/ABRIDOR y DECISIONES DE PITCHEO.
// El URL del calendario solo se utiliza cuando pertenece al mismo playerId;
// el retrato MiLB del mismo jugador es el respaldo, nunca el escudo del club.
export function getLmpPitcherPhotos(
  playerId?: number,
  officialImageUrl?: string
): string[] {
  if (!Number.isSafeInteger(playerId) || !playerId || playerId <= 0) {
    return [];
  }

  const official =
    typeof officialImageUrl === "string" &&
    officialImageUrl.startsWith(
      `https://images.cloudgfx.com/player/mugshot2/${playerId}?`
    )
      ? officialImageUrl
      : undefined;

  const milbPhoto =
    `https://img.mlbstatic.com/mlb-photos/image/upload/c_fill,g_auto/w_80/v1/people/${playerId}/headshot/milb/current`;

  return [...new Set([official, milbPhoto].filter((url): url is string => Boolean(url)))];
}
