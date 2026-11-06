import Link from "next/link";
import { getTeamLogo, getTeamDisplayName } from "@/lib/teamLogos";
import {
  type LmpPostseason,
  type LmpPostseasonPhase,
  type LmpPlayoffSeries,
  LMP_PLAYOFF_PHASES,
  LMP_PLAYOFF_PHASE_LABEL,
} from "@/lib/lmpPostseason";

function SeriesCard({ series }: { series: LmpPlayoffSeries }) {
  const active = series.games.find(game => game.status === "Live");
  const next = series.winnerId
    ? null
    : series.games.find(game => game.status === "Preview");
  const lastCompleted = [...series.games].reverse().find(game => game.status === "Final");
  const activeGame = active ?? next;

  function displayDate(value: string) {
    if (!value || Number.isNaN(Date.parse(value))) return null;
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  }

  return (
    <div className="mlbPostseasonSeriesCard lmpPostseasonSeriesCard">
      <div className="mlbPostseasonSeriesTop">
        <strong>{LMP_PLAYOFF_PHASE_LABEL[series.phase]}</strong>
        <span>AL MEJOR DE 7</span>
      </div>

      <div className="mlbPostseasonSeriesTeams">
        {[series.teamA, series.teamB].map(team => {
          const logo = getTeamLogo("LMP", team.id, team.name);
          const winner = team.id === series.winnerId;
          return (
            <div
              className={`mlbPostseasonSeriesTeam ${winner ? "lmpPostseasonSeriesWinner" : ""}`}
              key={team.id}
            >
              <div>
                {logo ? <img src={logo} alt="" loading="lazy" /> : (
                  <span className="lmpPostseasonNoLogo" aria-hidden="true" />
                )}
                <span>{getTeamDisplayName("LMP", team.name)}</span>
              </div>
              <strong>{team.wins}</strong>
            </div>
          );
        })}
      </div>

      <div className="mlbPostseasonSeriesStatus lmpPostseasonSeriesStatus">
        {series.winnerId ? (
          <strong>CLASIFICADO · {getTeamDisplayName(
            "LMP",
            series.winnerId === series.teamA.id ? series.teamA.name : series.teamB.name
          )}</strong>
        ) : active ? (
          <span className="lmpPostseasonLive">
            <span className="livePulseDot" aria-hidden="true" />
            EN VIVO {active.gameNumber ? `· JUEGO ${active.gameNumber}` : ""}
          </span>
        ) : next ? (
          <span>PRÓXIMO {next.gameNumber ? `· JUEGO ${next.gameNumber}` : ""}</span>
        ) : (
          <span>SERIE EN DISPUTA</span>
        )}
        {activeGame ? (
          <Link href={`/game/lmp/${activeGame.id}`}>
            {activeGame.status === "Live" ? "VER JUEGO" :
              !activeGame.startTimeTBD && displayDate(activeGame.date)
                ? displayDate(activeGame.date)
                : "VER JUEGO"}
          </Link>
        ) : lastCompleted ? (
          <Link href={`/game/lmp/${lastCompleted.id}`}>ÚLTIMO JUEGO</Link>
        ) : null}
      </div>
    </div>
  );
}

function Round({
  postseason,
  phase,
}: {
  postseason: LmpPostseason;
  phase: LmpPostseasonPhase;
}) {
  const series = postseason.series.filter(item => item.phase === phase);
  if (!series.length) return null;
  return (
    <div className="lmpPostseasonRound">
      <div className="mlbPostseasonHistoryPhaseHeader">
        <span>{LMP_PLAYOFF_PHASE_LABEL[phase]}</span>
      </div>
      <div className="mlbPostseasonGrid lmpPostseasonGrid">
        {series.map(item => <SeriesCard key={item.key} series={item} />)}
      </div>
    </div>
  );
}

export default function LmpPostseasonCard({
  postseason,
}: {
  postseason: LmpPostseason;
}) {
  if (!postseason.series.length) return null;

  const current = postseason.currentPhase;
  const earlier = LMP_PLAYOFF_PHASES.filter(phase =>
    phase !== current &&
    postseason.series.some(item => item.phase === phase)
  );

  return (
    <section className="section lmpPostseasonSection" aria-label="Playoffs LMP">
      <div className="lmpPostseasonHeading">
        <div>
          <span className="eyebrow">
            PLAYOFFS · LMP {postseason.season}–{String(postseason.season + 1).slice(-2)}
          </span>
          <h2>Camino a la Serie Final</h2>
        </div>
        <p>Series a ganar cuatro partidos · Información oficial LMP</p>
      </div>

      {current ? (
        <Round postseason={postseason} phase={current} />
      ) : (
        <p className="lmpPostseasonCompleted">
          Postemporada finalizada · Consulta el recorrido completo.
        </p>
      )}

      {earlier.length > 0 && (
        <details className="mlbPostseasonHistory lmpPostseasonHistory">
          <summary>Ver el camino completo</summary>
          <div className="mlbPostseasonHistoryContent">
            {LMP_PLAYOFF_PHASES.filter(phase =>
              earlier.includes(phase)
            ).map(phase => (
              <Round key={phase} postseason={postseason} phase={phase} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
