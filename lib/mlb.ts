const MLB_API = "https://statsapi.mlb.com/api/v1";
function getMlbDivisionName(
  divisionId: number
): string {
  const divisions: Record<number, string> = {
  200: "Liga Americana Oeste",
  201: "Liga Americana Este",
  202: "Liga Americana Central",
  203: "Liga Nacional Oeste",
  204: "Liga Nacional Este",
  205: "Liga Nacional Central",
};

  return divisions[divisionId] ?? "División";
}


export type Game = {
  id: number;
  status: string;
  detailedState: string;
  firstPitchRecorded?: boolean;
  
gameNumber?: number;
doubleHeader?: string;


  awayId: number;
  away: string;

  homeId: number;
  home: string;
  
awayProbablePitcher?: {
  id: number;
  name: string;
};

homeProbablePitcher?: {
  id: number;
  name: string;
};


  awayRuns?: number;
  homeRuns?: number;

  inning?: number;
  inningState?: string;
gameType?: string;
seriesDescription?: string;
seriesGameNumber?: number;
gamesInSeries?: number;
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

async function attachFirstPitchRecorded(
  games: Game[]
): Promise<Game[]> {
  return Promise.all(
    games.map(async (game) => {
      const shouldCheck =
        /^(live|in progress)$/i.test(game.status) ||
        /warm[\s-]?up/i.test(game.detailedState);

      if (!shouldCheck) {
        return game;
      }

      try {
        const response = await fetch(
          `${MLB_API}/game/${game.id}/playByPlay`,
          {
            next: { revalidate: 15 },
          }
        );

        if (!response.ok) {
          return game;
        }

        const data = await response.json();

        if (
          !Array.isArray(data?.allPlays) &&
          !data?.currentPlay
        ) {
          return game;
        }

        const plays = Array.isArray(data?.allPlays)
          ? [...data.allPlays]
          : [];

        if (data?.currentPlay) {
          plays.push(data.currentPlay);
        }

        const firstPitchRecorded = plays.some(
          (play: any) =>
            Array.isArray(play?.playEvents) &&
            play.playEvents.some(
              (event: any) => event?.isPitch === true
            )
        );

        return {
          ...game,
          firstPitchRecorded,
        };
      } catch {
        return game;
      }
    })
  );
}

export async function getGames(): Promise<Game[]> {
  try {
    const date = mexicoDate();

    /*
      Primero buscamos los juegos de hoy.
    */
    const todayData = await mlbFetch(
     
`/schedule?sportId=1&date=${date}&hydrate=linescore,probablePitcher`

    );

    const todayGames =
      todayData?.dates?.flatMap(
        (d: any) => d.games ?? []
      ) ?? [];

    /*
      Si hay juegos hoy, usamos esos.
    */
    if (todayGames.length > 0) {
      const gamesForToday: Game[] = todayGames.map((g: any) => ({
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
        
awayProbablePitcher:
  g.teams?.away?.probablePitcher?.id &&
  g.teams?.away?.probablePitcher?.fullName
    ? {
        id: g.teams.away.probablePitcher.id,
        name: g.teams.away.probablePitcher.fullName,
      }
    : undefined,

homeProbablePitcher:
  g.teams?.home?.probablePitcher?.id &&
  g.teams?.home?.probablePitcher?.fullName
    ? {
        id: g.teams.home.probablePitcher.id,
        name: g.teams.home.probablePitcher.fullName,
      }
    : undefined,


        awayRuns:
          g.teams?.away?.score,

        homeRuns:
          g.teams?.home?.score,

        inning:
          g.linescore?.currentInning,

        inningState:
          g.linescore?.inningState,
        gameType:
  g.gameType ?? "",

seriesDescription:
  g.seriesDescription ?? "",

seriesGameNumber:
  g.seriesGameNumber
    ? Number(g.seriesGameNumber)
    : undefined,

gamesInSeries:
  g.gamesInSeries
    ? Number(g.gamesInSeries)
    : undefined,
  
        startTime:
          g.gameDate,
      }));
      return await attachFirstPitchRecorded(gamesForToday);
    }

    /*
      Si hoy no hay juegos, buscamos
      la siguiente fecha con actividad.
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

    const upcomingData = await mlbFetch(
      
`/schedule?sportId=1&startDate=${startDate}&endDate=${endDate}&hydrate=linescore,probablePitcher`

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
      
awayProbablePitcher:
  g.teams?.away?.probablePitcher?.id &&
  g.teams?.away?.probablePitcher?.fullName
    ? {
        id: g.teams.away.probablePitcher.id,
        name: g.teams.away.probablePitcher.fullName,
      }
    : undefined,

homeProbablePitcher:
  g.teams?.home?.probablePitcher?.id &&
  g.teams?.home?.probablePitcher?.fullName
    ? {
        id: g.teams.home.probablePitcher.id,
        name: g.teams.home.probablePitcher.fullName,
      }
    : undefined,


      awayRuns:
        g.teams?.away?.score,

      homeRuns:
        g.teams?.home?.score,

      inning:
        g.linescore?.currentInning,

     
inningState:
  g.linescore?.inningState,

gameType:
  g.gameType ?? "",

startTime:
  g.gameDate,

    }));
  } catch {
    return [];
  }
}
  

export async function getStandings(): Promise<Standing[]> {
  try {
   const currentSeason =
  seasonYear();

let season =
  currentSeason;

let data =
  await mlbFetch(
    `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team`
  );

const hasCurrentSeasonData =
  Array.isArray(data?.records) &&
  data.records.length > 0;

if (!hasCurrentSeasonData) {
  season =
    currentSeason - 1;

  data =
    await mlbFetch(
      `/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team`
    );
}

    const rows: Standing[] = [];

    for (const record of data?.records ?? []) {
      const division =
  getMlbDivisionName(
    Number(record?.division?.id ?? 0)
  );

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
   const currentSeason =
  seasonYear();

let season =
  currentSeason;

let data =
  await mlbFetch(
    `/stats/leaders?leaderCategories=${category}&statGroup=hitting&season=${season}&sportId=1&limit=10`
  );

let list =
  data?.leagueLeaders?.[0]?.leaders ?? [];

if (
  !Array.isArray(list) ||
  list.length === 0
) {
  season =
    currentSeason - 1;

  data =
    await mlbFetch(
      `/stats/leaders?leaderCategories=${category}&statGroup=hitting&season=${season}&sportId=1&limit=10`
    );

  list =
    data?.leagueLeaders?.[0]?.leaders ?? [];
}
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
