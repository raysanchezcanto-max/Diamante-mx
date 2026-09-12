import type { LeagueCode } from "./teamLogos";

const MLB_API =
  "https://statsapi.mlb.com/api/v1.1";

export type GameDetails = {
  id: number;
  league: LeagueCode;

  status: string;
  detailedState: string;

  startTime: string;

  awayId: number;
  away: string;
  awayRuns?: number;

  homeId: number;
  home: string;
  homeRuns?: number;

  venue: string;

  inning?: number;
  inningState?: string;

  stage?: string;
};

/*
  Partidos LMB que actualmente estamos
  manejando mediante fallback porque
  StatsAPI no devuelve correctamente
  toda la Serie del Rey.
*/
const LMB_FALLBACK_GAMES:
  Record<number, GameDetails> = {
  [-2026091101]: {
    id: -2026091101,
    league: "LMB",
    status: "Preview",
    detailedState: "Programado",
    startTime:
      "2026-09-11T19:30:00-06:00",

    awayId: 0,
    away: "Toros de Tijuana",

    homeId: 0,
    home: "Olmecas de Tabasco",

    venue:
      "Estadio Centenario del 27 de Febrero",

    stage: "Serie del Rey",
  },

  [-2026091201]: {
    id: -2026091201,
    league: "LMB",
    status: "Preview",
    detailedState: "Programado",
    startTime:
      "2026-09-12T19:00:00-06:00",

    awayId: 0,
    away: "Toros de Tijuana",

    homeId: 0,
    home: "Olmecas de Tabasco",

    venue:
      "Estadio Centenario del 27 de Febrero",

    stage: "Serie del Rey",
  },

  [-2026090902]: {
    id: -2026090902,
    league: "LMB",
    status: "Final",
    detailedState: "Final",
    startTime:
      "2026-09-09T21:00:00-06:00",

    awayId: 0,
    away: "Olmecas de Tabasco",
    awayRuns: 2,

    homeId: 0,
    home: "Toros de Tijuana",
    homeRuns: 13,

    venue:
      "Estadio Chevron",

    stage: "Serie del Rey",
  },

  [-2026090801]: {
    id: -2026090801,
    league: "LMB",
    status: "Final",
    detailedState: "Final",
    startTime:
      "2026-09-08T21:00:00-06:00",

    awayId: 0,
    away: "Olmecas de Tabasco",
    awayRuns: 7,

    homeId: 0,
    home: "Toros de Tijuana",
    homeRuns: 1,

    venue:
      "Estadio Chevron",

    stage: "Serie del Rey",
  },
};

export async function getGameDetails(
  league: LeagueCode,
  gameId: number
): Promise<GameDetails | null> {
  /*
    Primero revisamos si es uno de nuestros
    partidos LMB administrados localmente.
  */
  if (
  league === "LMB" &&
  LMB_FALLBACK_GAMES[gameId]
) {
  const fallbackGame =
    LMB_FALLBACK_GAMES[gameId];

  if (gameId === -2026091101) {
    const now = new Date();

    const start =
      new Date(
        "2026-09-11T19:30:00-06:00"
      );

    const liveUntil =
      new Date(
        "2026-09-12T01:00:00-06:00"
      );

    if (
      now >= start &&
      now < liveUntil
    ) {
      return {
        ...fallbackGame,
        status: "Live",
        detailedState: "Serie del Rey",
      };
    }

    if (now >= liveUntil) {
      return {
        ...fallbackGame,
        status: "Final",
        detailedState: "Final",
      };
    }
  }

  return fallbackGame;
}

  try {
    const response = await fetch(
      `${MLB_API}/game/${gameId}/feed/live`,
      {
        next: {
          revalidate: 30,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const gameData = data?.gameData;
    const liveData = data?.liveData;

    const away =
      gameData?.teams?.away;

    const home =
      gameData?.teams?.home;

    const linescore =
      liveData?.linescore;

    return {
      id: gameId,
      league,

      status:
        gameData?.status
          ?.abstractGameState ??
        "Preview",

      detailedState:
        gameData?.status
          ?.detailedState ??
        "Programado",

      startTime:
        gameData?.datetime
          ?.dateTime ?? "",

      awayId:
        away?.id ?? 0,

      away:
        away?.name ??
        "Visitante",

      awayRuns:
        linescore?.teams
          ?.away?.runs,

      homeId:
        home?.id ?? 0,

      home:
        home?.name ??
        "Local",

      homeRuns:
        linescore?.teams
          ?.home?.runs,

      venue:
        gameData?.venue?.name ??
        "Estadio por confirmar",

      inning:
        linescore?.currentInning,

      inningState:
        linescore?.inningState,

      stage:
        league === "MLB"
          ? "MLB"
          : league,
    };
  } catch {
    return null;
  }
}
