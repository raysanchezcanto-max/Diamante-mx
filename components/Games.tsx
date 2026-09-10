import type { Game } from "@/lib/mlb";

import {
  getTeamLogo,
  type LeagueCode,
} from "@/lib/teamLogos";

function gameLabel(game: Game) {
  if (game.status === "Live") {
    const inning = game.inning
      ? `${game.inningState ?? ""} ${game.inning}`.trim()
      : game.detailedState;

    return `EN VIVO · ${inning}`;
  }

  if (game.status === "Final") {
    return "FINAL";
  }

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(game.startTime));
}

export default function Games({
  games,
  league = "MLB",
}: {
  games: Game[];
  league?: LeagueCode;
}) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">PIZARRA</span>
          <h2>Juegos de hoy</h2>
        </div>

        <span className="liveDot">
          ● Datos {league}
        </span>
      </div>

      {games.length === 0 ? (
        <div className="empty">
          No hay juegos disponibles para hoy.
        </div>
      ) : (
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
                <div
                  className={
                    game.status === "Live"
                      ? "gameStatus live"
                      : "gameStatus"
                  }
                >
                  {gameLabel(game)}
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
      )}
    </section>
  );
}
