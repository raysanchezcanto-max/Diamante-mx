import { notFound } from "next/navigation";
import AutoRefresh from "@/components/AutoRefresh";
import LiveGamePanel from "@/components/LiveGamePanel";
import GamePitcher from "@/components/GamePitcher";
import { getMlbPlayState } from "@/lib/mlbLive";
import { caribeDisplayStatus, caribeDisplayStatusClass } from "@/lib/caribeGameStatus";
import { getCaribeGameFeed, type CaribeGameTeamStats, type CaribeStatPlayer } from "@/lib/caribeGameDetails";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function number(value: number | undefined) {
  return typeof value === "number" ? value : "–";
}

function PlayerStats({ team, name }: { team: CaribeGameTeamStats; name: string }) {
  return (
    <div className="caribeDetailTeamTables">
      <h3>{name}</h3>
      {team.batters.length > 0 && (
        <>
          <h4>BATEO</h4>
          <div className="caribeDetailTableScroll" role="region" tabIndex={0}
            aria-label={`Estadísticas de bateo de ${name}`}>
            <table className="caribeDetailStatsTable">
              <thead><tr>
                <th>JUGADOR</th><th>AB</th><th>H</th><th>R</th><th>RBI</th><th>HR</th>
              </tr></thead>
              <tbody>{team.batters.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{number(player.atBats)}</td><td>{number(player.hits)}</td>
                  <td>{number(player.runs)}</td><td>{number(player.rbi)}</td>
                  <td>{number(player.homeRuns)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
      {team.pitchers.length > 0 && (
        <>
          <h4>PITCHEO</h4>
          <div className="caribeDetailTableScroll" role="region" tabIndex={0}
            aria-label={`Estadísticas de pitcheo de ${name}`}>
            <table className="caribeDetailStatsTable">
              <thead><tr>
                <th>JUGADOR</th><th>IP</th><th>ER</th><th>SO</th><th>BB</th><th>P</th>
              </tr></thead>
              <tbody>{team.pitchers.map((player) => (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{player.inningsPitched ?? "–"}</td>
                  <td>{number(player.earnedRuns)}</td><td>{number(player.strikeOuts)}</td>
                  <td>{number(player.walks)}</td><td>{number(player.pitches)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Pitcher({
  starter,
  pitchersUsed,
  status,
}: {
  starter?: CaribeStatPlayer;
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
            <h1>{match.away?.name ?? "Por confirmar"}</h1>
            <strong className="matchupScore">{number(match.awayScore)}</strong>
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
            <h1>{match.home?.name ?? "Por confirmar"}</h1>
            <strong className="matchupScore">{number(match.homeScore)}</strong>
            {(live || final) && <Pitcher starter={feed.homeStats.starter}
              pitchersUsed={feed.homeStats.pitchers.length} status={status} />}
          </div>
        </div>
      </section>

      {feed.lines.length > 0 && feed.totals && (
        <section className="caribeDetailSection">
          <span className="eyebrow">LÍNEA DEL JUEGO</span>
          <p className="caribeDetailSwipe">DESLIZA PARA VER MÁS →</p>
          <div className="caribeDetailTableScroll" role="region" tabIndex={0}
            aria-label="Línea del juego por entradas">
            <table className="caribeDetailLineTable">
              <thead><tr>
                <th>EQUIPO</th>
                {feed.lines.map((inning) => (
                  <th className={match.inning === inning.number ? "caribeActiveInning" : ""}
                    key={inning.number}>{inning.number}</th>
                ))}
                <th>R</th><th>H</th><th>E</th>
              </tr></thead>
              <tbody>{(["away","home"] as const).map((side) => (
                <tr key={side}>
                  <td>{match[side]?.name ?? "Por confirmar"}</td>
                  {feed.lines.map((inning) => (
                    <td className={match.inning === inning.number ? "caribeActiveInning" : ""}
                      key={inning.number}>{number(inning[side])}</td>
                  ))}
                  <td>{number(feed.totals?.[side].runs)}</td>
                  <td>{number(feed.totals?.[side].hits)}</td>
                  <td>{number(feed.totals?.[side].errors)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>
      )}

      {live && playState && (
        <LiveGamePanel
          away={match.away?.name ?? "Visitante"}
          home={match.home?.name ?? "Local"}
          inning={playState.inning ?? match.inning}
          inningState={playState.inningState ?? match.inningState}
          first={playState.first} second={playState.second} third={playState.third}
          balls={playState.balls} strikes={playState.strikes} outs={playState.outs}
          description={playState.description} batterName={playState.batterName}
          pitcherName={playState.pitcherName} pitchCount={playState.pitchCount}
          plays={playState.plays}
        />
      )}

      {final && feed.decisions.length > 0 && (
        <section className="caribeDetailSection">
          <span className="eyebrow">DECISIONES OFICIALES</span>
          <div className="caribeDetailDecisions">
            {feed.decisions.map((decision) => (
              <div key={decision.label}>
                <small>{decision.label}</small><strong>{decision.name}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      {final && feed.scoringPlays.length > 0 && (
        <section className="caribeDetailSection">
          <span className="eyebrow">JUGADAS DE ANOTACIÓN</span>
          <ol className="caribeDetailScoring">
            {feed.scoringPlays.map((play, index) => (
              <li key={index}>{play}</li>
            ))}
          </ol>
        </section>
      )}

      {(feed.awayStats.batters.length > 0 || feed.homeStats.batters.length > 0 ||
        feed.awayStats.pitchers.length > 0 || feed.homeStats.pitchers.length > 0) && (
        <section className="caribeDetailSection">
          <details className="caribeDetailStatsDetails">
            <summary>ESTADÍSTICAS DEL PARTIDO · BATEO Y PITCHEO</summary>
            <div className="caribeDetailStatsGrid">
              <PlayerStats team={feed.awayStats} name={match.away?.name ?? "Visitante"} />
              <PlayerStats team={feed.homeStats} name={match.home?.name ?? "Local"} />
            </div>
          </details>
        </section>
      )}
    </main>
  );
}
