import { getTeamLogo, getTeamDisplayName } from "@/lib/teamLogos";
import {
  type LmbPostseason,
  type LmbPlayoffRound,
  type LmbPlayoffSeries,
  LMB_PLAYOFF_ROUND_LABELS,
} from "@/lib/lmbPostseason";

function SeriesCard({ series }: { series: LmbPlayoffSeries }) {
  const winner = series.teams.find(team => team.code === series.winnerCode);
  return (
    <div className="mlbPostseasonSeriesCard mlbPostseasonSeriesCardCompact lmbPostseasonSeriesCard">
      <div className="mlbPostseasonSeriesTeams">
        {series.teams.map(team => {
          const logo = getTeamLogo("LMB", 0, team.name);
          return (
            <div
              className={`mlbPostseasonSeriesTeam ${series.winnerCode === team.code ? "mlbPostseasonSeriesTeamWinner" : "mlbPostseasonSeriesTeamLoser"}`}
              key={team.code}
            >
              <div>
                {logo
                  ? <img src={logo} alt="" loading="lazy" />
                  : <span className="lmbPostseasonNoLogo" aria-hidden="true" />}
                <span>{getTeamDisplayName("LMB", team.name)}</span>
              </div>
              <strong>{team.wins}</strong>
            </div>
          );
        })}
      </div>
      <div className="mlbPostseasonSeriesStatus lmbPostseasonSeriesStatus">
        <strong>
          {series.round === "rey" ? "CAMPEÓN" : "GANÓ LA SERIE"}
          {winner ? ` · ${getTeamDisplayName("LMB", winner.name)}` : ""}
        </strong>
      </div>
      {series.bestLoserCode && (
        <p className="lmbPostseasonBestLoser">
          <span>MEJOR PERDEDOR · </span>
          {getTeamDisplayName(
            "LMB",
            series.teams.find(team => team.code === series.bestLoserCode)?.name ?? ""
          )} también avanzó a Series de Zona.
        </p>
      )}
    </div>
  );
}

function Round({
  postseason,
  round,
}: {
  postseason: LmbPostseason;
  round: LmbPlayoffRound;
}) {
  const series = postseason.series.filter(item => item.round === round);
  if (!series.length) return null;
  const zones = (["Norte", "Sur"] as const)
    .map(zone => ({ zone, matches: series.filter(item => item.zone === zone) }))
    .filter(group => group.matches.length > 0);

  return (
    <div className="lmbPostseasonRound">
      <div className="mlbPostseasonHistoryPhaseHeader">
        <span>{LMB_PLAYOFF_ROUND_LABELS[round]}</span>
      </div>
      <div className={round === "championship" ? "lmbPostseasonChampionshipColumns" : "lmbPostseasonZoneRows"}>
        {zones.map(({ zone, matches }) => (
          <div className="lmbPostseasonZone" key={zone}>
            <h3>Zona {zone}</h3>
            <div className="mlbPostseasonGrid lmbPostseasonGrid">
              {matches.map(item => (
                <SeriesCard
                  series={item}
                  key={`${item.round}-${item.zone}-${item.teams[0].code}-${item.teams[1].code}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LmbPostseasonCard({
  postseason,
}: {
  postseason: LmbPostseason;
}) {
  if (!postseason.series.length) return null;
  // Exactamente como MLB: las últimas rondas arriba y las primeras abajo.
  // La Serie del Rey ya vive en "Ver detalle" dentro de la tarjeta del campeón.
  const rounds: LmbPlayoffRound[] = ["championship", "zone", "first"].filter(
    (round): round is LmbPlayoffRound =>
      postseason.series.some(series => series.round === round)
  );
  if (!rounds.length) return null;

  return (
    <section className="section mlbPostseasonHistorySection lmbPostseasonSection" aria-label="Camino a la Serie del Rey">
      <details className="mlbPostseasonHistory lmbPostseasonHistory">
        <summary>Camino a la Serie del Rey</summary>
        <div className="mlbPostseasonHistoryContent">
          {rounds.map(round => (
            <Round key={round} postseason={postseason} round={round} />
          ))}
          <p className="lmbPostseasonSource">
            Resultados oficiales LMB · Temporada {postseason.season}
          </p>
        </div>
      </details>
    </section>
  );
}
