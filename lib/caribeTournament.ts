// Contrato de datos para el torneo 2027.
// Solo poblar con enfrentamientos, scores y decisiones verificados
// contra una fuente oficial. Hasta disponer de esa fuente,
 // se conserva null: nunca inventar resultados ni participantes.

export type CaribePhase =
  | "roundRobin"
  | "semifinal"
  | "thirdPlace"
  | "final";

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
  startTime?: string; // ISO-8601 y zona horaria explícita.
  winnerId?: string; // ganador publicado por la fuente oficial.
};

export type CaribeTournament = {
  season: 2027;
  matches: CaribeMatch[];
};

export type CaribeFinalWinner = {
  winner: CaribeTeam;
  runnerUp: CaribeTeam;
  winnerScore: number;
  runnerUpScore: number;
};

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

export async function getCaribeTournament2027():
  Promise<CaribeTournament | null> {
  // PENDIENTE: conectar un proveedor verificado del calendario /
  // marcadores 2027. No hay API fiable integrada todavía.
  return null;
}
