/**
 * Fuente de series LMP. MLB StatsAPI publica las fases D (primera ronda),
 * L (semifinales) y W (Serie Final), con parejas y marcadores reales.
 * Se descartan por completo placeholders "To Be Determined": no suponer
 * participantes, fechas confirmadas, series ni ventajas deportivas.
 */
const MLB_API = "https://statsapi.mlb.com/api/v1";
const SPORT_ID = 17;
const LEAGUE_ID = 132;

export type LmpPostseasonPhase = "D" | "L" | "W";

export const LMP_PLAYOFF_PHASES: readonly LmpPostseasonPhase[] = ["D", "L", "W"];

export const LMP_PLAYOFF_PHASE_LABEL: Record<LmpPostseasonPhase, string> = {
  D: "Primera ronda",
  L: "Semifinales",
  W: "Serie Final",
};

export type LmpPlayoffGame = {
  id: number;
  date: string;
  gameNumber: number | null;
  startTimeTBD: boolean;
  status: "Final" | "Live" | "Preview";
  awayId: number;
  homeId: number;
  awayRuns: number | null;
  homeRuns: number | null;
};

export type LmpPlayoffTeam = {
  id: number;
  name: string;
  wins: number;
};

export type LmpPlayoffSeries = {
  key: string;
  phase: LmpPostseasonPhase;
  teamA: LmpPlayoffTeam;
  teamB: LmpPlayoffTeam;
  games: LmpPlayoffGame[];
  winnerId: number | null;
};

export type LmpPostseason = {
  season: number;
  currentPhase: LmpPostseasonPhase | null;
  series: LmpPlayoffSeries[];
};

function confirmedTeam(team: unknown): team is { id: number; name: string } {
  if (!team || typeof team !== "object") return false;
  const value = team as { id?: unknown; name?: unknown };
  return (
    typeof value.id === "number" &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    value.id !== 58 && // StatsAPI: "To Be Determined"
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    !/^(?:to be determined|tbd|por definir)$/i.test(value.name.trim())
  );
}

function finalState(game: any) {
  const abstract = String(game?.status?.abstractGameState ?? "").toLowerCase();
  const detail = String(game?.status?.detailedState ?? "").toLowerCase();
  return abstract === "final" || /^(final|completed|game over)/.test(detail);
}

function liveState(game: any) {
  const abstract = String(game?.status?.abstractGameState ?? "").toLowerCase();
  return abstract === "live" || abstract === "in progress";
}

function score(raw: unknown): number | null {
  return typeof raw === "number" && Number.isFinite(raw) && raw >= 0
    ? raw
    : null;
}

export function buildLmpPostseason(
  season: number,
  payload: unknown
): LmpPostseason | null {
  const dates = (payload as { dates?: unknown })?.dates;
  if (!Array.isArray(dates)) return null;

  const seriesMap = new Map<string, LmpPlayoffSeries>();
  const ids = new Set<number>();

  for (const day of dates) {
    const games = day?.games;
    if (!Array.isArray(games)) continue;

    for (const game of games) {
      const phase = game?.gameType as LmpPostseasonPhase;
      if (!LMP_PLAYOFF_PHASES.includes(phase)) continue;

      const away = game?.teams?.away?.team;
      const home = game?.teams?.home?.team;
      if (!confirmedTeam(away) || !confirmedTeam(home) || away.id === home.id) continue;

      const id = Number(game?.gamePk);
      if (!Number.isInteger(id) || id <= 0 || ids.has(id)) continue;
      ids.add(id);

      const [teamA, teamB] = [away, home].sort((a, b) => a.id - b.id);
      const key = `${phase}-${teamA.id}-${teamB.id}`;
      let series = seriesMap.get(key);

      if (!series) {
        series = {
          key,
          phase,
          teamA: { id: teamA.id, name: teamA.name, wins: 0 },
          teamB: { id: teamB.id, name: teamB.name, wins: 0 },
          games: [],
          winnerId: null,
        };
        seriesMap.set(key, series);
      }

      const result: LmpPlayoffGame = {
        id,
        date: typeof game?.gameDate === "string" ? game.gameDate : "",
        gameNumber: Number.isInteger(game?.seriesGameNumber) &&
          game.seriesGameNumber > 0 ? game.seriesGameNumber : null,
        startTimeTBD: Boolean(game?.status?.startTimeTBD),
        status: finalState(game) ? "Final" : liveState(game) ? "Live" : "Preview",
        awayId: away.id,
        homeId: home.id,
        awayRuns: score(game?.teams?.away?.score),
        homeRuns: score(game?.teams?.home?.score),
      };
      series.games.push(result);

      // Contar solo juegos concluidos con resultado oficial y sin empate.
      if (
        result.status === "Final" &&
        result.awayRuns !== null &&
        result.homeRuns !== null &&
        result.awayRuns !== result.homeRuns
      ) {
        const wonId = result.awayRuns > result.homeRuns ? away.id : home.id;
        if (series.teamA.id === wonId) series.teamA.wins++;
        else series.teamB.wins++;
      }
    }
  }

  const result = [...seriesMap.values()];
  if (!result.length) return null;

  result.forEach((series) => {
    series.games.sort((a, b) =>
      a.date.localeCompare(b.date) || a.id - b.id
    );
    if (series.teamA.wins >= 4) series.winnerId = series.teamA.id;
    else if (series.teamB.wins >= 4) series.winnerId = series.teamB.id;
  });

  result.sort((a, b) =>
    LMP_PLAYOFF_PHASES.indexOf(a.phase) - LMP_PLAYOFF_PHASES.indexOf(b.phase) ||
    a.games[0].date.localeCompare(b.games[0].date) ||
    a.key.localeCompare(b.key)
  );

  const live = result.find(series =>
    !series.winnerId && series.games.some(game => game.status === "Live")
  );

  const currentPhase = live?.phase ??
    LMP_PLAYOFF_PHASES.find(phase =>
      result.some(series => series.phase === phase && !series.winnerId)
    ) ??
    // Cuando termina primera ronda y aún no están sembradas las semifinales,
    // mantener visible la ronda terminada, NO declarar concluida postemporada.
    (result.some(series => series.phase === "W" && series.winnerId)
      ? null
      : result[result.length - 1]?.phase ?? null);

  return { season, currentPhase, series: result };
}

export async function getLmpPostseason(
  season: number
): Promise<LmpPostseason | null> {
  if (!Number.isInteger(season) || season < 2020 || season > 2100) return null;

  try {
    const response = await fetch(
      `${MLB_API}/schedule?sportId=${SPORT_ID}&leagueId=${LEAGUE_ID}&season=${season}&startDate=${season + 1}-01-01&endDate=${season + 1}-02-10`,
      {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!response.ok) return null;
    return buildLmpPostseason(season, await response.json());
  } catch {
    return null;
  }
}
