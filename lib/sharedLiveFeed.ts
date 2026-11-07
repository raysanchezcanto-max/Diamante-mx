import { cache } from "react";

// MLB y LMP consumen el mismo feed oficial para la situación en vivo y
// los datos complementarios. Compartirlo únicamente durante este render
// evita descargas duplicadas y diferencias de instante entre paneles.
// cache() es por solicitud de React: NO conserva jugadas entre refrescos.
export const getSharedLiveFeed = cache(async (gameId: number): Promise<any | null> => {
  if (!Number.isSafeInteger(gameId) || gameId <= 0) return null;

  try {
    const response = await fetch(
      `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return null;

    const data = await response.json();
    return Number(data?.gamePk) === gameId ? data : null;
  } catch {
    return null;
  }
});
