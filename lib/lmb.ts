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

    const data = await lmbFetch(
      `/schedule?sportId=${LMB_SPORT_ID}&leagueId=${LMB_LEAGUE_ID}&date=${date}&hydrate=linescore`
    );

    const games =
      data?.dates?.flatMap(
        (d: any) => d.games ?? []
      ) ?? [];

    return games.map((g: any) => ({
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
          division,

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
