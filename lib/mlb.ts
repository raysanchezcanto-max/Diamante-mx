const MLB_API = "https://statsapi.mlb.com/api/v1";

export type Game = {
  id: number;
  status: string;
  detailedState: string;

  awayId: number;
  away: string;

  homeId: number;
  home: string;

  awayRuns?: number;
  homeRuns?: number;

  inning?: number;
  inningState?: string;

  startTime: string;
};

export type Standing = {
  division: string;

  teamId: number;
  team: string;

  wins: number;
  losses: number;
  pct: string;
  gamesBack: string;
};

export type Leader = {
 export type Leader = {
  rank: number;
  playerId: number;
  name: string;
  team: string;
  value: string;
};

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

async function mlbFetch(path: string) {
  const res = await fetch(`${MLB_API}${path}`, {
    next: { revalidate: 60 },
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`MLB API ${res.status}`);
  }

  return res.json();
}

export async function getGames(): Promise<Game[]> {
  try {
    const date = mexicoDate();

    const data = await mlbFetch(
      `/schedule?sportId=1&date=${date}&hydrate=linescore`
    );

    const games =
      data?.dates?.flatMap((d: any) => d.games ?? []) ?? [];

    return games.map((g: any) => ({
      id: g.gamePk,

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

export async function getStandings(): Promise<Standing[]> {
  try {
    const season = seasonYear();

    const data = await mlbFetch(
      `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team`
    );

    const rows: Standing[] = [];

    for (const record of data?.records ?? []) {
      const division =
        record?.division?.nameShort ??
        record?.division?.name ??
        "División";

      for (const item of record?.teamRecords ?? []) {
        rows.push({
          division,

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

async function getLeaderCategory(
  category: string
): Promise<Leader[]> {
  try {
    const season = seasonYear();

    const data = await mlbFetch(
      `/stats/leaders?leaderCategories=${category}&statGroup=hitting&season=${season}&sportId=1&limit=10`
    );

    const list =
      data?.leagueLeaders?.[0]?.leaders ?? [];

    return list.map((item: any) => ({
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

export async function getLeaders() {
  const [avg, hr, hits] = await Promise.all([
    getLeaderCategory("battingAverage"),
    getLeaderCategory("homeRuns"),
    getLeaderCategory("hits"),
  ]);

  return {
    avg,
    hr,
    hits,
  };
}
