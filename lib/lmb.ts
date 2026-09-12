import { getLmbLiveScore } from "./lmbLive";
import type {
  Game,
  Standing,
  Leader,
} from "./mlb";

const MLB_API =
  "https://statsapi.mlb.com/api/v1";

const LMB_SPORT_ID = 11;
const LMB_LEAGUE_ID = 125;

function mexicoDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function seasonYear() {
  return Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      year: "numeric",
    }).format(new Date())
  );
}

async function lmbFetch(path: string) {
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
      `LMB API ${res.status}`
    );
  }

  return res.json();
}

/*
  JUEGOS DEL DÍA

  No limitamos a temporada regular.
  Así también pueden aparecer juegos
  de playoffs y Serie del Rey.
*/
export async function getLmbGames():
  Promise<Game[]> {
  try {
    const date = mexicoDate();

    /*
      Primero buscamos juegos de hoy.
    */
    const todayData = await lmbFetch(
      `/schedule?sportId=${LMB_SPORT_ID}&leagueId=${LMB_LEAGUE_ID}&date=${date}&hydrate=linescore`
    );

    const todayGames =
      todayData?.dates?.flatMap(
        (d: any) => d.games ?? []
      ) ?? [];

    /*
      Si hay juegos hoy, mostramos esos.
    */
    if (todayGames.length > 0) {
      return todayGames.map((g: any) => ({
        id: g.gamePk,

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
      }));
    }
    /*
  Fallback Serie del Rey 2026.
  La API de LMB no está devolviendo
  correctamente este juego de postemporada.
*/
   const liveScore =
  await getLmbLiveScore(867488);

if (liveScore) {
  return [
    {
      id: -2026091101,

      status: liveScore.status,

      detailedState:
        liveScore.status === "Live"
          ? "Serie del Rey"
          : liveScore.status === "Final"
            ? "Final"
            : "Programado",

      awayId: 0,
      away: "Toros de Tijuana",

      homeId: 0,
      home: "Olmecas de Tabasco",

      awayRuns:
        liveScore.awayRuns,

      homeRuns:
        liveScore.homeRuns,

      inning: undefined,
      inningState: undefined,

      startTime:
        "2026-09-11T19:30:00-06:00",
    },
  ];
}
const now = new Date();

const serieDelReyStart =
  new Date("2026-09-11T19:30:00-06:00");

const serieDelReyLiveUntil =
  new Date("2026-09-12T01:00:00-06:00");

if (
  date === "2026-09-11" &&
  now >= serieDelReyStart &&
  now < serieDelReyLiveUntil
) {
  return [
    {
      id: -2026091101,

      status: "Live",
      detailedState: "Serie del Rey",

      awayId: 0,
      away: "Toros de Tijuana",

      homeId: 0,
      home: "Olmecas de Tabasco",

      awayRuns: undefined,
      homeRuns: undefined,

      inning: undefined,
      inningState: undefined,

      startTime:
        "2026-09-11T19:30:00-06:00",
    },
  ];
}

    /*
      Si no hay juegos hoy, buscamos
      hasta 60 días hacia adelante.
    */
    const start = new Date();
    start.setDate(start.getDate() + 1);

    const end = new Date();
    end.setDate(end.getDate() + 60);

    const startDate =
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(start);

    const endDate =
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(end);

    const upcomingData = await lmbFetch(
      `/schedule?sportId=${LMB_SPORT_ID}&leagueId=${LMB_LEAGUE_ID}&startDate=${startDate}&endDate=${endDate}&hydrate=linescore`
    );

    /*
      Elegimos solamente la primera
      fecha futura que tenga partidos.
    */
    const nextDate =
      upcomingData?.dates?.find(
        (d: any) =>
          Array.isArray(d.games) &&
          d.games.length > 0
      );

    const nextGames =
      nextDate?.games ?? [];

    return nextGames.map((g: any) => ({
      id: g.gamePk,

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
    }));
  } catch {
    return [];
  }
}

/*
  TABLA DE POSICIONES
  TEMPORADA REGULAR
*/
export async function getLmbStandings():
  Promise<Standing[]> {
  function getLmbZone(teamName: string) {
  const normalized = teamName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const northTeams = [
    "toros de tijuana",
    "caliente de durango",
    "sultanes de monterrey",
    "charros de jalisco",
    "acereros del norte",
    "acereros de monclova",
    "algodoneros union laguna",
    "algodoneros de union laguna",
    "rieleros de aguascalientes",
    "saraperos de saltillo",
    "tecos de los dos laredos",
    "dorados de chihuahua",
  ];

  return northTeams.includes(normalized)
    ? "Zona Norte"
    : "Zona Sur";
}
  try {
    const season = seasonYear();

    const data = await lmbFetch(
      `/standings?leagueId=${LMB_LEAGUE_ID}&season=${season}&standingsTypes=regularSeason&hydrate=team`
    );

    const rows: Standing[] = [];

    for (
      const record of data?.records ?? []
    ) {
      const division =
        record?.division?.nameShort ??
        record?.division?.name ??
        "LMB";

      for (
        const item of
          record?.teamRecords ?? []
      ) {
        rows.push({
         division:
  getLmbZone(
    item.team?.name ?? ""
  ),
          teamId:
            item.team?.id ?? 0,

          team:
            item.team?.name ??
            "Equipo",

          wins:
            item.wins ?? 0,

          losses:
            item.losses ?? 0,

          pct:
            item.winningPercentage ??
            ".000",

          gamesBack:
            item.gamesBack ?? "-",
        });
      }
    }

    return rows;
  } catch {
    return [];
  }
}

/*
  LÍDERES DE BATEO
  TEMPORADA REGULAR
*/
async function getLmbLeaderCategory(
  category: string
): Promise<Leader[]> {
  try {
    const season = seasonYear();

    const data = await lmbFetch(
      `/stats/leaders?leaderCategories=${category}&statGroup=hitting&season=${season}&leagueId=${LMB_LEAGUE_ID}&sportId=${LMB_SPORT_ID}&leaderGameTypes=R&limit=10`
    );

    const list =
      data?.leagueLeaders?.[0]
        ?.leaders ?? [];

    return list.map(
      (item: any) => ({
        rank:
          item.rank,

        playerId:
          item.person?.id ?? 0,

        name:
          item.person?.fullName ??
          "Jugador",

        team:
          item.team?.name ?? "",

        value:
          String(
            item.value ?? "-"
          ),
      })
    );
  } catch {
    return [];
  }
}

export async function getLmbLeaders() {
  const [avg, hr, hits] =
    await Promise.all([
      getLmbLeaderCategory(
        "battingAverage"
      ),

      getLmbLeaderCategory(
        "homeRuns"
      ),

      getLmbLeaderCategory(
        "hits"
      ),
    ]);

  return {
    avg,
    hr,
    hits,
  };
}
