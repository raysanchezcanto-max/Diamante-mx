import Link from "next/link";
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

function gameTime(
  game: Game,
  league: LeagueCode
) {
  if (game.status === "Live") {
    const inning = game.inning
      ? `${game.inningState ?? ""} ${game.inning}`.trim()
      : game.detailedState;

    return `EN VIVO · ${inning}`;
  }

  if (game.status === "Final") {
    return "FINAL";
  }

  /*
    La fuente actualmente devuelve una
    hora incorrecta para el juego inaugural
    de LMP 2026-2027.

    Hasta contar con una hora oficial
    confiable mostramos "Hora por confirmar".
  */
  const gameDate = mexicoDateKey(
    new Date(game.startTime)
  );

  if (
    league === "LMP" &&
    gameDate === "2026-10-13"
  ) {
    return "HORA POR CONFIRMAR";
  }

  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(game.startTime));
}
function dateLabel(game: Game) {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: "America/Mexico_City",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(game.startTime));
}

function GameCards({
  games,
  league,
}: {
  games: Game[];
  league: LeagueCode;
}) {
  return (
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
          <Link
            href={`/game/${league.toLowerCase()}/${game.id}`}
            className="gameCard gameCardLink"
            key={game.id}
          >
            <div
              className={
                game.status === "Live"
                  ? "gameStatus live"
                  : "gameStatus"
              }
            >
              {gameTime(game, league)}
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
          </Link>
        );
      })}
    </div>
  );
}
export default function Games({
  games,
  nextGames = [],
  league = "MLB",
}: {
  games: Game[];
  nextGames?: Game[];
  league?: LeagueCode;
}) {
  const today = mexicoDateKey(new Date());

  /*
    Algunas funciones antiguas ya pueden
    devolver la próxima fecha cuando hoy
    está vacío.

    Por eso separamos aquí los juegos
    realmente correspondientes a hoy.
  */
/*
  Unimos los juegos recibidos por ambas
  fuentes y eliminamos duplicados.
*/
const allGames = Array.from(
  new Map(
    [...games, ...nextGames].map(
      (game) => [game.id, game]
    )
  ).values()
);

/*
  Si un partido de nextGames resulta ser
  hoy, debe mostrarse como "Juego de hoy"
  y no como "Próxima fecha".
*/
const todayGames = allGames.filter(
  (game) =>
    mexicoDateKey(
      new Date(game.startTime)
    ) === today
);

const futureGames = allGames.filter(
  (game) =>
    mexicoDateKey(
      new Date(game.startTime)
    ) > today
);

/*
  Mostramos únicamente la primera
  fecha futura disponible.
*/
const firstFutureDate =
  futureGames.length > 0
    ? mexicoDateKey(
        new Date(
          futureGames[0].startTime
        )
      )
    : null;

const upcomingGames =
  firstFutureDate
    ? futureGames.filter(
        (game) =>
          mexicoDateKey(
            new Date(game.startTime)
          ) === firstFutureDate
      )
    : [];

const upcomingDate =
  upcomingGames.length > 0
    ? dateLabel(upcomingGames[0])
    : null;

const hasAnyGames =
  todayGames.length > 0 ||
  upcomingGames.length > 0;

  return (
    <>
      {todayGames.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                PIZARRA
              </span>

              <h2>Juegos de hoy</h2>
            </div>

            <span className="liveDot">
              ● Datos {league}
            </span>
          </div>

          <GameCards
            games={todayGames}
            league={league}
          />
        </section>
      )}

      {upcomingGames.length > 0 && (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                PRÓXIMA FECHA
              </span>

              <h2>Próximos juegos</h2>

              {upcomingDate && (
                <p className="gamesDate">
                  {upcomingDate}
                </p>
              )}
            </div>

            {todayGames.length === 0 && (
              <span className="liveDot">
                ● Datos {league}
              </span>
            )}
          </div>

          <GameCards
            games={upcomingGames}
            league={league}
          />
        </section>
      )}

      {!hasAnyGames && (
        <section className="section">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">
                PRÓXIMA FECHA
              </span>

              <h2>Próximos juegos</h2>
            </div>

            <span className="liveDot">
              ● Datos {league}
            </span>
          </div>

          <div className="empty">
            No hay próximos juegos disponibles
            en el calendario.
          </div>
        </section>
      )}
    </>
  );
}
