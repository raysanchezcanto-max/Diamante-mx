import { getTeamDisplayName } from "@/lib/teamLogos";
import { notFound } from "next/navigation";
import { BaseballLineScoreCard, BaseballPitchingDecisions, BaseballPlayerStats } from "@/components/BaseballGameExtras";
import AutoRefresh from "@/components/AutoRefresh";
import LiveGamePanel from "@/components/LiveGamePanel";
import GamePitcher from "@/components/GamePitcher";
import { getMlbPlayState } from "@/lib/mlbLive";
import { caribeDisplayStatus, caribeDisplayStatusClass } from "@/lib/caribeGameStatus";
import { getCaribeGameFeed } from "@/lib/caribeGameDetails";
import type { BaseballStatPlayer } from "@/lib/baseballGameExtras";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function number(value: number | undefined) {
  return typeof value === "number" ? value : "–";
}

function Pitcher({
  starter,
  pitchersUsed,
  status,
}: {
  starter?: BaseballStatPlayer;
  pitchersUsed: number;
  status: string;
}) {
  if (!starter) return null;
  // La aparición de un relevista de este mismo equipo convierte
  // ABRIDOR en ABRIÓ. No comparar contra el lanzador del rival.
  const replaced = status === "EN VIVO" && pitchersUsed > 1;
  return (
    <GamePitcher
      league="MLB"
      pitcher={{ id: starter.id, name: starter.name }}
      label={replaced ? "ABRIÓ" : status === "EN VIVO" ? "ABRIDOR" : "ABRIÓ"}
    />
  );
}

export default async function CaribeGamePage({ params }: Props) {
  const { id } = await params;
  if (!/^\d{5,9}$/.test(id)) notFound();
  const gameId = Number(id);
  const feed = await getCaribeGameFeed(gameId);
  if (!feed) notFound();

  const { match } = feed;
  const status = caribeDisplayStatus(match);
  const live = status === "EN VIVO";
  const final = status === "FINAL";
  const playState = live ? await getMlbPlayState(gameId) : null;
  const fmt = match.startTime && Number.isFinite(Date.parse(match.startTime))
    ? new Intl.DateTimeFormat("es-MX", {
        timeZone: "America/Mexico_City",
        weekday: "long", day: "numeric", month: "long",
        hour: "numeric", minute: "2-digit",
      }).format(new Date(match.startTime))
    : "Fecha y hora por confirmar";

  return (
    <main className="gamePage caribeGameDetail">
      <AutoRefresh enabled={!final && (live || status === "POR COMENZAR")} intervalMs={15000} />
      <a className="gameBack" href="/serie-del-caribe">← Volver a CARIBE</a>
      <section className="gameHero">
        <div className="gameHeroTop">
          <div>
            <span className="eyebrow">SERIE DEL CARIBE · {match.startTime?.slice(0,4) ?? "2027"}</span>
            <p className="gameMeta">{fmt}</p>
            <p className="gameVenue">{feed.venue ?? "Estadio por confirmar"}</p>
          </div>
          <span className={`gameDetailStatus caribeStatusLabel ${caribeDisplayStatusClass(status)}`}>
            {live && <span className="livePulseDot" aria-hidden="true" />}
            {status}
          </span>
        </div>

        <div className="matchup caribeDetailMatchup">
          <div className="matchupTeam">
            {match.away?.flagSrc && <img src={match.away.flagSrc} alt="" />}
            <h1>{match.away?.name ? getTeamDisplayName("CARIBE", match.away.name) : "Por confirmar"}</h1>
            <strong className={`matchupScore ${match.awayScore == null || match.homeScore == null || match.awayScore === match.homeScore ? "scoreTied" : match.awayScore > match.homeScore ? "scoreWinning" : "scoreLosing"}`}>{number(match.awayScore)}</strong>
            {(live || final) && <Pitcher starter={feed.awayStats.starter}
              pitchersUsed={feed.awayStats.pitchers.length} status={status} />}
          </div>
          <div className="matchupCenter">
            <div className="caribeDetailCenter">
              <strong>VS</strong>
              {live && match.inning && (
                <span>{match.inningState?.toUpperCase() ?? ""} {match.inning}</span>
              )}
            </div>
          </div>
          <div className="matchupTeam">
            {match.home?.flagSrc && <img src={match.home.flagSrc} alt="" />}
            <h1>{match.home?.name ? getTeamDisplayName("CARIBE", match.home.name) : "Por confirmar"}</h1>
            <strong className={`matchupScore ${match.awayScore == null || match.homeScore == null || match.awayScore === match.homeScore ? "scoreTied" : match.homeScore > match.awayScore ? "scoreWinning" : "scoreLosing"}`}>{number(match.homeScore)}</strong>
            {(live || final) && <Pitcher starter={feed.homeStats.starter}
              pitchersUsed={feed.homeStats.pitchers.length} status={status} />}
          </div>
        </div>
      </section>

      {!final && (
        <section className="broadcastSection">
          <div className="broadcastHeader">
            <span className="eyebrow">TRANSMISIÓN</span>
            <h2>Dónde ver</h2>
          </div>
          <p className="broadcastDisclaimer">
            Los derechos de televisión y streaming de la Serie del Caribe Hermosillo 2027
            todavía no están confirmados para estos partidos. No utilizamos los
            canales anunciados para la edición 2026 como si fueran de 2027.
          </p>
          <div className="broadcastLinks">
            <a className="watchButton" href="https://www.seriedelcaribe.net/"
              target="_blank" rel="noopener noreferrer">
              Consultar anuncios oficiales del torneo
            </a>
          </div>
        </section>
      )}

      <BaseballLineScoreCard
        data={feed}
        away={getTeamDisplayName("CARIBE", match.away?.name ?? "Visitante")}
        home={getTeamDisplayName("CARIBE", match.home?.name ?? "Local")}
        activeInning={live ? match.inning : undefined}
      />
      {live && playState && (
        <LiveGamePanel
          away={getTeamDisplayName("CARIBE", match.away?.name ?? "Visitante")}
          home={getTeamDisplayName("CARIBE", match.home?.name ?? "Local")}
          inning={playState.inning ?? match.inning}
          inningState={playState.inningState ?? match.inningState}
          first={playState.first} second={playState.second} third={playState.third}
          balls={playState.balls} strikes={playState.strikes} outs={playState.outs}
          description={playState.description} batterName={playState.batterName}
          pitcherName={playState.pitcherName} pitchCount={playState.pitchCount}
          plays={playState.plays}
        />
      )}

      <BaseballPitchingDecisions decisions={feed.decisions} finished={final} league="CARIBE" />
      <BaseballPlayerStats
        awayStats={feed.awayStats}
        homeStats={feed.homeStats}
        away={getTeamDisplayName("CARIBE", match.away?.name ?? "Visitante")}
        home={getTeamDisplayName("CARIBE", match.home?.name ?? "Local")}
      />
    </main>
  );
}
