import type { Game } from "@/lib/mlb";

import {
  getTeamLogo,
  type LeagueCode,
} from "@/lib/teamLogos";

function resultDate(game: Game) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    day: "numeric",
    month: "short",
  }).format(new Date(game.startTime));
}

export default function RecentResults({
  games,
  league = "MLB",
}: {
  games: Game[];
  league?: LeagueCode;
}) {
  /*
    Si no existen resultados recientes,
    simplemente no mostramos la sección.
    Esto será útil para LMP fuera de temporada.
  */
  if (games.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">
            ÚLTIMOS RESULTADOS
          </span>

          <h2>Resultados recientes</h2>
        </div>

        <span className="liveDot">
          ● Datos {league}
        </span>
      </div>

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

          return (
            <article
              className="gameCard"
              key={game.id}
            >
              <div className="gameStatus">
                FINAL · {resultDate(game)}
              </div>

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
                  {game.awayRuns ?? "–"}
                </strong>
              </div>

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
                  {game.homeRuns ?? "–"}
                </strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
