import { cache } from "react";

const MLB_API = "https://statsapi.mlb.com/api/v1";

/**
 * Reports an LMP MLB.TV *archive listing* only when the exact gamePk and
 * scheduled start are matched and MLB explicitly marks one of its TV
 * broadcasts MEDIA_ARCHIVE + availableForStreaming.
 *
 * This does NOT verify a playable full-game recording or any customer's
 * subscription, territory, or playback entitlement.
 */
export const getLmpMlbTvArchiveCatalog = cache(async (
  gamePk: number,
  startTime: string | undefined,
): Promise<string | null> => {
  if (!Number.isSafeInteger(gamePk) || gamePk <= 0 || !startTime) return null;
  const expectedStart = Date.parse(startTime);
  if (!Number.isFinite(expectedStart)) return null;

  try {
    const response = await fetch(
      `${MLB_API}/schedule?gamePk=${gamePk}&hydrate=broadcasts`,
      {
        next: { revalidate: 120 },
        signal: AbortSignal.timeout(5500),
        headers: { Accept: "application/json" },
      },
    );
    if (!response.ok) return null;
    const json: unknown = await response.json();
    if (!json || typeof json !== "object") return null;

    const record = json as { dates?: unknown };
    const dates = Array.isArray(record.dates) ? record.dates : [];
    const matched: Array<{
      gamePk?: unknown;
      gameDate?: unknown;
      broadcasts?: unknown;
    }> = [];

    for (const day of dates) {
      if (!day || typeof day !== "object") continue;
      const games = (day as { games?: unknown }).games;
      if (!Array.isArray(games)) continue;
      for (const game of games) {
        if (!game || typeof game !== "object") continue;
        const g = game as {
          gamePk?: unknown; gameDate?: unknown; broadcasts?: unknown;
        };
        if (Number(g.gamePk) !== gamePk || typeof g.gameDate !== "string") continue;
        const actualStart = Date.parse(g.gameDate);
        if (Number.isFinite(actualStart) &&
            Math.abs(actualStart - expectedStart) <= 60_000) matched.push(g);
      }
    }
    // Reprogrammed games and doubleheaders must never inherit another
    // date's or gamePk's archive state.
    if (matched.length !== 1) return null;

    const broadcasts = matched[0].broadcasts;
    if (!Array.isArray(broadcasts)) return null;
    const hasArchive = broadcasts.some(item => {
      if (!item || typeof item !== "object") return false;
      const b = item as Record<string, unknown>;
      const state = b.mediaState;
      if (!state || typeof state !== "object") return false;
      return String(b.type ?? "").toUpperCase() === "TV" &&
        typeof b.name === "string" &&
        /\bmlb\.tv\b/i.test(b.name) &&
        b.availableForStreaming === true &&
        (state as Record<string, unknown>).mediaStateCode === "MEDIA_ARCHIVE";
    });
    if (!hasArchive) return null;

    // Seasonal LMP schedule: NOT a paid playback URL, a per-game watch URL,
    // or proof that this archive is currently accessible.
    const date = new Date(expectedStart);
    const month = date.getUTCMonth();
    const seasonStartYear = month <= 2 ? date.getUTCFullYear() - 1 : date.getUTCFullYear();
    if (seasonStartYear < 2020 || seasonStartYear > 2100) return null;
    return `https://www.mlb.com/live-stream-games/lmp/${seasonStartYear}-schedule`;
  } catch {
    return null;
  }
});
