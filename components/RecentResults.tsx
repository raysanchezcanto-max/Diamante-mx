import Link from "next/link";
import type { Game } from "@/lib/mlb";

import {
  getTeamLogo,
  getTeamDisplayName,
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

  // Agrupar dobles carteleras: Juego 1 y luego Juego 2.
  const orderedGames: Game[] = [];

  for (const game of games) {
    if (orderedGames.includes(game)) continue;

    const sameMatch = games.filter(
      (other) =>
        other.away === game.away &&
        other.home === game.home &&
        resultDate(other) === resultDate(game)
    );

    const game1 = sameMatch.find(
      (item) => item.gameNumber === 1
    );

    const game2 = sameMatch.find(
      (item) => item.gameNumber === 2
    );

    const times = sameMatch.map(
      (item) => new Date(item.startTime).getTime()
    );

    const validTimeOrder =
      sameMatch.length === 2 &&
      times.every(Number.isFinite) &&
      times[0] !== times[1];

    const isDoubleHeader =
      sameMatch.length === 2 &&
      sameMatch[0].id !== sameMatch[1].id &&
      (Boolean(game1 && game2) || validTimeOrder);

    if (!isDoubleHeader) {
      orderedGames.push(game);
      continue;
    }

    const pair = [...sameMatch].sort((a, b) => {
      if (game1 && game2) {
        return a === game1 ? -1 : 1;
      }

      return (
        new Date(a.startTime).getTime() -
        new Date(b.startTime).getTime()
      );
    });

    orderedGames.push(...pair);
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
      

{orderedGames.map((rawGame) => {

  const toScore = (value: number | undefined) => {
    if (value == null) return undefined;

    const score = Number(value);
    return Number.isFinite(score)
      ? score
      : undefined;
  };

  const game = {
    ...rawGame,
    status: "Final",
    awayRuns: toScore(rawGame.awayRuns),
    homeRuns: toScore(rawGame.homeRuns),
  };

          const awayDisplayName = getTeamDisplayName(league, game.away);
          const homeDisplayName = getTeamDisplayName(league, game.home);

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
  
          // Identificar dobles carteleras.
          const sameDayGames = games
            .filter(
              (other) =>
                other.away === game.away &&
                other.home === game.home &&
                resultDate(other) === resultDate(game)
            )
            .sort(
              (a, b) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            );

          const officialDoubleHeader =
            (game.doubleHeader === "Y" ||
              game.doubleHeader === "S" ||
              game.doubleHeader === "INFERRED") &&
            (game.gameNumber === 1 ||
              game.gameNumber === 2);

          const inferredDoubleHeader =
            sameDayGames.length === 2 &&
            sameDayGames[0].id !== sameDayGames[1].id &&
            Number.isFinite(
              new Date(sameDayGames[0].startTime).getTime()
            ) &&
            Number.isFinite(
              new Date(sameDayGames[1].startTime).getTime()
            ) &&
            new Date(sameDayGames[0].startTime).getTime() !==
              new Date(sameDayGames[1].startTime).getTime();

          const doubleHeaderNumber = officialDoubleHeader
            ? game.gameNumber
            : inferredDoubleHeader
              ? sameDayGames.findIndex(
                  (other) => other.id === game.id
                ) + 1
              : null;


          return (
            <Link
  href={`/game/${league.toLowerCase()}/${game.id}`}
  className="gameCard gameCardLink"
  key={game.id}
>
            
              <div
                className="gameStatus"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>
                  FINAL · {resultDate(game)}
                </span>

                {doubleHeaderNumber !== null && (
                  <span
                    style={{
                      whiteSpace: "nowrap",
                      fontSize: "10px",
                      fontWeight: 800,
                     color: "var(--muted)",
                    }}
                  >
                    JUEGO {doubleHeaderNumber}
                  </span>
                )}
              </div>


              <div className="teamRow">
                <div className="teamIdentity">
                  {awayLogo && (
                    <img
                      src={awayLogo}
                      alt={`Logo de ${awayDisplayName}`}
                      width={34}
                      height={34}
                      loading="lazy"
                    />
                  )}

                  <span>{awayDisplayName}</span>
                </div>

               
<strong
  style={{
    
color:
  (league === "MLB" ||
    league === "LMB" ||
    league === "LMP") &&
  game.status === "Final" &&

      typeof game.awayRuns === "number" &&
      typeof game.homeRuns === "number" &&
      game.awayRuns !== game.homeRuns
        ? game.awayRuns > game.homeRuns
          ? "var(--accent)"
          : "var(--muted)"
        : undefined,
  }}
>
  {game.awayRuns ?? "–"}
</strong>

              </div>

              <div className="teamRow">
                <div className="teamIdentity">
                  {homeLogo && (
                    <img
                      src={homeLogo}
                      alt={`Logo de ${homeDisplayName}`}
                      width={34}
                      height={34}
                      loading="lazy"
                    />
                  )}

                  <span>{homeDisplayName}</span>
                </div>

               
<strong
  style={{
   
color:
  (league === "MLB" ||
    league === "LMB" ||
    league === "LMP") &&
  game.status === "Final" &&

      typeof game.awayRuns === "number" &&
      typeof game.homeRuns === "number" &&
      game.awayRuns !== game.homeRuns
        ? game.homeRuns > game.awayRuns
          ? "var(--accent)"
          : "var(--muted)"
        : undefined,
  }}
>
  {game.homeRuns ?? "–"}
</strong>

              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
