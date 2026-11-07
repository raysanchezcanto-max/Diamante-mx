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
  const upcoming = series.winnerId ? null :
    series.games.find(game => game.status === "Preview");
  const activeGame = active ?? upcoming;

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

  const winningTeam = series.winnerId === series.teamA.id
    ? series.teamA
    : series.winnerId === series.teamB.id
      ? series.teamB
      : null;

  return (
    <div className="mlbPostseasonSeriesCard mlbPostseasonSeriesCardCompact lmpPostseasonSeriesCard">
      <div className="mlbPostseasonSeriesTeams">
        {[series.teamA, series.teamB].map(team => {
          const logo = getTeamLogo("LMP", team.id, team.name);
          const winner = team.id === series.winnerId;
          const loser = Boolean(series.winnerId) && !winner;
          return (
            <div
              className={`mlbPostseasonSeriesTeam ${winner
                ? "mlbPostseasonSeriesTeamWinner"
                : loser ? "mlbPostseasonSeriesTeamLoser" : ""}`}
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
        {winningTeam ? (
          <strong>GANÓ LA SERIE · {getTeamDisplayName("LMP", winningTeam.name)}</strong>
        ) : active ? (
          <span className="lmpPostseasonLive">
            <span className="livePulseDot" aria-hidden="true" />
            EN VIVO{active.gameNumber ? ` · JUEGO ${active.gameNumber}` : ""}
          </span>
        ) : upcoming ? (
          <span>PRÓXIMO{upcoming.gameNumber ? ` · JUEGO ${upcoming.gameNumber}` : ""}</span>
        ) : (
          <span>SERIE EN DISPUTA</span>
        )}
        {activeGame && (
          <Link href={`/game/lmp/${activeGame.id}`}>
            {active ? "VER JUEGO" :
              !activeGame.startTimeTBD && displayDate(activeGame.date)
                ? displayDate(activeGame.date)
                : "HORA POR CONFIRMAR"}
          </Link>
        )}
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
  mode = "active",
}: {
  postseason: LmpPostseason;
  mode?: "active" | "history";
}) {
  if (!postseason.series.length) return null;

  const hasPhase = (phase: LmpPostseasonPhase) =>
    postseason.series.some(item => item.phase === phase);

  // Solo el historial terminado se presenta bajo el campeón: la Serie Final
  // está en "Ver detalle de la Serie Final", no se repite otra vez.
  if (mode === "history") {
    const past: LmpPostseasonPhase[] = (["L", "D"] as const).filter(hasPhase);
    if (!past.length) return null;
    return (
      <section className="section mlbPostseasonHistorySection lmpPostseasonSection" aria-label="Camino a la Serie Final">
        <details className="mlbPostseasonHistory lmpPostseasonHistory">
          <summary>Camino a la Serie Final</summary>
          <div className="mlbPostseasonHistoryContent">
            {past.map(phase => <Round key={phase} postseason={postseason} phase={phase} />)}
          </div>
        </details>
      </section>
    );
  }

  // En fases activas, mostrar la ronda actual y conservar el estado en vivo.
  // Si la Serie Final acaba de concluir, mostrarla hasta que aparezca el campeón.
  const current: LmpPostseasonPhase = postseason.currentPhase ??
    (hasPhase("W") ? "W" : hasPhase("L") ? "L" : "D");
  const earlier: LmpPostseasonPhase[] = (["L", "D"] as const).filter(
    phase => phase !== current && hasPhase(phase)
  );

  return (
    <section className="section lmpPostseasonSection" aria-label="Playoffs LMP">
      <div className="lmpPostseasonHeading">
        <div>
          <span className="eyebrow">
            PLAYOFFS · LMP {postseason.season}–{String(postseason.season + 1).slice(-2)}
          </span>
          <h2>{current === "W" ? "Serie Final" : "Camino a la Serie Final"}</h2>
        </div>
        <p>Resultados y partidos en tiempo real · Fuente oficial</p>
      </div>
      {hasPhase(current) && <Round postseason={postseason} phase={current} />}
      {earlier.length > 0 && (
        <details className="mlbPostseasonHistory lmpPostseasonHistory">
          <summary>Camino a la Serie Final</summary>
          <div className="mlbPostseasonHistoryContent">
            {earlier.map(phase => (
              <Round key={phase} postseason={postseason} phase={phase} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
