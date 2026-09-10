import type { Game } from "@/lib/mlb";

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

function gameDateLabel(game: Game) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(game.startTime));
}

export default function Games({
  games,
  league = "MLB",
}: {
  games: Game[];
  league?: LeagueCode;
}) {
  const today = mexicoDateKey(new Date());

  const gamesDate =
    games.length > 0
      ? mexicoDateKey(
          new Date(games[0].startTime)
        )
      : null;

  const showingToday =
    gamesDate === today;

  const nextDateLabel =
    games.length > 0
      ? gameDateLabel(games[0])
      : null;

  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">
            {showingToday
              ? "PIZARRA"
              : "PRÓXIMA FECHA"}
          </span>

          <h2>
            {showingToday
              ? "Juegos de hoy"
              : "Próximos juegos"}
          </h2>

          {!showingToday &&
            nextDateLabel && (
              <p className="gamesDate">
                {nextDateLabel}
              </p>
            )}
        </div>

        <span className="liveDot">
          ● Datos {league}
        </span>
      </div>

      {games.length === 0 ? (
        <div className="empty">
          No hay próximos juegos
          disponibles en el calendario.
        </div>
      ) : (
        <div className="gamesGrid">
          {games.map((game) => {
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

                    <span>
                      {game.away}
                    </span>
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

                    <span>
                      {game.home}
                    </span>
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
