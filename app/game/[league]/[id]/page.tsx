import { getBaseballGameExtras } from "@/lib/baseballGameExtras";
import { BaseballLineScoreCard, BaseballPitchingDecisions, BaseballPlayerStats } from "@/components/BaseballGameExtras";
import { getMlbPlayState } from "@/lib/mlbLive";
import { getLmpPlayState } from "@/lib/lmpLive";
import LiveGamePanel from "@/components/LiveGamePanel";
import LmpPitchingChanges from "@/components/LmpPitchingChanges";

import GamePitcher from "@/components/GamePitcher";

import AutoRefresh from "@/components/AutoRefresh";
import { getLmbPlayState } from "@/lib/lmbLive";
import BaseDiamond from "@/components/BaseDiamond";
import { getGameBroadcasts } from "@/lib/broadcasts";
import { notFound } from "next/navigation";
import { getGameSpecialStatus } from "@/lib/gameSpecialStatus";

import {
  getGameDetails,
} from "@/lib/gameDetails";

import {
  getTeamLogo,
  getTeamDisplayName,
  type LeagueCode,
} from "@/lib/teamLogos";

type GamePageProps = {
  params: Promise<{
    league: string;
    id: string;
  }>;
};

function isLeagueCode(
  value: string
): value is LeagueCode {
  return (
    value === "MLB" ||
    value === "LMB" ||
    value === "LMP"
  );
}

function formatGameDate(
  startTime: string
) {
  if (!startTime) {
    return "Fecha por confirmar";
  }

  const gameDate = new Date(startTime);

  const dateKey = (date: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

  const today = new Date();

  const tomorrow = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  );

  if (
    dateKey(gameDate) ===
    dateKey(today)
  ) {
    return "Hoy";
  }

  if (
    dateKey(gameDate) ===
    dateKey(tomorrow)
  ) {
    return "Mañana";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      timeZone: "America/Mexico_City",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  ).format(gameDate);
}
function formatGameTime(
  startTime: string,
  league: LeagueCode
) {
  if (!startTime) {
    return "Hora por confirmar";
  }

  const dateKey =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date(startTime)
    );

  if (
    league === "LMP" &&
    dateKey === "2026-10-13"
  ) {
    return "Hora por confirmar";
  }

  return new Intl.DateTimeFormat(
    "es-MX",
    {
      timeZone: "America/Mexico_City",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    new Date(startTime)
  );
}
export default async function GamePage({
  params,
}: GamePageProps) {
  const {
    league: rawLeague,
    id: rawId,
  } = await params;

  const league =
    rawLeague.toUpperCase();

  if (!isLeagueCode(league)) {
    notFound();
  }

  const gameId =
    Number(rawId);

  if (!Number.isFinite(gameId)) {
    notFound();
  }

  const game =
    await getGameDetails(
      league,
      gameId
    );

  if (!game) {
    notFound();
  }
const broadcasts = await getGameBroadcasts(league, gameId, {
  startTime: game.startTime,
  awayId: game.awayId,
  homeId: game.homeId,
  away: game.away,
  home: game.home,
});

  const awayDisplayName = getTeamDisplayName(league, game.away);
  const homeDisplayName = getTeamDisplayName(league, game.home);

  const awayLogo =
    getTeamLogo(
      league,
      game.awayId,
      game.away
    );

  const homeLogo =
    getTeamLogo(
      league,
      game.homeId,
      game.home
    );



const specialStatus = getGameSpecialStatus(
  game.detailedState
);

const isFinal =
  game.status === "Final" &&
  !specialStatus;


const isLmpWarmup =
  league === "LMP" &&
  (game.status === "Live" ||
    game.status === "Preview") &&
  game.firstPitchRecorded !== true &&
  /warm[\s-]?up|calentamiento/i.test(
    game.detailedState ?? ""
  );


const isLive =
  game.status === "Live" &&
  !isLmpWarmup &&
  !specialStatus;


const [playState, gameExtras] = await Promise.all([
  !isLive ? Promise.resolve(null)
    : league === "LMB" ? getLmbPlayState(gameId)
    : league === "LMP" ? getLmpPlayState(gameId)
    : getMlbPlayState(gameId),
  // No se consulta boxscore/estadísticas antes del primer lanzamiento.
  isLive || isFinal
    ? getBaseballGameExtras(league, gameId)
    : Promise.resolve(null),
]);

// Los estados MLB/LMB comparten un tipo con LMP; validar el campo exclusivo.
const lmpPitchingChanges =
  league === "LMP" &&
  playState &&
  "pitchingChanges" in playState &&
  Array.isArray(playState.pitchingChanges)
    ? playState.pitchingChanges
    : [];

// Fotos LMP verificadas por ID: reutilizar en la tarjeta de decisiones
// la misma imagen individual que recibe ABRIÓ/ABRIDOR.
const lmpDecisionPitcherPhotos: Record<number, string> = {};
if (league === "LMP") {
  for (const pitcher of [
    game.awayStartingPitcher,
    game.homeStartingPitcher,
    game.awayProbablePitcher,
    game.homeProbablePitcher,
  ]) {
    if (pitcher?.id && pitcher.imageUrl) {
      lmpDecisionPitcherPhotos[pitcher.id] = pitcher.imageUrl;
    }
  }
}

// Abridores reales: usar el primer pitcher del boxscore o la secuencia
// de lanzamientos verificada por LMP. Nunca confundir con P. PROBABLE.
const isPlayed = (isLive || isFinal) && !specialStatus;
const awayStarter = (league === "LMP" && isLive ? game.awayStartingPitcher : game.awayStartingPitcher ??
  (gameExtras?.awayStats.starter
    ? {
        id: gameExtras.awayStats.starter.id,
        name: gameExtras.awayStats.starter.name,
        imageUrl: game.awayProbablePitcher?.id === gameExtras.awayStats.starter.id
          ? game.awayProbablePitcher.imageUrl : undefined,
      }
    : undefined));
const homeStarter = (league === "LMP" && isLive ? game.homeStartingPitcher : game.homeStartingPitcher ??
  (gameExtras?.homeStats.starter
    ? {
        id: gameExtras.homeStats.starter.id,
        name: gameExtras.homeStats.starter.name,
        imageUrl: game.homeProbablePitcher?.id === gameExtras.homeStats.starter.id
          ? game.homeProbablePitcher.imageUrl : undefined,
      }
    : undefined));
const awayHasReliever = Boolean(game.awayStarterReplaced) ||
  (gameExtras?.awayStats.pitchers.length ?? 0) > 1;
const homeHasReliever = Boolean(game.homeStarterReplaced) ||
  (gameExtras?.homeStats.pitchers.length ?? 0) > 1;

// En LMP, durante el juego solo es ABRIDOR quien ya lanzó.
 // Si aún no ha tomado la lomita, mostrar el probable sin confirmarlo.
const awayAwaitingLmpStarter = league === "LMP" && isLive && !awayStarter;
const homeAwaitingLmpStarter = league === "LMP" && isLive && !homeStarter;
const awayDisplayedPitcher = awayAwaitingLmpStarter
  ? game.awayProbablePitcher
  : isPlayed ? awayStarter : game.awayProbablePitcher;
const homeDisplayedPitcher = homeAwaitingLmpStarter
  ? game.homeProbablePitcher
  : isPlayed ? homeStarter : game.homeProbablePitcher;
const showPitchers = !specialStatus && (isPlayed ||
  game.status === "Preview" || isLmpWarmup);
const awayPitcherLabel = !isPlayed || awayAwaitingLmpStarter ? "P. PROBABLE" :
  isFinal || awayHasReliever ? "ABRIÓ" : "ABRIDOR";
const homePitcherLabel = !isPlayed || homeAwaitingLmpStarter ? "P. PROBABLE" :
  isFinal || homeHasReliever ? "ABRIÓ" : "ABRIDOR";


// Durante LMP EN VIVO el score y la línea usan el mismo feed reciente
// que alimenta SITUACIÓN DEL JUEGO; el resto conserva su fuente original.
const liveLmpTotals =
  league === "LMP" && isLive && playState &&
  "lineScoreTotals" in playState
    ? playState.lineScoreTotals
    : undefined;
const liveLmpLines =
  league === "LMP" && isLive && playState &&
  "inningLines" in playState && Array.isArray(playState.inningLines) &&
  playState.inningLines.length > 0
    ? playState.inningLines
    : undefined;
const awayRunsShown = liveLmpTotals?.away.runs ?? game.awayRuns;
const homeRunsShown = liveLmpTotals?.home.runs ?? game.homeRuns;
const liveLmpLineScore =
  liveLmpTotals && liveLmpLines && gameExtras
    ? { ...gameExtras, lines: liveLmpLines, totals: liveLmpTotals }
    : gameExtras;

const hasScore =
  specialStatus !== "POSPUESTO" &&
  awayRunsShown !== undefined &&
  homeRunsShown !== undefined;

const awayIsWinning =
  hasScore && !specialStatus && awayRunsShown! > homeRunsShown!;

const homeIsWinning =
  hasScore && !specialStatus && homeRunsShown! > awayRunsShown!;

const isTied =
  hasScore && awayRunsShown === homeRunsShown;

  const date =
    formatGameDate(
      game.startTime
    );

 


const isSecondConsecutiveGame =
  game.doubleHeader === "Y" &&
  game.gameNumber === 2;


const hasLmpConfirmedTime =
  league === "LMP" &&
  game.status === "Preview" &&
  !specialStatus &&
  
  game.startTimeTBD === false &&
  (!isSecondConsecutiveGame ||
    game.secondGameTimeVerified === true) &&

  Boolean(game.startTime) &&
  Number.isFinite(Date.parse(game.startTime));

const time =
  league === "LMP" &&
  game.status === "Preview"
    ? hasLmpConfirmedTime
      ? formatGameTime(game.startTime, league)
      : "HORA POR CONFIRMAR"
    : isSecondConsecutiveGame &&
        game.status === "Preview" &&
        !specialStatus
      ? "HORA POR CONFIRMAR"
      : formatGameTime(game.startTime, league);

  return (
    <main className="gamePage">
   <AutoRefresh
  enabled={!isFinal}
/>
      <a
        className="gameBack"
        href={`/?league=${league.toLowerCase()}`}
      >
        ← Volver a {league}
      </a>

      <section className="gameHero">
       
<div className="gameHeroTop">
  
{isSecondConsecutiveGame &&
 game.status === "Preview" &&
 !specialStatus ? (
  <span
    style={{
      color: "var(--muted)",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.06em",
    }}
  >
    DESPUÉS DEL PRIMERO
  </span>
) : (
  <div />
)}


  

          <span
  className={
    isLive
      ? "gameDetailStatus live"
      : "gameDetailStatus"
  }
>
            
{specialStatus ? (
  <strong
    style={{
      color:
        specialStatus === "POSPUESTO"
          ? "var(--estado-pospuesto)"
          : specialStatus === "SUSPENDIDO"
          ? "var(--estado-suspendido)"
          : "var(--estado-retrasado)",
      fontWeight: 800,
    }}
  >
    {specialStatus}
  </strong>
) : isLmpWarmup ? (

  <strong
    style={{
      color: "#FF7A00",
      fontWeight: 800,
    }}
  >
    POR COMENZAR
  </strong>
) : isLive ? (
    <>
      <span
        className="livePulseDot"
        aria-hidden="true"
      />

      <span className="livePulseText">
        EN VIVO
      </span>
    </>
 
  ) : isFinal ? (
    "FINAL"
  ) : game.status === "Preview" ? (
    <strong
      style={{
        color:
          date === "Hoy"
            ? "var(--estado-hoy, #38BDF8)"
            : "var(--muted)",
        fontWeight: 800,
      }}
    >
      {date === "Hoy" ? "HOY" : "PRÓXIMO"}
    </strong>
  ) : (
    game.detailedState
  )}

</span>
        </div>

        <div className="matchup">
          
<div className="matchupTeam">
  <span
    style={{
      color: "var(--muted)",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      marginBottom: "12px",
    }}
  >
    VISITANTE
  </span>

  

            {awayLogo && (
              <img
                src={awayLogo}
                alt={`Logo de ${awayDisplayName}`}
                width={96}
                height={96}
              />
            )}

            <h1>{awayDisplayName}</h1>

            {hasScore ? (
              <strong
  className={`matchupScore ${
    awayIsWinning
      ? "scoreWinning"
      : homeIsWinning
        ? "scoreLosing"
        : "scoreTied"
  }`}
>
  {awayRunsShown}
</strong>
            ) : null}
  
{showPitchers && (awayDisplayedPitcher || (league === "LMP" && isLive)) && (
    <GamePitcher pitcher={awayDisplayedPitcher} league={league} label={awayPitcherLabel} />
  )}

          </div>

         
<div className="matchupCenter">
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: "8px",
      maxWidth: "210px",
    }}
  >
    

    
{(game.doubleHeader === "Y" ||
  game.doubleHeader === "S") &&
  (game.gameNumber === 1 ||
    game.gameNumber === 2) && (
    <span
      style={{
        color: "var(--muted)",
        fontSize: "11px",
        fontWeight: 800,
        letterSpacing: "0.06em",
      }}
    >
      JUEGO {game.gameNumber}
    </span>
)}


{(
  (league === "LMP" &&
    game.status === "Preview" &&
    !hasLmpConfirmedTime) ||
  (league !== "LMP" && date !== "Hoy")
) && !isLive && !isFinal && (

  <strong
    style={{
      color: "var(--text)",
      fontSize: "24px",
      fontWeight: 800,
      textTransform: "uppercase",
    }}
  >
    {game.startTime &&
    Number.isFinite(Date.parse(game.startTime))
      ? new Intl.DateTimeFormat("es-MX", {
          timeZone: "America/Mexico_City",
          weekday: "short",
          day: "numeric",
          month: "short",
        })
          .format(new Date(game.startTime))
          .replace(/[.,]/g, "")
          .toUpperCase()
      : "FECHA POR CONFIRMAR"}
  </strong>
)}


    {!isFinal && !isLive ? (
      <strong
        style={{
          color:
            time === "HORA POR CONFIRMAR"
              ? "var(--muted)"
              : "var(--text)",
          fontSize:
            time === "HORA POR CONFIRMAR"
              ? "14px"
              : "24px",
          fontWeight: 800,
          letterSpacing: "normal",
          overflowWrap: "anywhere",
        }}
      >
        {time}
      </strong>
    ) : null}


    <span
      style={{
        color: "var(--muted)",
        fontSize: "12px",
        fontWeight: 500,
        letterSpacing: "normal",
        lineHeight: 1.4,
      }}
    >
      {game.venue}
    </span>
  </div>
</div>


          
<div className="matchupTeam">
  <span
    style={{
      color: "var(--muted)",
      fontSize: "11px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      marginBottom: "12px",
    }}
  >
    LOCAL
  </span>

 

            {homeLogo && (
              <img
                src={homeLogo}
                alt={`Logo de ${homeDisplayName}`}
                width={96}
                height={96}
              />
            )}

            <h1>{homeDisplayName}</h1>

            {hasScore ? (
              <strong
  className={`matchupScore ${
    homeIsWinning
      ? "scoreWinning"
      : awayIsWinning
        ? "scoreLosing"
        : "scoreTied"
  }`}
>
  {homeRunsShown}
</strong>
            ) : null}
  
{showPitchers && (homeDisplayedPitcher || (league === "LMP" && isLive)) && (
    <GamePitcher pitcher={homeDisplayedPitcher} league={league} label={homePitcherLabel} />
  )}

          </div>
        </div>
        
{!isFinal && (
  <section className="broadcastSection">
    <div className="broadcastHeader">
      <span className="eyebrow">TRANSMISIÓN</span>
      <h2>Dónde ver</h2>
    </div>

    {broadcasts.length ? (
      <>
        <div className="broadcastLinks">
          {broadcasts.map((broadcast, index) => (
            broadcast.url ? (
              <a
                key={`${broadcast.name}-${index}`}
                href={broadcast.url}
                target="_blank"
                rel="noopener noreferrer"
                title={broadcast.note}
                className="watchButton"
              >
                Abrir {broadcast.name}
              </a>
            ) : (
              <span
                key={`${broadcast.name}-${index}`}
                title={broadcast.note}
                className="watchButtonDisabled"
              >
                {broadcast.name} · Sin enlace verificado
              </span>
            )
          ))}
        </div>
        <p className="broadcastDisclaimer">
          Los botones abren el canal o calendario oficial indicado, no siempre el
          reproductor del partido. Disponibilidad según programación, región y suscripción.
        </p>
      </>
    ) : (
      <div className="broadcastEmpty">Transmisión del partido por confirmar</div>
    )}
  </section>
)}

      </section>
      {/* Pizarra por entradas durante el juego y al finalizar. */}
      {(isLive || isFinal) && gameExtras && (
        <BaseballLineScoreCard
          data={liveLmpLineScore ?? gameExtras}
          away={awayDisplayName}
          home={homeDisplayName}
          activeInning={isLive ? (playState?.inning ?? game.inning) : undefined}
        />
      )}

      {/* POR COMENZAR: situación sin inventar bolas, strikes ni outs. */}
      {isLmpWarmup && (
        <LiveGamePanel warmup away={awayDisplayName} home={homeDisplayName} />
      )}

      {/* EN VIVO: la situación aparece antes de cualquier tabla. */}
      {isLive && (
        playState ? (
          <LiveGamePanel
            lmpMode={league === "LMP"}
            inning={playState.inning ?? game.inning}
            inningState={playState.inningState ?? game.inningState}
            away={awayDisplayName}
            home={homeDisplayName}
            first={playState.first}
            second={playState.second}
            third={playState.third}
            balls={playState.balls}
            strikes={playState.strikes}
            outs={playState.outs}
            description={playState.description}
            batterName={playState.batterName}
            pitcherName={playState.pitcherName}
            pitchCount={playState.pitchCount}
            inningLines={playState.inningLines}
            lineScoreTotals={playState.lineScoreTotals}
            plays={playState.plays}
          />
        ) : (
          <section className="liveGamePanel" aria-label="Situación del juego">
            <div className="liveGamePanelHeader">
              <span className="eyebrow">SITUACIÓN DEL JUEGO</span>
              <span className="liveGameWarmupState">EN VIVO</span>
            </div>
            <p className="liveGameSourceWaiting">
              La fuente oficial aún no publica las jugadas del encuentro.
              La situación aparecerá en cuanto estén disponibles.
            </p>
          </section>
        )
      )}

      {/* LMP: historial de relevos únicamente durante el juego y si hay cambios. */}
      {isLive && league === "LMP" && lmpPitchingChanges.length > 0 && (
        <LmpPitchingChanges
          changes={lmpPitchingChanges}
          away={awayDisplayName}
          home={homeDisplayName}
          awayLogo={awayLogo}
          homeLogo={homeLogo}
        />
      )}

      {/* Bateo, pitcheo y decisiones de pitchers solo cuando sea FINAL. */}
      {isFinal && gameExtras && (
        <>
          <BaseballPitchingDecisions
            decisions={gameExtras.decisions}
            finished
            league={league}
            pitcherPhotos={league === "LMP" ? lmpDecisionPitcherPhotos : undefined}
          />
          <BaseballPlayerStats
            awayStats={gameExtras.awayStats}
            homeStats={gameExtras.homeStats}
            away={awayDisplayName}
            home={homeDisplayName}
          />
        </>
      )}

    </main>
  );
}

