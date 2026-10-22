import type { Game, Standing, Leader } from "./mlb";

const MLB_API = "https://statsapi.mlb.com/api/v1";

const LMP_SPORT_ID = 17;
const LMP_LEAGUE_ID = 132;

/*
  Obtiene el Opening Day real de una temporada LMP
  desde el calendario oficial disponible en StatsAPI.
*/
export async function getLmpOpeningDay(
  season: number
): Promise<string | null> {
  try {
    const data = await lmpFetch(
      `/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&season=${season}&gameType=R`
    );

    const dates =
      Array.isArray(data?.dates)
        ? data.dates
        : [];

    const firstGameDay =
      dates.find(
        (item: any) =>
          item?.date &&
          Array.isArray(item?.games) &&
          item.games.length > 0
      );

    return firstGameDay?.date
      ? String(firstGameDay.date)
      : null;
  } catch {
    return null;
  }
}

/*
  Determina la temporada LMP activa.

  Antes del Opening Day de la nueva campaña:
  mantiene la temporada anterior.

  Desde Opening Day:
  cambia automáticamente a la nueva temporada.
*/
export async function getLmpSeasonYear():
  Promise<number> {
  const today =
    mexicoDate();

  const year =
    Number(
      today.slice(0, 4)
    );

  const month =
    Number(
      today.slice(5, 7)
    );

  const openingDay =
    await getLmpOpeningDay(
      year
    );

  if (openingDay) {
    return today >= openingDay
      ? year
      : year - 1;
  }


  season: number
): Promise<string | null> {
  try {
    const data = await lmpFetch(
      `/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&season=${season}&gameType=R`
    );

    const dates =
      Array.isArray(data?.dates)
        ? data.dates
        : [];

    const firstGameDay =
      dates.find(
        (item: any) =>
          item?.date &&
          Array.isArray(item?.games) &&
          item.games.length > 0
      );

    return firstGameDay?.date
      ? String(firstGameDay.date)
      : null;
  } catch {
    return null;
  }
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

    /*
      Primero buscamos juegos de hoy.
    */
    const todayData = await lmpFetch(
      `/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&date=${date}&hydrate=linescore`
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
      Si hoy no hay juegos, buscamos
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

    const upcomingData = await lmpFetch(
      `/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&startDate=${startDate}&endDate=${endDate}&hydrate=linescore`
    );

    /*
      Tomamos solamente la primera fecha
      futura que tenga partidos.
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
*/
export async function getLmpStandings(): Promise<
  Standing[]
> {
  try {
   const season =
  await getLmpSeasonYear();

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

    if (rows.length === 0) {
  return rows;
}

const leader = rows.reduce((best, row) => {
  const bestPct = Number(best.pct);
  const rowPct = Number(row.pct);

  return rowPct > bestPct
    ? row
    : best;
});

return rows.map((row) => {
  const gamesBack =
    (
      (leader.wins - row.wins) +
      (row.losses - leader.losses)
    ) / 2;

  return {
    ...row,
    gamesBack:
      gamesBack <= 0
        ? "-"
        : gamesBack.toFixed(1),
  };
});
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
 const season =
  await getLmpSeasonYear();

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
