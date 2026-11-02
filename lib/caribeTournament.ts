// Serie del Caribe en MLB Stats API: sportId 17, leagueId 162.
// Verificado con los 13 partidos reales de febrero de 2026.
// El torneo 2027 no tiene juegos publicados al 2/nov/2026.
// No deducir la final ni el tercer lugar solo por el orden horario.

const API_URL = "https://statsapi.mlb.com/api/v1";
const CARIBE_LEAGUE_ID = 162;

export type CaribePhase = "roundRobin" | "semifinal" | "thirdPlace" | "final";

export type CaribeGameState =
  | "Preview"
  | "Warmup"
  | "Live"
  | "Final"
  | "Postponed";

export type CaribeTeam = {
  id: string;
  name: string;
  logoSrc?: string;
  flagSrc?: string;
};

export type CaribeMatch = {
  id: string;
  phase: CaribePhase;
  state: CaribeGameState;
  home?: CaribeTeam;
  away?: CaribeTeam;
  homeScore?: number;
  awayScore?: number;
  startTime?: string;
  inning?: number;
  inningState?: string;
  firstPitchRecorded?: boolean;
  winnerId?: string; // Resultado oficial final y marcador consistente.
};

export type CaribeTournament = {
  season: 2026 | 2027;
  matches: CaribeMatch[];
};

export type CaribeFinalWinner = {
  winner: CaribeTeam;
  runnerUp: CaribeTeam;
  winnerScore: number;
  runnerUpScore: number;
};

type SourceTeam = {
  team?: { id?: number; name?: string };
  score?: number;
  isWinner?: boolean;
};

type SourceGame = {
  gamePk?: number;
  officialDate?: string;
  gameDate?: string;
  description?: string;
  status?: { abstractGameState?: string; detailedState?: string };
  teams?: { away?: SourceTeam; home?: SourceTeam };
  linescore?: { currentInning?: number; inningState?: string };
};

type SourceSchedule = {
  dates?: { date?: string; games?: SourceGame[] }[];
};

function flagForOfficialTeam(name: string): string | undefined {
  const text = name.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (text.includes("mexico")) return "/flags/mx.svg";
  if (text.includes("puerto rico")) return "/flags/pr.svg";
  if (text.includes("dominican") || text.includes("dominicana")) return "/flags/do.svg";
  if (text.includes("venezuela")) return "/flags/ve.svg";
  // Para países invitados nuevos, no adivinar una bandera.
  return undefined;
}

function mapTeam(source?: SourceTeam): CaribeTeam | undefined {
  const id = source?.team?.id;
  const name = source?.team?.name?.trim();
  if (!name || typeof id !== "number" || !Number.isInteger(id)) {
    return undefined;
  }
  return { id: String(id), name, flagSrc: flagForOfficialTeam(name) };
}

function phaseFromOfficialData(game: SourceGame, year: 2026 | 2027): CaribePhase | null {
  const date = game.officialDate?.slice(0, 10) ?? "";
  if (!date.startsWith(year + "-02-")) return null;
  const description = (game.description ?? "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  // MLB asigna "Semifinal 1/2" y "Championship Game" a los
  // encuentros de 2026; priorizar la etiqueta oficial.
  // La etiqueta "Semifinal 1: 3rd place at 2nd place" señala
  // posiciones de la tabla, NO un juego por el tercer lugar.
  if (/semifinal/.test(description)) return "semifinal";
  if (/championship|grand\s*final|final\s*game|gran\s*final|campeonato/.test(description)) {
    return "final";
  }
  if (/third\s*place\s*game|3rd\s*place\s*game|game\s*for\s*third\s*place|juego\s*por\s*el\s*tercer\s*lugar|tercer\s*lugar/.test(description)) {
    return "thirdPlace";
  }

  const day = Number(date.slice(8, 10));
  if (day >= 1 && day <= 5) return "roundRobin";
  if (day === 6) return "semifinal";

  // El 7/feb/2027 habrá dos partidos; sin descripción explícita
  // no decidir cuál es tercero ni final por la hora.
  return null;
}

function gameState(game: SourceGame): CaribeGameState {
  const status = game.status?.abstractGameState ?? "";
  const detail = game.status?.detailedState ?? "";
  if (/postponed|suspended|cancelled|pospuesto|suspendido/i.test(detail)) {
    return "Postponed";
  }
  if (status === "Final") return "Final";
  // Un juego con etiqueta de calentamiento todavía no está EN VIVO.
  if (/warm[\s-]?up|calentamiento/i.test(detail)) return "Warmup";
  if (status === "Live") return "Live";
  return "Preview";
}

function mapOfficialGame(game: SourceGame, year: 2026 | 2027): CaribeMatch | null {
  const phase = phaseFromOfficialData(game, year);
  if (!phase || typeof game.gamePk !== "number") return null;

  const away = mapTeam(game.teams?.away);
  const home = mapTeam(game.teams?.home);
  const state = gameState(game);
  const awayScore = game.teams?.away?.score;
  const homeScore = game.teams?.home?.score;

  let winnerId: string | undefined;
  if (
    state === "Final" && home && away &&
    typeof homeScore === "number" && typeof awayScore === "number" &&
    homeScore !== awayScore
  ) {
    // El estado Final y los tanteos proceden de la fuente MLB.
    const inferred = homeScore > awayScore ? home.id : away.id;
    const declared =
      game.teams?.home?.isWinner === true ? home.id :
      game.teams?.away?.isWinner === true ? away.id : undefined;
    if (!declared || declared === inferred) winnerId = inferred;
  }

  return {
    id: String(game.gamePk),
    phase,
    state,
    away,
    home,
    awayScore: typeof awayScore === "number" ? awayScore : undefined,
    homeScore: typeof homeScore === "number" ? homeScore : undefined,
    startTime: game.gameDate,
    inning: game.linescore?.currentInning,
    inningState: game.linescore?.inningState,
    winnerId,
  };
}

// Misma señal de primer lanzamiento que usamos en MLB/LMP.
// Se consulta solo para partidos marcados Live, nunca para toda la jornada.
async function verifyFirstPitch(game: CaribeMatch): Promise<CaribeMatch> {
  if (game.state !== "Live") return game;
  try {
    const res = await fetch(
      `${API_URL}/game/${game.id}/playByPlay`,
      {
        next: { revalidate: 15 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return game;
    const payload: {
      allPlays?: { playEvents?: { isPitch?: boolean }[] }[];
      currentPlay?: { playEvents?: { isPitch?: boolean }[] };
    } = await res.json();
    if (!Array.isArray(payload.allPlays) && !payload.currentPlay) {
      return game;
    }
    const plays = [
      ...(Array.isArray(payload.allPlays) ? payload.allPlays : []),
      ...(payload.currentPlay ? [payload.currentPlay] : []),
    ];
    const firstPitchRecorded = plays.some((play) =>
      play.playEvents?.some((event) => event.isPitch === true),
    );
    return {
      ...game,
      firstPitchRecorded,
      state: firstPitchRecorded ? "Live" : "Warmup",
    };
  } catch {
    // No inferir que no hubo lanzamientos si falló la consulta.
    return game;
  }
}

export async function getCaribeTournamentForYear(
  year: 2026 | 2027,
): Promise<CaribeTournament | null> {
  const query = new URLSearchParams({
    sportId: "17",
    leagueId: String(CARIBE_LEAGUE_ID),
    startDate: year + "-02-01",
    endDate: year + "-02-07",
    hydrate: "linescore",
  });
  try {
    const response = await fetch(API_URL + "/schedule?" + query.toString(), {
      next: { revalidate: year === 2027 ? 30 : 86400 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as SourceSchedule;
    if (!Array.isArray(data?.dates)) return null;
    const mapped = data.dates
      .flatMap((date) => Array.isArray(date.games) ? date.games : [])
      .map((game) => mapOfficialGame(game, year))
      .filter((game): game is CaribeMatch => game !== null);
    if (mapped.length === 0) return null;
    const seen = new Set<string>();
    const unique = mapped.filter((game) => {
      if (seen.has(game.id)) return false;
      seen.add(game.id);
      return true;
    }).sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
    const matches = await Promise.all(unique.map(verifyFirstPitch));
    return { season: year, matches };
  } catch {
    // Fallo de red: página queda en modo espera; nada inventado.
    return null;
  }
}

export function resolveCaribeFinalWinner(
  match: CaribeMatch | null
): CaribeFinalWinner | null {
  if (
    !match ||
    match.phase !== "final" ||
    match.state !== "Final" ||
    !match.home ||
    !match.away ||
    typeof match.homeScore !== "number" ||
    typeof match.awayScore !== "number" ||
    !Number.isFinite(match.homeScore) ||
    !Number.isFinite(match.awayScore) ||
    match.homeScore === match.awayScore ||
    !match.winnerId
  ) {
    return null;
  }

  if (
    match.winnerId === match.home.id &&
    match.homeScore > match.awayScore
  ) {
    return {
      winner: match.home,
      runnerUp: match.away,
      winnerScore: match.homeScore,
      runnerUpScore: match.awayScore,
    };
  }

  if (
    match.winnerId === match.away.id &&
    match.awayScore > match.homeScore
  ) {
    return {
      winner: match.away,
      runnerUp: match.home,
      winnerScore: match.awayScore,
      runnerUpScore: match.homeScore,
    };
  }

  return null;
}


export async function getCaribeTournament2027(): Promise<CaribeTournament | null> {
  return getCaribeTournamentForYear(2027);
}
