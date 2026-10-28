import MlbPostseasonCard from "@/components/MlbPostseasonCard";
import type {
  MlbPostseason,
} from "@/lib/mlbPostseason";
import MlbWorldSeriesDetails from "@/components/MlbWorldSeriesDetails";
import type {
  MlbWorldSeries,
} from "@/lib/mlbWorldSeries";
import type {
  MlbWorldSeriesStats,
} from "@/lib/mlbWorldSeriesStats";
import Link from "next/link";
import type { Game } from "@/lib/mlb";
import type { LmpChampion } from "@/lib/lmpChampion";

import {
  getTeamLogo,
  type LeagueCode,
} from "@/lib/teamLogos";

function mexicoDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
function formatInningHalf(
  inningState?: string,
  inning?: number
) {
  if (!inningState) {
    return {
      half: "",
      inning,
    };
  }

  const value =
    inningState
      .trim()
      .toLowerCase();

  if (value === "top") {
    return {
      half: "ALTA",
      inning,
    };
  }

  if (value === "middle") {
    return {
      half: "BAJA",
      inning,
    };
  }

  if (value === "bottom") {
    return {
      half: "BAJA",
      inning,
    };
  }

  if (value === "end") {
    return {
      half: "ALTA",
      inning:
        typeof inning === "number"
          ? inning + 1
          : inning,
    };
  }

  return {
    half: "",
    inning,
  };
}
function gameTime(
  game: Game,
  league: LeagueCode
) {
  if (game.status === "Live") {
 const inningInfo =
  formatInningHalf(
    game.inningState,
    game.inning
  );

const inning =
  inningInfo.half &&
  inningInfo.inning
    ? `${inningInfo.half} ${inningInfo.inning}`
    : game.detailedState;

  return `EN VIVO · ${inning}`;
}

  if (game.status === "Final") {
    return "FINAL";
  }

  /*
    La fuente actualmente devuelve una
    hora incorrecta para el juego inaugural
    de LMP 2026-2027.

    Hasta contar con una hora oficial
    confiable mostramos "Hora por confirmar".
  */
  const gameDate = mexicoDateKey(
    new Date(game.startTime)
  );

  if (
    league === "LMP" &&
    gameDate === "2026-10-13"
  ) {
    return "HORA POR CONFIRMAR";
  }

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(game.startTime));
}
function dateLabel(game: Game) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(game.startTime));
}

function GameCards({
  games,
  league,
}: {
  games: Game[];
  league: LeagueCode;
}) {
  return (
    <div className="gamesGrid">
      {games.map((game) => {
        const awayLogo = getTeamLogo(
          league,
          game.awayId,
          game.away
        );

        const homeLogo = getTeamLogo(
          league,
          game.homeId,
          game.home
        );

const isMlbWarmup =
  league === "MLB" &&
  game.gameType === "R" &&
  (game.status === "Live" ||
    game.status === "Preview") &&
  (game.firstPitchRecorded === false ||
    (game.firstPitchRecorded !== true &&
      /warm[\s-]?up/i.test(
        game.detailedState ?? ""
      )));
      
const showMlbRegularPitchers =
  league === "MLB" &&
  game.gameType === "R" &&
  mexicoDateKey(new Date(game.startTime)) ===
    mexicoDateKey(new Date()) &&
  (game.status === "Preview" || isMlbWarmup) &&
  Boolean(
    game.awayProbablePitcher ||
    game.homeProbablePitcher
  );


        return (
          <Link
            href={`/game/${league.toLowerCase()}/${game.id}`}
            className="gameCard gameCardLink"
            key={game.id}
          >
           <div
  
className={
  game.status === "Live" && !isMlbWarmup
    ? "gameStatus live"
    : "gameStatus"
}

>
  
{isMlbWarmup ? (
  <span
    style={{
      color: "#FF7A00",
      fontWeight: 800,
    }}
  >
    POR COMENZAR
  </span>
) : game.status === "Live" ? (

    <>
      <span
        className="livePulseDot"
        aria-hidden="true"
      />

      <span className="livePulseText">
        EN VIVO
      </span>

      <span className="liveInningText">
        {" · "}
        {gameTime(game, league).replace(
          /^EN VIVO\s*·\s*/,
          ""
        )}
      </span>
    </>
 
) : league === "MLB" &&
  game.gameType === "R" &&
  game.status === "Preview" &&
  mexicoDateKey(new Date(game.startTime)) ===
    mexicoDateKey(new Date()) ? (
  <>
    <span
      style={{
        color: "var(--estado-hoy, #38BDF8)",
        fontWeight: 800,
      }}
    >
      HOY
    </span>
    {" · "}
    {gameTime(game, league)}
  </>
) : (
  gameTime(game, league)
)}

</div>
{league === "MLB" &&
  (game.seriesDescription ||
    game.seriesGameNumber ||
    game.gamesInSeries) && (
    <div className="mlbSeriesMeta">
      {game.seriesDescription && (
        <strong>
          {game.seriesDescription
            .replace("World Series", "SERIE MUNDIAL")
            .replace(
              "League Championship Series",
              "SERIE DE CAMPEONATO"
            )
            .replace(
              "Division Series",
              "SERIE DIVISIONAL"
            )
            .replace(
              "Wild Card Series",
              "SERIE DE COMODÍN"
            )}
        </strong>
      )}

      {game.seriesGameNumber && (
        <span>
          {" · "}
          JUEGO {game.seriesGameNumber}
        </span>
      )}

      {game.gamesInSeries && (
        <span>
          {" · "}
          SERIE AL MEJOR DE {game.gamesInSeries}
        </span>
      )}
    </div>
  )}
            <div className="teamRow">
              <div className="teamIdentity">
                {awayLogo && (
                  <img
                    src={awayLogo}
                    alt={`Logo de ${game.away}`}
                    width={34}
                    height={34}
                    loading="lazy"
                  />
                )}

                <span>{game.away}</span>
              </div>

             <strong>
 
{game.status === "Preview" || isMlbWarmup
  ? "–"
  : game.awayRuns ?? "–"}

</strong>
            </div>
            
{showMlbRegularPitchers && (
  <div className="mlbRegularPitcher">
    {game.awayProbablePitcher?.id ? (
      <img
        className="mlbWorldSeriesPitcherPhoto"
        src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${game.awayProbablePitcher.id}/headshot/67/current`}
        alt={`Foto de ${game.awayProbablePitcher.name}`}
        width={34}
        height={34}
        loading="lazy"
      />
    ) : (
      <span
        className="mlbWorldSeriesPitcherPlaceholder"
        aria-hidden="true"
      />
    )}

    <div className="mlbWorldSeriesPitcherText">
      <small>
        {isMlbWarmup
          ? "ABRIDOR"
          : "P. PROBABLE"}
      </small>
      <span>
        {game.awayProbablePitcher?.name ??
          "Por confirmar"}
      </span>
    </div>
  </div>
)}


            <div className="teamRow">
              <div className="teamIdentity">
                {homeLogo && (
                  <img
                    src={homeLogo}
                    alt={`Logo de ${game.home}`}
                    width={34}
                    height={34}
                    loading="lazy"
                  />
                )}

                <span>{game.home}</span>
              </div>

             <strong>

{game.status === "Preview" || isMlbWarmup
  ? "–"
  : game.homeRuns ?? "–"}

</strong>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export default function Games({
  games,
  nextGames = [],
  recentGames = [],
  lmbChampion = null,
  lmbSeasonScheduled = false,
  lmpChampion = null,
  mlbChampion = null,
  mlbWorldSeries = null,
  mlbPostseason = null,
  mlbWorldSeriesStats = null,
  mlbWorldSeriesLiveState = null,
  league = "MLB",
}: {
  games: Game[];
  nextGames?: Game[];
  recentGames?: Game[];
 lmbChampion?: {
  champion: string;
  runnerUp: string;
  championWins: number;
  runnerUpWins: number;
  year: number;
} | null;
  lmbSeasonScheduled?: boolean;
lmpChampion?: LmpChampion | null;
mlbChampion?: {
  year: number;
  champion: string;
  championId: number;
  runnerUp: string;
  runnerUpId: number;
  championWins: number;
  runnerUpWins: number;
} | null;
  mlbWorldSeries?: MlbWorldSeries | null;
  mlbWorldSeriesStats?: MlbWorldSeriesStats | null;
  mlbPostseason?: MlbPostseason | null;
  mlbWorldSeriesLiveState?: {
  inning?: number;
  inningState?: string;
  balls?: number;
  strikes?: number;
  outs?: number;
  first?: number;
second?: number;
third?: number;
  batterName?: string;
  pitcherName?: string;
} | null;
  league?: LeagueCode;
}) {
const championLogo =
  league === "LMB" && lmbChampion
    ? getTeamLogo(
        "LMB",
        0,
        lmbChampion.champion
      )
    : league === "LMP" && lmpChampion
    ? getTeamLogo(
        "LMP",
        0,
        lmpChampion.champion
      )
    : league === "MLB" && mlbChampion
    ? getTeamLogo(
        "MLB",
        mlbChampion.championId,
        mlbChampion.champion
      )
    : null;
 const championData =
  league === "LMB"
    ? lmbChampion
    : league === "LMP" && lmpChampion
    ? {
        ...lmpChampion,
        year: lmpChampion.season,
      }
    : league === "MLB"
    ? mlbChampion
    : null;
const championTitle =
  league === "MLB"
    ? "Campeón de la Serie Mundial"
    : league === "LMP"
    ? "Campeón de la Liga Mexicana del Pacífico"
    : "Campeón de la Serie del Rey";
  const showMlbWorldSeriesCard =
  league === "MLB" &&
  Boolean(mlbWorldSeries) &&
  !mlbWorldSeries?.champion;
  const hideMlbRegularGameSections =
  league === "MLB" &&
  Boolean(mlbWorldSeries);

const mlbWorldSeriesTeamALogo =
  mlbWorldSeries
    ? getTeamLogo(
        "MLB",
        mlbWorldSeries.teamA.id,
        mlbWorldSeries.teamA.name
      )
    : null;

const mlbWorldSeriesTeamBLogo =
  mlbWorldSeries
    ? getTeamLogo(
        "MLB",
        mlbWorldSeries.teamB.id,
        mlbWorldSeries.teamB.name
      )
    : null;
  const today = mexicoDateKey(new Date());
  const mlbWorldSeriesCurrentGame =
  mlbWorldSeries
    ? mlbWorldSeries.games.find(
        (game) => game.live
      ) ??
      mlbWorldSeries.games.find(
        (game) =>
          !game.final &&
          mexicoDateKey(
            new Date(game.gameDate)
          ) === today
      ) ??
      null
    : null;

const mlbWorldSeriesCurrentGameIsToday =
  mlbWorldSeriesCurrentGame
    ? mexicoDateKey(
        new Date(
          mlbWorldSeriesCurrentGame.gameDate
        )
      ) === today
    : false;
 
const mlbWorldSeriesIsWarmup = Boolean(
  mlbWorldSeriesCurrentGame &&
  !mlbWorldSeriesCurrentGame.final &&
  !mlbWorldSeriesCurrentGame.live &&
  (
    mlbWorldSeriesCurrentGame.firstPitchRecorded === false ||
    /warm[\s-]?up/i.test(
      mlbWorldSeriesCurrentGame.detailedState ?? ""
    )
  )
);

  const mlbWorldSeriesTeamAProbablePitcher =
  mlbWorldSeries &&
  mlbWorldSeriesCurrentGame
    ? mlbWorldSeriesCurrentGame.awayId ===
      mlbWorldSeries.teamA.id
      ? mlbWorldSeriesCurrentGame
          .awayProbablePitcher
      : mlbWorldSeriesCurrentGame.homeId ===
        mlbWorldSeries.teamA.id
      ? mlbWorldSeriesCurrentGame
          .homeProbablePitcher
      : undefined
    : undefined;

const mlbWorldSeriesTeamBProbablePitcher =
  mlbWorldSeries &&
  mlbWorldSeriesCurrentGame
    ? mlbWorldSeriesCurrentGame.awayId ===
      mlbWorldSeries.teamB.id
      ? mlbWorldSeriesCurrentGame
          .awayProbablePitcher
      : mlbWorldSeriesCurrentGame.homeId ===
        mlbWorldSeries.teamB.id
      ? mlbWorldSeriesCurrentGame
          .homeProbablePitcher
      : undefined
    : undefined;
  const mlbWorldSeriesTeamAGameRuns =
  mlbWorldSeries &&
  mlbWorldSeriesCurrentGame
    ? mlbWorldSeriesCurrentGame.awayId ===
      mlbWorldSeries.teamA.id
      ? mlbWorldSeriesCurrentGame.awayRuns
      : mlbWorldSeriesCurrentGame.homeId ===
        mlbWorldSeries.teamA.id
      ? mlbWorldSeriesCurrentGame.homeRuns
      : undefined
    : undefined;

const mlbWorldSeriesTeamBGameRuns =
  mlbWorldSeries &&
  mlbWorldSeriesCurrentGame
    ? mlbWorldSeriesCurrentGame.awayId ===
      mlbWorldSeries.teamB.id
      ? mlbWorldSeriesCurrentGame.awayRuns
      : mlbWorldSeriesCurrentGame.homeId ===
        mlbWorldSeries.teamB.id
      ? mlbWorldSeriesCurrentGame.homeRuns
      : undefined
    : undefined;
  const mlbWorldSeriesLeader =
  mlbWorldSeries &&
  mlbWorldSeries.teamA.wins !==
    mlbWorldSeries.teamB.wins
    ? mlbWorldSeries.teamA.wins >
      mlbWorldSeries.teamB.wins
      ? mlbWorldSeries.teamA
      : mlbWorldSeries.teamB
    : null;

const mlbWorldSeriesWinsToTitle =
  mlbWorldSeriesLeader
    ? Math.max(
        0,
        4 - mlbWorldSeriesLeader.wins
      )
    : null;


const mlbWorldSeriesGoalText =
  mlbWorldSeries?.champion
    ? `${mlbWorldSeries.champion.name.toUpperCase()} CAMPEÓN`
    : mlbWorldSeriesLeader &&
      mlbWorldSeriesWinsToTitle === 1 &&
      mlbWorldSeriesCurrentGameIsToday &&
      !mlbWorldSeriesCurrentGame?.final
    ? `${mlbWorldSeriesLeader.name
        .split(" ")
        .slice(-1)[0]
        .toUpperCase()} PUEDEN SER CAMPEONES HOY`
    : mlbWorldSeriesLeader &&
      mlbWorldSeriesWinsToTitle
    ? `${mlbWorldSeriesLeader.name
        .split(" ")
        .slice(-1)[0]
        .toUpperCase()} A ${
        mlbWorldSeriesWinsToTitle
      } ${
        mlbWorldSeriesWinsToTitle === 1
          ? "VICTORIA"
          : "VICTORIAS"
      } DEL TÍTULO`
    : "PRIMERO EN LLEGAR A 4 VICTORIAS";

 
const mlbWorldSeriesNextGame =
  mlbWorldSeries?.games
    .filter((game) => !game.final)
    .sort((a, b) => a.gameNumber - b.gameNumber)[0] ??
  null;

  const mlbWorldSeriesHasStarted =
  Boolean(
    mlbWorldSeries?.games.some(
      (game) =>
        game.final ||
        game.live
    )
  );

const showMlbWorldSeriesFullSchedule =
  Boolean(
    mlbWorldSeries &&
    !mlbWorldSeriesHasStarted &&
    !mlbWorldSeries.champion
  );


const showMlbWorldSeriesNextGameOnly = Boolean(
  mlbWorldSeries &&
  mlbWorldSeriesHasStarted &&
  !mlbWorldSeries.champion &&
  !mlbWorldSeries.games.some((game) => game.live) &&
  mlbWorldSeriesNextGame &&
  mexicoDateKey(
    new Date(mlbWorldSeriesNextGame.gameDate)
  ) > today
);

  const tomorrowMexicoDateKey =
  mexicoDateKey(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const mlbWorldSeriesLastFinalGame =
  mlbWorldSeries
    ? [...mlbWorldSeries.games]
        .filter((game) => game.final)
        .sort(
          (a, b) =>
            new Date(b.gameDate).getTime() -
            new Date(a.gameDate).getTime()
        )[0] ?? null
    : null;
  const mlbWorldSeriesLastFinalGameIsToday =
  mlbWorldSeriesLastFinalGame
    ? mexicoDateKey(
        new Date(
          mlbWorldSeriesLastFinalGame.gameDate
        )
      ) === today
    : false;



const mlbWorldSeriesIsOpeningDay =
  mlbWorldSeriesCurrentGameIsToday &&
  mlbWorldSeriesCurrentGame?.gameNumber === 1 &&
  !mlbWorldSeriesCurrentGame?.live;

const mlbWorldSeriesStatusType =
  mlbWorldSeriesIsOpeningDay
    ? "upcoming"
    : "scheduled";

const mlbWorldSeriesStatusLabel =
  mlbWorldSeriesIsOpeningDay
    ? "INICIA HOY"
    : "EN DISPUTA";
const mlbWorldSeriesInningState =
  String(
    mlbWorldSeriesLiveState?.inningState ?? ""
  ).toLowerCase();

const mlbWorldSeriesInningArrow =
  mlbWorldSeriesInningState.includes("top") ||
  mlbWorldSeriesInningState.includes("alta")
    ? "▲"
    : mlbWorldSeriesInningState.includes("bottom") ||
      mlbWorldSeriesInningState.includes("baja")
    ? "▼"
    : "•";
  /*
    Algunas funciones antiguas ya pueden
    devolver la próxima fecha cuando hoy
    está vacío.

    Por eso separamos aquí los juegos
    realmente correspondientes a hoy.
  */
/*
  Unimos los juegos recibidos por ambas
  fuentes y eliminamos duplicados.
*/
const allGames = Array.from(
  new Map(
    [...nextGames, ...games].map(
      (game) => {
        const date =
          mexicoDateKey(
            new Date(game.startTime)
          );

        const away =
          game.away
            .toLowerCase()
            .trim();

        const home =
          game.home
            .toLowerCase()
            .trim();

        const key =
          `${date}-${away}-${home}`;

        return [key, game];
      }
    )
  ).values()
);

/*
  Si un partido de nextGames resulta ser
  hoy, debe mostrarse como "Juego de hoy"
  y no como "Próxima fecha".
*/
const todayGames = allGames.filter(
  (game) =>
    mexicoDateKey(
      new Date(game.startTime)
    ) === today
);
  const sortedTodayGames = [
  ...todayGames,
].sort((a, b) => {
  const getPriority = (game: Game) => {
    const status = `${game.status ?? ""} ${
      game.detailedState ?? ""
    }`
      .toLowerCase()
      .trim();

    const isLive =
      status.includes("live") ||
      status.includes("in progress") ||
      status.includes("en vivo");

    const isFinal =
      status.includes("final") ||
      status.includes("game over") ||
      status.includes("completed");

    if (isLive) return 0;
    if (isFinal) return 2;

    return 1;
  };

  const priorityDifference =
    getPriority(a) - getPriority(b);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return (
    new Date(a.startTime).getTime() -
    new Date(b.startTime).getTime()
  );
});

const futureGames = allGames.filter(
  (game) =>
    mexicoDateKey(
      new Date(game.startTime)
    ) > today
);

/*
  Mostramos únicamente la primera
  fecha futura disponible.
*/
const firstFutureDate =
  futureGames.length > 0
    ? mexicoDateKey(
        new Date(
          futureGames[0].startTime
        )
      )
    : null;

const upcomingGames =
  firstFutureDate
    ? futureGames.filter(
        (game) =>
          mexicoDateKey(
            new Date(game.startTime)
          ) === firstFutureDate
      )
    : [];

const upcomingDate =
  upcomingGames.length > 0
    ? dateLabel(upcomingGames[0])
    : null;

const hasAnyGames =
  todayGames.length > 0 ||
  upcomingGames.length > 0;

  return (
    <>
      {league === "MLB" &&
  mlbPostseason &&
  !mlbWorldSeries && (
    <MlbPostseasonCard
      postseason={mlbPostseason}
    />
  )}
      {showMlbWorldSeriesCard &&
  mlbWorldSeries && (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">
            POSTEMPORADA · MLB {mlbWorldSeries.year}
          </span>

          <h2>Serie Mundial</h2>
        </div>
<span
  className={`mlbWorldSeriesSectionStatus mlbWorldSeriesSectionStatus-${mlbWorldSeriesStatusType}`}
>
  <span
    className="mlbWorldSeriesStatusDot"
    aria-hidden="true"
  />

  {mlbWorldSeriesStatusLabel}
</span>
      </div>

      <div className="championCardPro mlbWorldSeriesCard">
        <div className="championGlow championGlowLeft" />
        <div className="championGlow championGlowRight" />
        <div className="championPattern" />

        <div className="championCardTop">
          <span className="championBadge">
            ⚾ SERIE MUNDIAL {mlbWorldSeries.year}
          </span>

        <div className="mlbWorldSeriesTopStatus">
 
 <span className="championChip">
  AL MEJOR DE{" "}
  {mlbWorldSeries.gamesInSeries}
</span>
</div>
        </div>

        <div className="mlbWorldSeriesTeams">
          <div className="mlbWorldSeriesTeam">
            {mlbWorldSeriesTeamALogo && (
              <img
                src={mlbWorldSeriesTeamALogo}
                alt={mlbWorldSeries.teamA.name}
                className="championTeamLogo"
              />
            )}

            <strong>
              {mlbWorldSeries.teamA.name}
            </strong>
            
{mlbWorldSeriesCurrentGame && (
  <small className="mlbWorldSeriesHomeAway">
    {mlbWorldSeriesCurrentGame.homeId ===
    mlbWorldSeries.teamA.id
      ? "LOCAL"
      : "VISITANTE"}
  </small>
)}

           

{mlbWorldSeriesCurrentGame &&
  !mlbWorldSeriesCurrentGame.live &&
  !mlbWorldSeriesCurrentGame.final &&
  (mlbWorldSeriesCurrentGameIsToday ||
    mlbWorldSeriesIsWarmup) &&
  (mlbWorldSeriesTeamAProbablePitcher ||
    mlbWorldSeriesTeamBProbablePitcher) && (

<div className="mlbWorldSeriesProbablePitcher">
  {mlbWorldSeriesTeamAProbablePitcher?.id ? (
    <img
      className="mlbWorldSeriesPitcherPhoto"
      src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${mlbWorldSeriesTeamAProbablePitcher.id}/headshot/67/current`}
      alt={`Foto de ${mlbWorldSeriesTeamAProbablePitcher.name}`}
      width={34}
      height={34}
      loading="lazy"
    />
  ) : (
    <span
      className="mlbWorldSeriesPitcherPlaceholder"
      aria-hidden="true"
    />
  )}

  <div className="mlbWorldSeriesPitcherText">
    
<small>
  {mlbWorldSeriesIsWarmup
    ? "ABRIDOR"
    : "P. PROBABLE"}
</small>

    <span>
      {mlbWorldSeriesTeamAProbablePitcher?.name ??
        "Por confirmar"}
    </span>
  </div>
</div>

)}



          </div>

     <div className="mlbWorldSeriesScore">
  
{mlbWorldSeriesCurrentGame &&
  !mlbWorldSeriesIsWarmup && (
    <div className="mlbWorldSeriesCurrentGame">

      <strong className="mlbWorldSeriesCurrentGameTitle">
        {mlbWorldSeriesCurrentGame.live ? (
          <>
            JUEGO{" "}
            {mlbWorldSeriesCurrentGame.gameNumber}
          </>
        ) : (
          <>
            {mlbWorldSeriesCurrentGameIsToday
              ? <span style={{ color: "#38BDF8" }}>HOY</span>
              : new Intl.DateTimeFormat(
                  "es-MX",
                  {
                    day: "numeric",
                    month: "short",
                    timeZone:
                      "America/Mexico_City",
                  }
                )
                  .format(
                    new Date(
                      mlbWorldSeriesCurrentGame.gameDate
                    )
                  )
                  .toUpperCase()}
            {" · "}
            JUEGO{" "}
            {mlbWorldSeriesCurrentGame.gameNumber}
          </>
        )}
      </strong>

      {!mlbWorldSeriesCurrentGame.live && (
        <span className="mlbWorldSeriesCurrentGameTime">
          {new Intl.DateTimeFormat(
            "es-MX",
            {
              hour: "numeric",
              minute: "2-digit",
              timeZone:
                "America/Mexico_City",
            }
          ).format(
            new Date(
              mlbWorldSeriesCurrentGame.gameDate
            )
          )}
        </span>
      )}

      {mlbWorldSeriesCurrentGame.venueName && (
        <span className="mlbWorldSeriesCurrentVenue">
          {mlbWorldSeriesCurrentGame.venueName}
        </span>
      )}
    </div>
  )}

  {mlbWorldSeriesCurrentGame?.live ? (
    <div className="mlbWorldSeriesLiveCenter">
      <span className="mlbWorldSeriesLiveLabel">
        <span
          className="livePulseDot"
          aria-hidden="true"
        />

        EN VIVO
        {mlbWorldSeriesLiveState?.inning && (
          <>
            {" · "}
            {mlbWorldSeriesInningState.includes(
              "top"
            ) ||
            mlbWorldSeriesInningState.includes(
              "alta"
            )
              ? "ALTA"
              : mlbWorldSeriesInningState.includes(
                  "bottom"
                ) ||
                mlbWorldSeriesInningState.includes(
                  "baja"
                )
              ? "BAJA"
              : ""}
            {" "}
            {mlbWorldSeriesLiveState.inning}
          </>
        )}
      </span>

      <div className="mlbWorldSeriesLiveGameScore">
        <strong>
          {mlbWorldSeriesTeamAGameRuns ?? 0}
        </strong>

        <span>–</span>

        <strong>
          {mlbWorldSeriesTeamBGameRuns ?? 0}
        </strong>
      </div>

      <div className="mlbWorldSeriesSeriesMini">
        SERIE{" "}
        {mlbWorldSeries.teamA.wins}
        {"–"}
        {mlbWorldSeries.teamB.wins}
      </div>
    </div>
 ) : mlbWorldSeriesIsWarmup ? (
  <div className="mlbWorldSeriesLiveCenter">
    <span
      className="mlbWorldSeriesLiveLabel"
    style={{ color: "#FF7A00" }}
    >
      POR COMENZAR
    </span>

   <div className="mlbWorldSeriesLiveGameScore">
  <strong>–</strong>
  <span>:</span>
  <strong>–</strong>
</div>
    <div className="mlbWorldSeriesSeriesMini">
      SERIE {mlbWorldSeries.teamA.wins}
      {"–"}
      {mlbWorldSeries.teamB.wins}
    </div>
  </div>
) : (
  <div className="mlbWorldSeriesSeriesScore">
      <small>SERIE</small>

      <div className="mlbWorldSeriesSeriesScoreNumbers">
        <strong
          className={
            mlbWorldSeries.teamA.wins >
            mlbWorldSeries.teamB.wins
              ? "mlbWorldSeriesScoreWinner"
              : mlbWorldSeries.teamA.wins <
                mlbWorldSeries.teamB.wins
              ? "mlbWorldSeriesScoreLoser"
              : ""
          }
        >
          {mlbWorldSeries.teamA.wins}
        </strong>

        <span>–</span>

        <strong
          className={
            mlbWorldSeries.teamB.wins >
            mlbWorldSeries.teamA.wins
              ? "mlbWorldSeriesScoreWinner"
              : mlbWorldSeries.teamB.wins <
                mlbWorldSeries.teamA.wins
              ? "mlbWorldSeriesScoreLoser"
              : ""
          }
        >
          {mlbWorldSeries.teamB.wins}
        </strong>
      </div>
    </div>
  )}
</div>
          

          <div className="mlbWorldSeriesTeam">
  {mlbWorldSeriesTeamBLogo && (
    <img
      src={mlbWorldSeriesTeamBLogo}
      alt={mlbWorldSeries.teamB.name}
      className="championTeamLogo"
    />
  )}

  <strong>
    {mlbWorldSeries.teamB.name}
  </strong>
            
{mlbWorldSeriesCurrentGame && (
  <small className="mlbWorldSeriesHomeAway">
    {mlbWorldSeriesCurrentGame.homeId ===
    mlbWorldSeries.teamB.id
      ? "LOCAL"
      : "VISITANTE"}
  </small>
)}


 



{mlbWorldSeriesCurrentGame &&
  !mlbWorldSeriesCurrentGame.live &&
  !mlbWorldSeriesCurrentGame.final &&
  (mlbWorldSeriesCurrentGameIsToday ||
    mlbWorldSeriesIsWarmup) &&
  (mlbWorldSeriesTeamAProbablePitcher ||
    mlbWorldSeriesTeamBProbablePitcher) && (



    
<div className="mlbWorldSeriesProbablePitcher">
  {mlbWorldSeriesTeamBProbablePitcher?.id ? (
    <img
      className="mlbWorldSeriesPitcherPhoto"
      src={`https://img.mlbstatic.com/mlb-photos/image/upload/w_80,q_auto:best/v1/people/${mlbWorldSeriesTeamBProbablePitcher.id}/headshot/67/current`}
      alt={`Foto de ${mlbWorldSeriesTeamBProbablePitcher.name}`}
      width={34}
      height={34}
      loading="lazy"
    />
  ) : (
    <span
      className="mlbWorldSeriesPitcherPlaceholder"
      aria-hidden="true"
    />
  )}

  <div className="mlbWorldSeriesPitcherText">
   
<small>
  {mlbWorldSeriesIsWarmup
    ? "ABRIDOR"
    : "P. PROBABLE"}
</small>

    <span>
      {mlbWorldSeriesTeamBProbablePitcher?.name ??
        "Por confirmar"}
    </span>
  </div>
</div>

)}


 
</div>
        </div>
  

       {!mlbWorldSeriesCurrentGame?.live && (
  <div className="mlbWorldSeriesGoal">
    {mlbWorldSeriesGoalText}
  </div>
)}
       
        {mlbWorldSeriesCurrentGame?.live &&
  mlbWorldSeriesLiveState && (
    <div className="mlbWorldSeriesLiveStrip">
      <div className="mlbWorldSeriesLiveCount">
       

        <div className="mlbWorldSeriesBSO">
          <span>
            B{" "}
            <strong>
              {mlbWorldSeriesLiveState.balls ?? 0}
            </strong>
          </span>

          <span>
            S{" "}
            <strong>
              {mlbWorldSeriesLiveState.strikes ?? 0}
            </strong>
          </span>

          <span>
            O{" "}
            <strong>
              {mlbWorldSeriesLiveState.outs ?? 0}
            </strong>
          </span>
        </div>
      </div>

      <div
        className="mlbWorldSeriesMiniDiamond"
        aria-label="Corredores en base"
      >
        <span
          className={`mlbWsBase mlbWsBaseSecond ${
            mlbWorldSeriesLiveState.second
              ? "occupied"
              : ""
          }`}
        />

        <span
          className={`mlbWsBase mlbWsBaseThird ${
            mlbWorldSeriesLiveState.third
              ? "occupied"
              : ""
          }`}
        />

        <span
          className={`mlbWsBase mlbWsBaseFirst ${
            mlbWorldSeriesLiveState.first
              ? "occupied"
              : ""
          }`}
        />
      </div>

      <div className="mlbWorldSeriesMatchup">
        <div>
          <span>AL BAT</span>
          <strong>
            {mlbWorldSeriesLiveState.batterName ||
              "—"}
          </strong>
        </div>

        <div>
          <span>PITCHER</span>
          <strong>
            {mlbWorldSeriesLiveState.pitcherName ||
              "—"}
          </strong>
        </div>
      </div>
    </div>
  )}

{mlbWorldSeriesCurrentGame &&
  (mlbWorldSeriesCurrentGame.live ||
    mlbWorldSeriesIsWarmup) && (
  <Link
    href={`/game/mlb/${mlbWorldSeriesCurrentGame.id}`}
    className="mlbWorldSeriesLiveGameLink"
  >
    <span>
      {mlbWorldSeriesCurrentGame.live
        ? "VER JUEGO EN VIVO"
        : "VER PARTIDO"}
    </span>
    <span aria-hidden="true">→</span>
  </Link>
)}

      {showMlbWorldSeriesFullSchedule && (
  <div className="mlbWorldSeriesSchedule">
    {mlbWorldSeries.games
      .filter(
        (seriesGame) =>
          !seriesGame.final &&
          mexicoDateKey(
            new Date(seriesGame.gameDate)
          ) > today
      )
      .map((seriesGame) => (
        <Link
          key={seriesGame.id}
          href={`/game/mlb/${seriesGame.id}`}
          className="mlbWorldSeriesGame"
        >
          <div>
            <strong>
              JUEGO {seriesGame.gameNumber}
            </strong>

            {seriesGame.gameNumber >= 5 && (
              <small className="mlbWorldSeriesIfNecessary">
                SI ES NECESARIO
              </small>
            )}

            <span>
              {new Intl.DateTimeFormat(
                "es-MX",
                {
                  day: "numeric",
                  month: "short",
                  timeZone:
                    "America/Mexico_City",
                }
              ).format(
                new Date(
                  seriesGame.gameDate
                )
              )}
            </span>
          </div>

          <div>
            <span>
              {new Intl.DateTimeFormat(
                "es-MX",
                {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone:
                    "America/Mexico_City",
                }
              ).format(
                new Date(
                  seriesGame.gameDate
                )
              )}
            </span>

            {seriesGame.venueName && (
              <small className="mlbWorldSeriesGameVenue">
                {seriesGame.venueName}
              </small>
            )}
          </div>
        </Link>
      ))}
  </div>
)}

{showMlbWorldSeriesNextGameOnly &&
  mlbWorldSeriesNextGame && (

<span className="mlbWorldSeriesNextOnlyCompact">
  <strong>PRÓXIMO</strong>

  {" · "}
  JUEGO {mlbWorldSeriesNextGame.gameNumber}

  {" · "}
  <span
  className="mlbWorldSeriesNextWhen"
  style={{ color: "#FFFFFF", fontWeight: 800 }}
>
    {mexicoDateKey(
      new Date(mlbWorldSeriesNextGame.gameDate)
    ) === tomorrowMexicoDateKey
      ? "MAÑANA"
      : new Intl.DateTimeFormat("es-MX", {
          day: "numeric",
          month: "short",
          timeZone: "America/Mexico_City",
        })
          .format(
            new Date(
              mlbWorldSeriesNextGame.gameDate
            )
          )
          .toUpperCase()}

    {" · "}
    {new Intl.DateTimeFormat("es-MX", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/Mexico_City",
    }).format(
      new Date(mlbWorldSeriesNextGame.gameDate)
    )}
  </span>

  {mlbWorldSeriesNextGame.venueName && (
    <>
      {" · "}
      {mlbWorldSeriesNextGame.venueName}
    </>
  )}
</span>
    
)}
     
     <details className="mlbWorldSeriesDetails">
  <summary>
    Ver detalle de la Serie Mundial
  </summary>

  <MlbWorldSeriesDetails
    worldSeries={mlbWorldSeries}
    stats={mlbWorldSeriesStats}
  />
</details>
      </div>
    </section>
  )}
      {league === "MLB" &&
  mlbWorldSeries &&
  mlbPostseason && (
    <MlbPostseasonCard
      postseason={mlbPostseason}
      mode="history"
    />
  )}
     {!hideMlbRegularGameSections &&
  todayGames.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                PIZARRA
              </span>

              <h2>Juegos de hoy</h2>
            </div>

            <span className="liveDot">
              ● Datos {league}
            </span>
          </div>

          <GameCards
           games={sortedTodayGames}
            league={league}
          />
        </section>
      )}

     {!hideMlbRegularGameSections &&
  upcomingGames.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                PRÓXIMA FECHA
              </span>

              <h2>Próximos juegos</h2>

              {upcomingDate && (
                <p className="gamesDate">
                  {upcomingDate}
                </p>
              )}
            </div>

            {todayGames.length === 0 && (
              <span className="liveDot">
                ● Datos {league}
              </span>
            )}
          </div>

          <GameCards
            games={upcomingGames}
            league={league}
          />
        </section>
      )}

 
{(
  (
    !hasAnyGames &&
    !(league === "LMB" && lmbSeasonScheduled)
  ) ||
  (
    league === "MLB" &&
    Boolean(mlbWorldSeries?.champion)
  )
) && (

  <section className="section">
    {championData ? (
      <>
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">
              TEMPORADA{" "}
{league === "LMP"
  ? `${championData.year}-${championData.year + 1}`
  : championData.year}{" "}
· FINALIZADA
            </span>

            <h2>{championTitle}</h2>
          </div>

          <span className="liveDot">
      • Datos {league}
          </span>
        </div>

       <div className="championCardPro">
  <div className="championGlow championGlowLeft" />
  <div className="championGlow championGlowRight" />
  <div className="championPattern" />

  <div className="championCardTop">
    <span className="championBadge">
    🏆 CAMPEÓN {league}{" "}
{league === "LMP"
  ? `${championData.year}-${championData.year + 1}`
  : championData.year}
    </span>

    <span className="championChip">
     {league === "MLB"
  ? "SERIE MUNDIAL"
  : league === "LMP"
  ? "SERIE FINAL"
  : "SERIE DEL REY"}
    </span>
  </div>

  <div className="championCardBody">
   <div className="championTrophy">
  {championLogo ? (
    <img
      src={championLogo}
    alt={championData.champion}
      className="championTeamLogo"
    />
  ) : (
    <span>🏆</span>
  )}
</div>

   

      <h3 className="championTeamName">
       {championData.champion}
      </h3>

     

      <div className="championResultPill">
        <span className="championResultLabel">
          RESULTADO DE LA SERIE
        </span>

        <strong className="championResultText">
         {championData.champion}{" "}
{championData.championWins}
{" – "}
{championData.runnerUpWins}{" "}
{championData.runnerUp}
        </strong>
      </div>
    </div>
         {league === "MLB" &&
  mlbWorldSeries?.champion && (
    <details className="mlbWorldSeriesDetails">
      <summary>
        Ver detalle de la Serie Mundial
      </summary>

      <MlbWorldSeriesDetails
        worldSeries={mlbWorldSeries}
        stats={mlbWorldSeriesStats}
      />
    </details>
  )}
  </div>
      </>
    ) : (
      <>
        <div className="sectionHeader">
          <div>
            <span className="eyebrow">
              PRÓXIMA FECHA
            </span>

            <h2>Próximos juegos</h2>
          </div>

          <span className="liveDot">
            ● Datos {league}
          </span>
        </div>

        <div className="empty">
          No hay próximos juegos disponibles
          en el calendario.
        </div>
      </>
    )}
  </section>
)}
    </>
  );
}
