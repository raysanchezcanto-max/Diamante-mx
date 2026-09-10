import type { Game, Standing, Leader } from "./mlb";

const MLB_API = "https://statsapi.mlb.com/api/v1";

const LMP_SPORT_ID = 17;
const LMP_LEAGUE_ID = 132;

/*
  La temporada de LMP cruza dos años.

  Ejemplo:
  octubre 2025 - enero 2026 = season 2025
  octubre 2026 - enero 2027 = season 2026

  Por eso, antes de octubre usamos el año anterior.
*/
function lmpSeasonYear() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const year = Number(
    parts.find((part) => part.type === "year")?.value
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  return month >= 10 ? year : year - 1;
}

function mexicoDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function lmpFetch(path: string) {
  const res = await fetch(`${MLB_API}${path}`, {
    next: {
      revalidate: 60,
    },
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`LMP API ${res.status}`);
  }

  return res.json();
}

/*
  JUEGOS DE HOY
*/
export async function getLmpGames(): Promise<Game[]> {
  try {
    const date = mexicoDate();

    const data = await lmpFetch(
      `/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&date=${date}&hydrate=linescore`
    );

    const games =
      data?.dates?.flatMap((d: any) => d.games ?? []) ?? [];

    return games.map((g: any) => ({
      id:
        g.gamePk,

      status:
        g.status?.abstractGameState ?? "Preview",

      detailedState:
        g.status?.detailedState ?? "Programado",

      awayId:
        g.teams?.away?.team?.id ?? 0,

      away:
        g.teams?.away?.team?.name ?? "Visitante",

      homeId:
        g.teams?.home?.team?.id ?? 0,

      home:
        g.teams?.home?.team?.name ?? "Local",

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
*/
export async function getLmpStandings(): Promise<
  Standing[]
> {
  try {
    const season = lmpSeasonYear();

    const data = await lmpFetch(
      `/standings?leagueId=${LMP_LEAGUE_ID}&season=${season}&standingsTypes=regularSeason&hydrate=team`
    );

    const rows: Standing[] = [];

    for (const record of data?.records ?? []) {
      for (const item of record?.teamRecords ?? []) {
        rows.push({
          /*
            Nuestro componente actual espera una
            "division". LMP no utiliza las divisiones
            de MLB, así que todos aparecen juntos.
          */
          division:
            "Liga Mexicana del Pacífico",

          teamId:
            item.team?.id ?? 0,

          team:
            item.team?.name ?? "Equipo",

          wins:
            item.wins ?? 0,

          losses:
            item.losses ?? 0,

          pct:
            item.winningPercentage ?? ".000",

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
*/
async function getLmpLeaderCategory(
  category: string
): Promise<Leader[]> {
  try {
    const season = lmpSeasonYear();

    const data = await lmpFetch(
      `/stats/leaders?leaderCategories=${category}&statGroup=hitting&season=${season}&leagueId=${LMP_LEAGUE_ID}&sportId=${LMP_SPORT_ID}&leaderGameTypes=R&limit=10`
    );

    const list =
      data?.leagueLeaders?.[0]?.leaders ?? [];

    return list.map((item: any) => ({
      rank:
        item.rank,

      playerId:
        item.person?.id ?? 0,

      name:
        item.person?.fullName ?? "Jugador",

      team:
        item.team?.name ?? "",

      value:
        String(item.value ?? "-"),
    }));
  } catch {
    return [];
  }
}

export async function getLmpLeaders() {
  const [avg, hr, hits] = await Promise.all([
    getLmpLeaderCategory("battingAverage"),
    getLmpLeaderCategory("homeRuns"),
    getLmpLeaderCategory("hits"),
  ]);

  return {
    avg,
    hr,
    hits,
  };
}
