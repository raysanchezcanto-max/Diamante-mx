import "server-only";

import type { CaribeMatch } from "@/lib/caribeTournament";
import { getCaribeTournamentForYear } from "@/lib/caribeTournament";
import { translateBaseballText } from "@/lib/translateBaseball";

const API = "https://statsapi.mlb.com/api/v1.1";

export type CaribeStatPlayer = {
  id: number;
  name: string;
  atBats?: number;
  hits?: number;
  runs?: number;
  rbi?: number;
  homeRuns?: number;
  inningsPitched?: string;
  earnedRuns?: number;
  strikeOuts?: number;
  walks?: number;
  pitches?: number;
};

export type CaribeGameTeamStats = {
  batters: CaribeStatPlayer[];
  pitchers: CaribeStatPlayer[];
  starter?: CaribeStatPlayer;
};

export type CaribeGameFeed = {
  match: CaribeMatch;
  venue?: string;
  lines: { number: number; away?: number; home?: number }[];
  totals?: {
    away: { runs?: number; hits?: number; errors?: number };
    home: { runs?: number; hits?: number; errors?: number };
  };
  awayStats: CaribeGameTeamStats;
  homeStats: CaribeGameTeamStats;
  currentPitcher?: { id: number; name: string };
  decisions: { label: string; name: string }[];
  scoringPlays: string[];
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

function getTeamPlayers(raw: any): CaribeGameTeamStats {
  const entries: Record<string, any> = raw?.players ?? {};
  function select(ids: unknown, kind: "batting" | "pitching"): CaribeStatPlayer[] {
    if (!Array.isArray(ids)) return [];
    const seen = new Set<number>();
    return ids.flatMap((entry) => {
      const id = Number(entry);
      if (!Number.isInteger(id) || id <= 0 || seen.has(id)) return [];
      seen.add(id);
      const player = entries[`ID${id}`];
      const name = player?.person?.fullName;
      const stats = player?.stats?.[kind];
      if (typeof name !== "string" || !name.trim() || !stats) return [];
      return [{
        id,
        name,
        atBats: finiteNumber(stats.atBats),
        hits: finiteNumber(stats.hits),
        runs: finiteNumber(stats.runs),
        rbi: finiteNumber(stats.rbi),
        homeRuns: finiteNumber(stats.homeRuns),
        inningsPitched: typeof stats.inningsPitched === "string" ? stats.inningsPitched : undefined,
        earnedRuns: finiteNumber(stats.earnedRuns),
        strikeOuts: finiteNumber(stats.strikeOuts),
        walks: finiteNumber(stats.baseOnBalls),
        pitches: finiteNumber(stats.numberOfPitches),
      }];
    });
  }
  const pitchers = select(raw?.pitchers, "pitching");
  return {
    batters: select(raw?.batters, "batting"),
    pitchers,
    starter: pitchers[0],
  };
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
    const decisionsRaw = data?.liveData?.decisions ?? {};
    const decisions = ([
      ["GANADOR", decisionsRaw.winner],
      ["PERDEDOR", decisionsRaw.loser],
      ["SALVAMENTO", decisionsRaw.save],
    ] as const).flatMap(([label, player]) =>
      typeof player?.fullName === "string" ? [{ label, name: player.fullName }] : []
    );

    // Resumen breve de las últimas anotaciones, sin reescribir la historia.
    const allPlays: any[] = Array.isArray(data?.liveData?.plays?.allPlays)
      ? data.liveData.plays.allPlays
      : [];
    const scoring = allPlays
      .filter((play) => play?.about?.isComplete === true &&
        (play?.about?.isScoringPlay === true || Number(play?.result?.rbi ?? 0) > 0) &&
        typeof play?.result?.description === "string")
      .slice(-6);
    const scoringPlays = await Promise.all(scoring.map(async (play) =>
      translateBaseballText(play.result.description)
    ));

    const innings = Array.isArray(ls?.innings) ? ls.innings : [];
    return {
      match,
      venue: data?.gameData?.venue?.name,
      lines: innings.map((i: any) => ({
        number: Number(i?.num ?? 0),
        away: finiteNumber(i?.away?.runs),
        home: finiteNumber(i?.home?.runs),
      })).filter((i: { number: number }) => i.number > 0),
      totals: ls?.teams ? {
        away: {
          runs: finiteNumber(ls.teams.away?.runs),
          hits: finiteNumber(ls.teams.away?.hits),
          errors: finiteNumber(ls.teams.away?.errors),
        },
        home: {
          runs: finiteNumber(ls.teams.home?.runs),
          hits: finiteNumber(ls.teams.home?.hits),
          errors: finiteNumber(ls.teams.home?.errors),
        },
      } : undefined,
      awayStats: getTeamPlayers(box?.teams?.away),
      homeStats: getTeamPlayers(box?.teams?.home),
      currentPitcher,
      decisions,
      scoringPlays,
    };
  } catch {
    return null;
  }
}
