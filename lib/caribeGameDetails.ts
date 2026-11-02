import "server-only";

import type { CaribeMatch } from "@/lib/caribeTournament";
import { getCaribeTournamentForYear } from "@/lib/caribeTournament";
import { baseballExtrasFromFeed } from "@/lib/baseballGameExtras";
import type { BaseballGameExtras } from "@/lib/baseballGameExtras";

const API = "https://statsapi.mlb.com/api/v1.1";

export type CaribeGameFeed = BaseballGameExtras & {
  match: CaribeMatch;
  venue?: string;
  currentPitcher?: { id: number; name: string };
};

// Solo permitir IDs pertenecientes a los calendarios auténticos de Serie
// del Caribe: evita mostrar accidentalmente un partido de MLB o LMP.
async function findVerifiedMatch(gameId: number): Promise<CaribeMatch | null> {
  const [current, history] = await Promise.all([
    getCaribeTournamentForYear(2027),
    getCaribeTournamentForYear(2026),
  ]);
  return (
    current?.matches.find((game) => Number(game.id) === gameId) ??
    history?.matches.find((game) => Number(game.id) === gameId) ??
    null
  );
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

export async function getCaribeGameFeed(gameId: number): Promise<CaribeGameFeed | null> {
  const match = await findVerifiedMatch(gameId);
  if (!match) return null;

  try {
    const res = await fetch(`${API}/game/${gameId}/feed/live`, {
      next: { revalidate: match.state === "Final" ? 86400 : 15 },
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) return null;
    const data: any = await res.json();

    // Comprobar también que el feed coincide con el encuentro autorizado.
    if (Number(data?.gamePk) !== gameId) return null;
    const ls = data?.liveData?.linescore;
    const box = data?.liveData?.boxscore;
    const players: Record<string, any> = data?.gameData?.players ?? {};
    const defender = ls?.defense?.pitcher;
    const pitcherId = finiteNumber(defender?.id);
    const currentPitcher = pitcherId
      ? {
          id: pitcherId,
          name: players[`ID${pitcherId}`]?.fullName ?? defender.fullName ?? "Por confirmar",
        }
      : undefined;
    return {
      ...baseballExtrasFromFeed(data),
      match,
      venue: data?.gameData?.venue?.name,
      currentPitcher,
    };
  } catch {
    return null;
  }
}
