import type { Game } from "@/lib/mlb";

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

function teamLogo(teamId: number) {
  return `https://www.mlbstatic.com/team-logos/team-cap-on-dark/${teamId}.svg`;
}

export default function Games({ games }: { games: Game[] }) {
  return (
    <section className="section">
      <div className="sectionHeader">
        <div>
          <span className="eyebrow">PIZARRA</span>
          <h2>Juegos de hoy</h2>
        </div>

        <span className="liveDot">● Datos MLB</span>
      </div>

      {games.length === 0 ? (
        <div className="empty">
          No hay juegos MLB disponibles para hoy o la fuente está
          temporalmente sin respuesta.
        </div>
      ) : (
        <div className="gamesGrid">
          {games.map((game) => (
            <article className="gameCard" key={game.id}>
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
                  <img
                    src={teamLogo(game.awayId)}
                    alt={`Logo de ${game.away}`}
                    width={34}
                    height={34}
                    loading="lazy"
                  />

                  <span>{game.away}</span>
                </div>

                <strong>{game.awayRuns ?? "–"}</strong>
              </div>

              <div className="teamRow">
                <div className="teamIdentity">
                  <img
                    src={teamLogo(game.homeId)}
                    alt={`Logo de ${game.home}`}
                    width={34}
                    height={34}
                    loading="lazy"
                  />

                  <span>{game.home}</span>
                </div>

                <strong>{game.homeRuns ?? "–"}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
