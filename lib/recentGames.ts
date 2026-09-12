import { getLmbCalendar } from "./lmbLive";
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
const LMB_RECENT_FALLBACK: Game[] = [
  {
    id: -2026090902,
    status: "Final",
    detailedState: "Final",
    awayId: 0,
    away: "Olmecas de Tabasco",
    homeId: 0,
    home: "Toros de Tijuana",
    awayRuns: 2,
    homeRuns: 13,
    startTime:
      "2026-09-09T21:00:00-06:00",
  },

  {
    id: -2026090801,
    status: "Final",
    detailedState: "Final",
    awayId: 0,
    away: "Olmecas de Tabasco",
    homeId: 0,
    home: "Toros de Tijuana",
    awayRuns: 7,
    homeRuns: 1,
    startTime:
      "2026-09-08T21:00:00-06:00",
  },
];

function lmbRecentFallback() {
  return LMB_RECENT_FALLBACK.filter(
    (game) =>
      new Date(game.startTime).getTime() <
      Date.now()
  );
}
function officialLmbTeamName(
  name: string
) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const teams: Record<string, string> = {
    toros: "Toros de Tijuana",
    caliente: "Caliente de Durango",
    sultanes: "Sultanes de Monterrey",
    charros: "Charros de Jalisco",
    acereros: "Acereros de Monclova",
    algodoneros: "Algodoneros de Unión Laguna",
    rieleros: "Rieleros de Aguascalientes",
    saraperos: "Saraperos de Saltillo",
    tecos: "Tecos de los Dos Laredos",
    dorados: "Dorados de Chihuahua",

    diablos: "Diablos Rojos del México",
    "diablos rojos": "Diablos Rojos del México",
    olmecas: "Olmecas de Tabasco",
    piratas: "Piratas de Campeche",
    pericos: "Pericos de Puebla",
    bravos: "Bravos de León",
    guerreros: "Guerreros de Oaxaca",
    aguila: "El Águila de Veracruz",
    "el aguila": "El Águila de Veracruz",
    tigres: "Tigres de Quintana Roo",
    conspiradores: "Conspiradores de Querétaro",
    leones: "Leones de Yucatán",
  };

  return teams[normalized] ?? name;
}
export async function getRecentGames(
  league: LeagueCode
): Promise<Game[]> {
  if (league === "LMB") {
  const days = await Promise.all(
    Array.from(
      { length: 14 },
      (_, index) =>
        getLmbCalendar(-(index + 1))
    )
  );

  const recentGames: Game[] =
    days
      .flat()
      .filter((g: any) => {
        const status =
          String(
            g.status ?? ""
          ).toUpperCase();

        const detailed =
          String(
            g.detailedStatus ?? ""
          ).toLowerCase();

        return (
          status === "F" ||
          detailed.includes("final")
        );
      })
      .map(
        (g: any): Game => ({
          id:
            Number(g.gameId) || 0,

          status: "Final",

          detailedState:
            "Final",

          awayId: 0,

          away:
            officialLmbTeamName(
              g.awayTeam?.name ??
                "Visitante"
            ),

          homeId: 0,

          home:
            officialLmbTeamName(
              g.localTeam?.name ??
                "Local"
            ),

          awayRuns:
            g.awayTeam?.runsScored,

          homeRuns:
            g.localTeam?.runsScored,

          inning:
            g.inning?.number,

          inningState:
            g.inning?.part,

          startTime:
            typeof g.date_time ===
            "number"
              ? new Date(
                  g.date_time * 1000
                ).toISOString()
              : "",
        })
      );

  return recentGames
    .sort(
      (a, b) =>
        new Date(
          b.startTime
        ).getTime() -
        new Date(
          a.startTime
        ).getTime()
    )
    .slice(0, 8);
}
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

    const mappedGames =
  finishedGames.map(mapGame);

if (
  league === "LMB" &&
  mappedGames.length === 0
) {
  return lmbRecentFallback();
}

return mappedGames;
      } catch {
    if (league === "LMB") {
      return lmbRecentFallback();
    }

    return [];
  }
}
