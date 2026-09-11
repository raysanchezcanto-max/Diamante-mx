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
      `Recent games API ${res.status}`
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
      "Final",

    detailedState:
      g.status?.detailedState ??
      "Final",

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

export async function getRecentGames(
  league: LeagueCode
): Promise<Game[]> {
  try {
    /*
      Buscamos desde 14 días atrás
      hasta ayer para no duplicar
      los juegos que aparecen en
      "Juegos de hoy".
    */
    const end = new Date();
    end.setDate(end.getDate() - 1);

    const start = new Date();
    start.setDate(start.getDate() - 14);

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

    if (league === "LMB") {
      path =
        `/schedule?sportId=11` +
        `&leagueId=125` +
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

    const finishedGames =
      (data?.dates ?? [])
        .flatMap(
          (date: any) =>
            date.games ?? []
        )
        .filter(
          (game: any) =>
            game.status
              ?.abstractGameState ===
            "Final"
        )
        .sort(
          (a: any, b: any) =>
            new Date(
              b.gameDate
            ).getTime() -
            new Date(
              a.gameDate
            ).getTime()
        )
        .slice(0, 8);

    return finishedGames.map(mapGame);
  } catch {
    return [];
  }
}
