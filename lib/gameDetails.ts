import {
  getOfficialLmbTeamName,
} from "./lmb";
import type { LeagueCode } from "./teamLogos";
import {
  getLmbGameInfo,
} from "./lmbLive";

const MLB_API =
  "https://statsapi.mlb.com/api/v1.1";

export type GameDetails = {
  id: number;
  league: LeagueCode;

  status: string;
  detailedState: string;
 
  firstPitchRecorded?: boolean;
 
  gameNumber?: number;
  doubleHeader?: string;
  
  secondGameTimeVerified?: boolean;


  awayProbablePitcher?: {
    id: number;
    name: string;
    imageUrl?: string;
  };

  homeProbablePitcher?: {
    id: number;
    name: string;
    imageUrl?: string;
  };

  // Lanzadores que realmente iniciaron el encuentro LMP.
  awayStartingPitcher?: { id: number; name: string; imageUrl?: string };
  homeStartingPitcher?: { id: number; name: string; imageUrl?: string };
  awayStarterReplaced?: boolean;
  homeStarterReplaced?: boolean;

  startTime: string;
  
  startTimeTBD?: boolean;




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

async function verifyLmpSecondGameTime(
  gameId: number,
  gameData: any
): Promise<boolean> {
  const startTime = gameData?.datetime?.dateTime;
  const officialDate = gameData?.datetime?.officialDate;

  if (
    gameData?.game?.doubleHeader !== "Y" ||
    gameData?.game?.gameNumber !== 2 ||
    gameData?.status?.startTimeTBD !== false ||
    typeof startTime !== "string" ||
    !Number.isFinite(Date.parse(startTime)) ||
    typeof officialDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(officialDate)
  ) {
    return false;
  }

  try {
    const response = await fetch(
      "https://statsapi.mlb.com/api/v1/schedule" +
        `?sportId=17&leagueId=132` +
        `&startDate=${officialDate}` +
        `&endDate=${officialDate}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) return false;

    const data = await response.json();

    const games: any[] = (
      Array.isArray(data?.dates) ? data.dates : []
    ).flatMap((day: any) =>
      Array.isArray(day.games) ? day.games : []
    );

    const secondGame = games.find(
      (g: any) =>
        g.gamePk === gameId &&
        g.gameNumber === 2 &&
        g.doubleHeader === "Y" &&
        g.status?.startTimeTBD === false &&
        typeof g.gameDate === "string" &&
        Date.parse(g.gameDate) === Date.parse(startTime)
    );

    const firstGame = games.find(
      (g: any) =>
        g.gamePk !== gameId &&
        g.gameNumber === 1 &&
        g.teams?.away?.team?.id ===
          gameData?.teams?.away?.id &&
        g.teams?.home?.team?.id ===
          gameData?.teams?.home?.id &&
        typeof g.gameDate === "string" &&
        Date.parse(g.gameDate) <
          Date.parse(startTime)
    );

    return Boolean(secondGame && firstGame);
  } catch {
    return false;
  }
}

// Respaldo exclusivo de LMP: el calendario puede anunciar probables
// antes de que aparezcan en el feed individual del partido.
// Comparar gamePk exacto para no mezclar juegos de doble cartelera.
// Solo LMP: usar el mismo scoreboard oficial que alimenta ROL DE JUEGOS.
// StatsAPI /schedule no publica estos probables para la jornada 3/nov/2026.
// Verificar ID del juego y ambos equipos para evitar dobles carteleras cruzadas.
async function getLmpScheduleProbables(
  gameId: number,
  officialDate: unknown,
  awayTeamId: unknown,
  homeTeamId: unknown
): Promise<{
  away?: GameDetails["awayProbablePitcher"];
  home?: GameDetails["homeProbablePitcher"];
} | null> {
  if (
    typeof officialDate !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(officialDate) ||
    typeof awayTeamId !== "number" ||
    typeof homeTeamId !== "number" ||
    awayTeamId <= 0 ||
    homeTeamId <= 0
  ) {
    return null;
  }

  try {
    const datePath = officialDate.replace(/-/g, "/");
    const response = await fetch(
      `https://api.lmp.mx/3.0.0/scoreboard/${datePath}`,
      { next: { revalidate: 60 }, signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) return null;

    const data = await response.json();
    const games: any[] = Array.isArray(data?.response) ? data.response : [];
    const game = games.find((item: any) =>
      Number(item?.boxScore) === gameId &&
      Number(item?.awayTeamId) === awayTeamId &&
      Number(item?.homeTeamId) === homeTeamId
    );
    if (!game) return null;

    const parsePitcher = (
      name: unknown,
      playerId: unknown,
      rawImage: unknown
    ): GameDetails["awayProbablePitcher"] => {
      const id = Number(playerId);
      if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        typeof name !== "string" ||
        !name.trim()
      ) {
        return undefined;
      }
      const imageUrl =
        typeof rawImage === "string" &&
        rawImage.startsWith(
          `https://images.cloudgfx.com/player/mugshot2/${id}?`
        )
          ? rawImage
          : undefined;
      return { id, name: name.trim(), imageUrl };
    };

    return {
      away: parsePitcher(
        game.awayProbablePitcher,
        game.awayProbablePitcherMlbid,
        game.awayProbablePitcherImg
      ),
      home: parsePitcher(
        game.homeProbablePitcher,
        game.homeProbablePitcherMlbid,
        game.homeProbablePitcherImg
      ),
    };
  } catch {
    // Un dato no publicado o un fallo de red no crea pitchers ficticios.
    return null;
  }
}

export async function getGameDetails(
  league: LeagueCode,
  gameId: number
): Promise<GameDetails | null> {
    if (
    league === "LMB" &&
    gameId > 0
  ) {
    const lmbGame =
      await getLmbGameInfo(gameId);

    if (lmbGame) {
      const rawStatus =
        String(
          lmbGame.status ?? ""
        ).toUpperCase();

      const status =
        rawStatus === "L"
          ? "Live"
          : rawStatus === "F"
            ? "Final"
            : "Preview";

      let startTime = "";

      if (
        typeof lmbGame.date_time ===
        "number"
      ) {
        startTime =
          new Date(
            lmbGame.date_time * 1000
          ).toISOString();
      } else if (
        typeof lmbGame.date_time ===
        "string"
      ) {
        const parsedDate =
          new Date(lmbGame.date_time);

        if (
          !Number.isNaN(
            parsedDate.getTime()
          )
        ) {
          startTime =
            parsedDate.toISOString();
        }
      }

      const venue =
        typeof lmbGame.venue ===
        "string"
          ? lmbGame.venue
          : lmbGame.venue?.name ??
            (typeof lmbGame.stadium ===
            "string"
              ? lmbGame.stadium
              : lmbGame.stadium?.name) ??
            "Estadio por confirmar";

     
      return {
        id: gameId,
        league: "LMB",

        gameNumber:
          lmbGame.gameNumber === 1 ||
          lmbGame.gameNumber === 2
            ? lmbGame.gameNumber
            : undefined,

        doubleHeader:
          lmbGame.doubleHeader === "Y" ||
          lmbGame.doubleHeader === "S"
            ? lmbGame.doubleHeader
            : undefined,

        status,


        detailedState:
          lmbGame.detailedStatus ??
          (status === "Live"
            ? "En vivo"
            : status === "Final"
              ? "Final"
              : "Programado"),

        startTime,

        awayId:
          Number(
            lmbGame.awayTeam?.id ??
            lmbGame.awayTeam?.teamId ??
            0
          ),
away:
  getOfficialLmbTeamName(
    lmbGame.awayTeam?.name ??
      "Visitante"
  ),

awayRuns:
  status === "Preview"
    ? undefined
    : lmbGame.awayTeam?.runsScored,

homeId:
  Number(
    lmbGame.localTeam?.id ??
      lmbGame.localTeam?.teamId ??
      0
  ),

home:
  getOfficialLmbTeamName(
    lmbGame.localTeam?.name ??
      "Local"
  ),

homeRuns:
  status === "Preview"
    ? undefined
    : lmbGame.localTeam?.runsScored,

        venue,

        inning:
          lmbGame.inning?.number,

        inningState:
          lmbGame.inning?.part,

        stage: "LMB",
      };
    }
  }
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
          // LMP EN VIVO se refresca cada 15 s. Evitar que el encabezado
          // permanezca detrás de la situación por caché de 30 s.
          revalidate: 10,
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
    
const lmpPlays = [
  ...(Array.isArray(liveData?.plays?.allPlays)
    ? liveData.plays.allPlays
    : []),
  ...(liveData?.plays?.currentPlay
    ? [liveData.plays.currentPlay]
    : []),
];

const firstPitchRecorded =
  league === "LMP" &&
  (
    Array.isArray(liveData?.plays?.allPlays) ||
    Boolean(liveData?.plays?.currentPlay)
  )
    ? lmpPlays.some(
        (play: any) =>
          Array.isArray(play?.playEvents) &&
          play.playEvents.some(
            (event: any) =>
              event?.isPitch === true
          )
      )
    : undefined;

    // Abridores reales: primer lanzador con pitcheos registrados
    // por equipo. Los cambios se detectan por un ID diferente.
    const getLmpPitchersUsed = (
      side: "away" | "home"
    ): Array<{ id: number; name: string }> => {
      if (league !== "LMP") return [];

      const defendingHalf =
        side === "home" ? "top" : "bottom";
      const recordedIds = new Set<number>();
      const used: Array<{ id: number; name: string }> = [];

      for (const play of lmpPlays) {
        if (play?.about?.halfInning !== defendingHalf) {
          continue;
        }

        if (
          !Array.isArray(play?.playEvents) ||
          !play.playEvents.some(
            (event: any) => event?.isPitch === true
          )
        ) {
          continue;
        }

        const pitcher = play?.matchup?.pitcher;
        const id = pitcher?.id;
        if (typeof id !== "number" || recordedIds.has(id)) {
          continue;
        }

        const name =
          pitcher?.fullName ??
          liveData?.boxscore?.teams?.[side]
            ?.players?.[`ID${id}`]?.person?.fullName ??
          gameData?.players?.[`ID${id}`]?.fullName;

        if (typeof name !== "string" || !name.trim()) {
          continue;
        }

        used.push({ id, name });
        recordedIds.add(id);
      }

      return used;
    };

    const awayPitchersUsed = getLmpPitchersUsed("away");
    const homePitchersUsed = getLmpPitchersUsed("home");

    // Mantener la lógica P. PROBABLE → ABRIDOR → ABRIÓ.
    // El fallback únicamente alimenta los datos PREVIOS del partido.
    const feedAwayProbable =
      typeof gameData?.probablePitchers?.away?.id === "number" &&
      typeof gameData?.probablePitchers?.away?.fullName === "string"
        ? {
            id: gameData.probablePitchers.away.id,
            name: gameData.probablePitchers.away.fullName,
          }
        : undefined;
    const feedHomeProbable =
      typeof gameData?.probablePitchers?.home?.id === "number" &&
      typeof gameData?.probablePitchers?.home?.fullName === "string"
        ? {
            id: gameData.probablePitchers.home.id,
            name: gameData.probablePitchers.home.fullName,
          }
        : undefined;

    const gameState = gameData?.status?.abstractGameState;
    const isBeforeFirstPitch =
      gameState === "Preview" ||
      (gameState === "Live" && firstPitchRecorded !== true);
    // La LMP publica fotografías de pitchers probables en su scoreboard.
    // También lo consultamos DURANTE el juego, pero solo reutilizamos su foto
    // para el abridor si coincide el ID ya verificado mediante lanzamientos.
    // Nunca inferimos un abridor por la foto o la predicción.
    const scheduleProbables =
      league === "LMP" &&
      (isBeforeFirstPitch || gameState === "Live")
        ? await getLmpScheduleProbables(
            gameId,
            gameData?.datetime?.officialDate,
            away?.id,
            home?.id
          )
        : null;



   
    return {
      id: gameId,
      league,

      gameNumber:
        gameData?.game?.gameNumber,

      
       
      doubleHeader:
        gameData?.game?.doubleHeader,
      
      secondGameTimeVerified:
        league === "LMP" &&
        gameData?.game?.doubleHeader === "Y" &&
        gameData?.game?.gameNumber === 2
          ? await verifyLmpSecondGameTime(
              gameId,
              gameData
            )
          : undefined,


      awayStartingPitcher: awayPitchersUsed[0]
        ? {
            ...awayPitchersUsed[0],
            imageUrl:
              scheduleProbables?.away?.id === awayPitchersUsed[0].id
                ? scheduleProbables.away.imageUrl
                : undefined,
          }
        : undefined,
      homeStartingPitcher: homePitchersUsed[0]
        ? {
            ...homePitchersUsed[0],
            imageUrl:
              scheduleProbables?.home?.id === homePitchersUsed[0].id
                ? scheduleProbables.home.imageUrl
                : undefined,
          }
        : undefined,
      awayStarterReplaced: awayPitchersUsed.length > 1,
      homeStarterReplaced: homePitchersUsed.length > 1,

      awayProbablePitcher:
        feedAwayProbable
          ? {
              ...feedAwayProbable,
              imageUrl:
                scheduleProbables?.away?.id === feedAwayProbable.id
                  ? scheduleProbables?.away?.imageUrl
                  : undefined,
            }
          : scheduleProbables?.away,

      homeProbablePitcher:
        feedHomeProbable
          ? {
              ...feedHomeProbable,
              imageUrl:
                scheduleProbables?.home?.id === feedHomeProbable.id
                  ? scheduleProbables?.home?.imageUrl
                  : undefined,
            }
          : scheduleProbables?.home,

      


      status:

        gameData?.status
          ?.abstractGameState ??
        "Preview",

      detailedState:
        gameData?.status
          ?.detailedState ??
        "Programado",
      firstPitchRecorded,

      
      startTime:
        gameData?.datetime?.dateTime ?? "",

      startTimeTBD:
        typeof gameData?.status?.startTimeTBD === "boolean"
          ? gameData.status.startTimeTBD
          : undefined,


      awayId:
  away?.id ?? 0,

away:
  away?.name ??
  "Visitante",

awayRuns:
  linescore?.teams?.away?.runs,

homeId:
  home?.id ?? 0,

home:
  home?.name ??
  "Local",

homeRuns:
  linescore?.teams?.home?.runs,
      
      venue:
        league === "LMP" &&
        away?.id === 673 &&
        home?.id === 676 &&
        [
          "2026-10-30",
          "2026-10-31",
          "2026-11-01",
        ].includes(
          String(gameData?.datetime?.officialDate ?? "")
        )
          ? "Estadio Yaquis"
          : gameData?.venue?.name ??
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
