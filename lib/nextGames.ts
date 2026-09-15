import {
  getLmbCalendar,
} from "./lmbLive";
import type { Game } from "./mlb";
import type { LeagueCode } from "./teamLogos";

const MLB_API =
  "https://statsapi.mlb.com/api/v1";

function mexicoDate(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

async function scheduleFetch(path: string) {
  const res = await fetch(
    `${MLB_API}${path}`,
    {
      next: {
        revalidate: 60,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(
      `Schedule API ${res.status}`
    );
  }

  return res.json();
}

function mapGame(g: any): Game {
  return {
    id:
      g.gamePk,

    status:
      g.status?.abstractGameState ??
      "Preview",

    detailedState:
      g.status?.detailedState ??
      "Programado",

    awayId:
      g.teams?.away?.team?.id ?? 0,

    away:
      g.teams?.away?.team?.name ??
      "Visitante",

    homeId:
      g.teams?.home?.team?.id ?? 0,

    home:
      g.teams?.home?.team?.name ??
      "Local",

    awayRuns:
      g.teams?.away?.score,

    homeRuns:
      g.teams?.home?.score,

    inning:
      g.linescore?.currentInning,

    inningState:
      g.linescore?.inningState,

    startTime:
      g.gameDate,
  };
}

/*
  Fallback temporal para la Serie
  del Rey LMB 2026.

  Solamente se utiliza si la fuente
  de calendario no devuelve partidos.
*/
const LMB_SERIE_DEL_REY_2026: Game[] = [
  {
    id: -2026091101,
    status: "Preview",
    detailedState: "Programado",
    awayId: 0,
    away: "Toros de Tijuana",
    homeId: 0,
    home: "Olmecas de Tabasco",
    startTime:
      "2026-09-11T19:30:00-06:00",
  },

  {
    id: -2026091201,
    status: "Preview",
    detailedState: "Programado",
    awayId: 0,
    away: "Toros de Tijuana",
    homeId: 0,
    home: "Olmecas de Tabasco",
    startTime:
      "2026-09-12T19:00:00-06:00",
  },

  {
    id: -2026091301,
    status: "Preview",
    detailedState:
      "De ser necesario",
    awayId: 0,
    away: "Toros de Tijuana",
    homeId: 0,
    home: "Olmecas de Tabasco",
    startTime:
      "2026-09-13T18:00:00-06:00",
  },

  {
    id: -2026091501,
    status: "Preview",
    detailedState:
      "De ser necesario",
    awayId: 0,
    away: "Olmecas de Tabasco",
    homeId: 0,
    home: "Toros de Tijuana",
    startTime:
      "2026-09-15T20:35:00-06:00",
  },

  {
    id: -2026091601,
    status: "Preview",
    detailedState:
      "De ser necesario",
    awayId: 0,
    away: "Olmecas de Tabasco",
    homeId: 0,
    home: "Toros de Tijuana",
    startTime:
      "2026-09-16T20:35:00-06:00",
  },
];

function lmbFallbackNextGames() {
  const futureGames =
    LMB_SERIE_DEL_REY_2026.filter(
      (game) =>
        new Date(game.startTime).getTime() >
        Date.now()
    );

  if (futureGames.length === 0) {
    return [];
  }

  const firstDate = mexicoDate(
    new Date(futureGames[0].startTime)
  );

  return futureGames.filter(
    (game) =>
      mexicoDate(
        new Date(game.startTime)
      ) === firstDate
  );
}

export async function getNextGames(
  league: LeagueCode
): Promise<Game[]> {
  try {
        if (league === "LMB") {
      for (
        let offset = 1;
        offset <= 60;
        offset++
      ) {
        const officialGames =
          await getLmbCalendar(offset);

        if (
          !Array.isArray(officialGames) ||
          officialGames.length === 0
        ) {
          continue;
        }

        return officialGames.map(
          (g: any): Game => {
            const rawStatus =
              String(
                g.status ?? ""
              ).toUpperCase();

            const status =
              rawStatus === "L"
                ? "Live"
                : rawStatus === "F"
                  ? "Final"
                  : "Preview";

            const startTime =
              typeof g.date_time === "number"
                ? new Date(
                    g.date_time * 1000
                  ).toISOString()
                : typeof g.date_time ===
                    "string"
                  ? new Date(
                      g.date_time
                    ).toISOString()
                  : "";

            return {
              id:
                Number(g.gameId) || 0,

              status,

              detailedState:
                g.detailedStatus ??
                (status === "Live"
                  ? "En vivo"
                  : status === "Final"
                    ? "Final"
                    : "Programado"),

              awayId: 0,
              away:
                g.awayTeam?.name ??
                "Visitante",

              homeId: 0,
              home:
                g.localTeam?.name ??
                "Local",

              awayRuns:
                g.awayTeam?.runsScored,

              homeRuns:
                g.localTeam?.runsScored,

              inning:
                g.inning?.number,

              inningState:
                g.inning?.part,

              startTime,
            };
          }
        );
      }

      return [];
    }
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 60);

    const startDate =
      mexicoDate(start);

    const endDate =
      mexicoDate(end);

    let path = "";

    if (league === "MLB") {
      path =
        `/schedule?sportId=1` +
        `&startDate=${startDate}` +
        `&endDate=${endDate}` +
        `&hydrate=linescore`;
    }

   

    if (league === "LMP") {
      path =
        `/schedule?sportId=17` +
        `&leagueId=132` +
        `&startDate=${startDate}` +
        `&endDate=${endDate}` +
        `&hydrate=linescore`;
    }

    const data =
      await scheduleFetch(path);

    const nextDate =
      data?.dates?.find(
        (date: any) =>
          Array.isArray(date.games) &&
          date.games.length > 0
      );

    const games =
      nextDate?.games ?? [];

    if (games.length > 0) {
      return games.map(mapGame);
    }

    /*
      Si la API no devuelve el calendario
      futuro de LMB, usamos el fallback.
    */
   

    return [];
  } catch {
    if (league === "LMB") {
      return lmbFallbackNextGames();
    }

    return [];
  }
}
