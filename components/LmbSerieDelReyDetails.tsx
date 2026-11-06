import Link from "next/link";
import { getTeamDisplayName, getTeamLogo } from "@/lib/teamLogos";
import type { LmbPlayoffSeries } from "@/lib/lmbPostseason";

/** Historial de los seis partidos oficiales de la Serie del Rey 2026. */
export default function LmbSerieDelReyDetails({
  series,
}: {
  series: LmbPlayoffSeries;
}) {
  const games = series.games ?? [];
  if (!games.length) return null;

  const teams = new Map(series.teams.map(team => [team.code, team.name]));

  function TeamCell({ code }: { code: string }) {
    const name = teams.get(code) ?? code;
    const logo = getTeamLogo("LMB", 0, name);
    return (
      <div className="mlbWsTeamCell">
        {logo && <img className="mlbWsTeamLogo" src={logo} alt="" loading="lazy" />}
        <span>{getTeamDisplayName("LMB", name)}</span>
      </div>
    );
  }

  return (
    <div className="mlbWorldSeriesDetailsContent lmbSerieDelReyDetailsContent">
      <div className="mlbWorldSeriesDetailTabs">
        <span className="lmbSerieDelReyGamesTab">PARTIDOS · SERIE DEL REY</span>
      </div>
      <div className="mlbWorldSeriesResults">
        {games.map((game, index) => {
          const date = new Date(`${game.date}T12:00:00-06:00`);
          const awayWon = game.awayRuns > game.homeRuns;
          return (
            <Link
              href={`/game/lmb/${game.id}`}
              key={game.id}
              className="mlbWorldSeriesResultGame lmbSerieDelReyGame"
            >
              <div className="mlbWorldSeriesResultHeader">
                <div>
                  <strong>JUEGO {index + 1}</strong>
                  <span className="mlbWsGameDate">
                    {new Intl.DateTimeFormat("es-MX", {
                      day: "numeric",
                      month: "short",
                      timeZone: "America/Mexico_City",
                    }).format(date).toUpperCase()}
                  </span>
                </div>
                <strong className="mlbWsStatusFinal">FINAL</strong>
              </div>
              <div className="lmbSerieDelReyMatchup">
                <div className="mlbWsResultMatchupTeam">
                  <TeamCell code={game.awayCode} />
                </div>
                <div className="mlbWsResultMatchupNumbers">
                  <strong className={awayWon ? "mlbWorldSeriesScoreWinner" : "mlbWorldSeriesScoreLoser"}>{game.awayRuns}</strong>
                  <span>–</span>
                  <strong className={!awayWon ? "mlbWorldSeriesScoreWinner" : "mlbWorldSeriesScoreLoser"}>{game.homeRuns}</strong>
                </div>
                <div className="mlbWsResultMatchupTeam">
                  <TeamCell code={game.homeCode} />
                </div>
              </div>
              <div className="mlbWsGameLinkHint">VER DETALLE DEL JUEGO ›</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
