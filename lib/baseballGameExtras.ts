import "server-only";
import { getLmbGameInfo } from "@/lib/lmbLive";
import type { LeagueCode } from "@/lib/teamLogos";

export type BaseballStatPlayer = {
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
export type BaseballTeamStats = {
  batters: BaseballStatPlayer[];
  pitchers: BaseballStatPlayer[];
  starter?: BaseballStatPlayer;
};
export type BaseballLineScore = {
  lines: { number: number; away?: number; home?: number }[];
  totals?: {
    away: { runs?: number; hits?: number; errors?: number };
    home: { runs?: number; hits?: number; errors?: number };
  };
};
export type BaseballDecision = { label: string; name: string; playerId?: number; teamName?: string };
export type BaseballGameExtras = BaseballLineScore & {
  awayStats: BaseballTeamStats;
  homeStats: BaseballTeamStats;
  decisions: BaseballDecision[];
};
const emptyTeam = (): BaseballTeamStats => ({ batters: [], pitchers: [] });
export const finiteBaseballNumber = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

// Solo jugadores con participación ofensiva real. Evita filas de pitchers
// sin batear, conservando pinch runners, BB, HBP y carreras anotadas.
export function baseballTeamStats(raw: any): BaseballTeamStats {
  const players: Record<string, any> = raw?.players ?? {};
  function select(ids: unknown, kind: "batting" | "pitching"): BaseballStatPlayer[] {
    if (!Array.isArray(ids)) return [];
    const used = new Set<number>();
    return ids.flatMap((candidate) => {
      const id = Number(candidate);
      if (!Number.isSafeInteger(id) || id <= 0 || used.has(id)) return [];
      used.add(id);
      const player = players[`ID${id}`];
      const name = player?.person?.fullName;
      const stats = player?.stats?.[kind];
      if (!stats || typeof name !== "string" || !name.trim()) return [];
      if (kind === "batting") {
        const counts = [
          stats.plateAppearances, stats.atBats, stats.hits, stats.runs,
          stats.rbi, stats.baseOnBalls, stats.hitByPitch, stats.sacFlies,
          stats.sacBunts, stats.stolenBases, stats.caughtStealing,
        ];
        if (!counts.some((n) => typeof n === "number" && n > 0)) return [];
      } else {
        const pitches = finiteBaseballNumber(stats.numberOfPitches);
        const outs = finiteBaseballNumber(stats.outs);
        const ip = typeof stats.inningsPitched === "string" ? stats.inningsPitched : "";
        if (!(pitches != null && pitches > 0) && !(outs != null && outs > 0) &&
            (!ip || ip === "0.0")) return [];
      }
      return [{
        id, name,
        atBats: finiteBaseballNumber(stats.atBats),
        hits: finiteBaseballNumber(stats.hits),
        runs: finiteBaseballNumber(stats.runs),
        rbi: finiteBaseballNumber(stats.rbi),
        homeRuns: finiteBaseballNumber(stats.homeRuns),
        inningsPitched: typeof stats.inningsPitched === "string" ? stats.inningsPitched : undefined,
        earnedRuns: finiteBaseballNumber(stats.earnedRuns),
        strikeOuts: finiteBaseballNumber(stats.strikeOuts),
        walks: finiteBaseballNumber(stats.baseOnBalls),
        pitches: finiteBaseballNumber(stats.numberOfPitches),
      }];
    });
  }
  const pitchers = select(raw?.pitchers, "pitching");
  return { batters: select(raw?.batters, "batting"), pitchers, starter: pitchers[0] };
}

export function baseballDecisions(
  raw: any,
  boxscoreTeams?: any,
  gameTeams?: any,
): BaseballDecision[] {
  const sideOf = (playerId: number): "away" | "home" | null => {
    // Relacionar por ID con el boxscore oficial; nunca deducir el club
    // a partir del nombre, el marcador o el rol ganador/perdedor.
    const key = `ID${playerId}`;
    const away = Boolean(boxscoreTeams?.away?.players?.[key]);
    const home = Boolean(boxscoreTeams?.home?.players?.[key]);
    if (away === home) return null;
    return away ? "away" : "home";
  };

  return ([
    ["PITCHER GANADOR", raw?.winner],
    ["PITCHER PERDEDOR", raw?.loser],
    ["SALVAMENTO", raw?.save],
  ] as const).flatMap(([label, value]) => {
    const name = typeof value?.fullName === "string"
      ? value.fullName.trim()
      : "";
    if (!name) return [];
    const playerId =
      typeof value.id === "number" && Number.isSafeInteger(value.id) && value.id > 0
        ? value.id
        : undefined;
    const side = playerId ? sideOf(playerId) : null;
    const officialTeam = side ? gameTeams?.[side]?.name : null;
    const teamName = typeof officialTeam === "string" && officialTeam.trim()
      ? officialTeam.trim()
      : undefined;
    return [{ label, name, playerId, teamName }];
  });
}

export function baseballExtrasFromFeed(data: any): BaseballGameExtras {
  const linescore = data?.liveData?.linescore;
  const innings: any[] = Array.isArray(linescore?.innings) ? linescore.innings : [];
  const mapTotal = (raw: any) => ({
    runs: finiteBaseballNumber(raw?.runs),
    hits: finiteBaseballNumber(raw?.hits),
    errors: finiteBaseballNumber(raw?.errors),
  });
  return {
    lines: innings.map((entry) => ({
      number: Number(entry?.num ?? 0),
      away: finiteBaseballNumber(entry?.away?.runs),
      home: finiteBaseballNumber(entry?.home?.runs),
    })).filter((line) => Number.isSafeInteger(line.number) && line.number > 0),
    totals: linescore?.teams ? {
      away: mapTotal(linescore.teams.away),
      home: mapTotal(linescore.teams.home),
    } : undefined,
    awayStats: baseballTeamStats(data?.liveData?.boxscore?.teams?.away),
    homeStats: baseballTeamStats(data?.liveData?.boxscore?.teams?.home),
    decisions: baseballDecisions(
      data?.liveData?.decisions,
      data?.liveData?.boxscore?.teams,
      data?.gameData?.teams,
    ),
  };
}

export async function getBaseballGameExtras(
  league: LeagueCode,
  gameId: number,
): Promise<BaseballGameExtras | null> {
  if (!Number.isSafeInteger(gameId) || gameId <= 0) return null;
  if (league === "LMB") {
    // LMB y MLB Stats API comparten gamePk. Verificación 846674:
    // Conspiradores–Leones 11–5, mismos nombres, pitchers y decisiones.
    // La API LMB permanece de respaldo para marcador por entradas.
    const game = await getLmbGameInfo(gameId);
    if (!game) return null;

    const fallback: BaseballGameExtras = {
      lines: Array.isArray(game.lineScore)
        ? game.lineScore.map((entry: any) => ({
            number: Number(entry?.inningNumber ?? 0),
            away: finiteBaseballNumber(entry?.awayTeamRuns),
            home: finiteBaseballNumber(entry?.homeTeamRuns),
          })).filter((line: { number: number }) =>
            Number.isSafeInteger(line.number) && line.number > 0)
        : [],
      totals: {
        away: {
          runs: finiteBaseballNumber(game?.awayTeam?.runsScored),
          hits: finiteBaseballNumber(game?.awayTeam?.totalHits),
          errors: finiteBaseballNumber(game?.awayTeam?.totalErrors),
        },
        home: {
          runs: finiteBaseballNumber(game?.localTeam?.runsScored),
          hits: finiteBaseballNumber(game?.localTeam?.totalHits),
          errors: finiteBaseballNumber(game?.localTeam?.totalErrors),
        },
      },
      awayStats: emptyTeam(),
      homeStats: emptyTeam(),
      decisions: [],
    };

    try {
      const response = await fetch(
        `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`,
        { next: { revalidate: 15 }, signal: AbortSignal.timeout(7500) },
      );
      if (!response.ok) return fallback;
      const data = await response.json();
      if (Number(data?.gamePk) !== gameId ||
          !data?.liveData?.boxscore?.teams) return fallback;

      // Comprobar pertenencia con los nombres de ambos clubes y evitar
      // aplicar estadísticas de otra competición por error.
      const normalized = (v: unknown) => typeof v === "string"
        ? v.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
        : "";
      const matchName = (official: unknown, feed: unknown) => {
        const a = normalized(official), b = normalized(feed);
        return Boolean(a && b && (a.includes(b) || b.includes(a)));
      };
      if (!matchName(game.awayTeam?.name, data?.gameData?.teams?.away?.name) ||
          !matchName(game.localTeam?.name, data?.gameData?.teams?.home?.name)) {
        return fallback;
      }

      const parsed = baseballExtrasFromFeed(data);
      return {
        ...parsed,
        lines: parsed.lines.length ? parsed.lines : fallback.lines,
        totals: parsed.totals ?? fallback.totals,
      };
    } catch {
      return fallback;
    }
  }
  try {
    const response = await fetch(
      `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`,
      { next: { revalidate: 15 }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (Number(data?.gamePk) !== gameId) return null;
    return baseballExtrasFromFeed(data);
  } catch { return null; }
}
