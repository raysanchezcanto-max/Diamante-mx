import {
  getLmpSeasonYear,
} from "./lmp";

export type LmpChampion = {
  champion: string;
  runnerUp: string;
  championWins: number;
  runnerUpWins: number;
  season: number;
};

const MLB_API =
  "https://statsapi.mlb.com/api/v1";

const LMP_SPORT_ID = 17;
const LMP_LEAGUE_ID = 132;

function normalizeTeam(
  name: string
) {
  return String(name ?? "")
    .trim()
    .toLowerCase();
}

export async function getLmpChampion():
  Promise<LmpChampion | null> {
  try {
    const season =
      await getLmpSeasonYear();

    /*
      En StatsAPI/LMP:
      gameType W identifica la Serie Final.
    */
    const response =
      await fetch(
        `${MLB_API}/schedule?sportId=${LMP_SPORT_ID}&leagueId=${LMP_LEAGUE_ID}&season=${season}&gameType=W&hydrate=team`,
        {
          next: {
            revalidate: 300,
          },
          headers: {
            Accept:
              "application/json",
          },
        }
      );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const games =
      (data?.dates ?? [])
        .flatMap(
          (date: any) =>
            date?.games ?? []
        )
        .filter(
          (game: any) => {
            const abstractState =
              String(
                game?.status
                  ?.abstractGameState ??
                  ""
              ).toLowerCase();

            const detailedState =
              String(
                game?.status
                  ?.detailedState ??
                  ""
              ).toLowerCase();

            return (
              abstractState ===
                "final" ||
              detailedState.includes(
                "final"
              )
            );
          }
        )
        .sort(
          (a: any, b: any) =>
            new Date(
              a?.gameDate ?? 0
            ).getTime() -
            new Date(
              b?.gameDate ?? 0
            ).getTime()
        );

    if (games.length === 0) {
      return null;
    }

    const firstGame =
      games[0];

    const awayName =
      String(
        firstGame?.teams
          ?.away?.team?.name ??
          ""
      ).trim();

    const homeName =
      String(
        firstGame?.teams
          ?.home?.team?.name ??
          ""
      ).trim();

    if (
      !awayName ||
      !homeName
    ) {
      return null;
    }

    const teamA =
      normalizeTeam(
        awayName
      );

    const teamB =
      normalizeTeam(
        homeName
      );

    /*
      Solo contamos partidos entre
      los dos equipos de la final.
    */
    const seriesGames =
      games.filter(
        (game: any) => {
          const away =
            normalizeTeam(
              game?.teams
                ?.away?.team?.name
            );

          const home =
            normalizeTeam(
              game?.teams
                ?.home?.team?.name
            );

          return (
            (
              away === teamA &&
              home === teamB
            ) ||
            (
              away === teamB &&
              home === teamA
            )
          );
        }
      );

    let winsA = 0;
    let winsB = 0;

    for (
      const game
      of seriesGames
    ) {
      const away =
        normalizeTeam(
          game?.teams
            ?.away?.team?.name
        );

      const home =
        normalizeTeam(
          game?.teams
            ?.home?.team?.name
        );

      const awayScore =
        Number(
          game?.teams
            ?.away?.score ?? 0
        );

      const homeScore =
        Number(
          game?.teams
            ?.home?.score ?? 0
        );

      if (
        awayScore ===
        homeScore
      ) {
        continue;
      }

      const winner =
        awayScore >
        homeScore
          ? away
          : home;

      if (
        winner === teamA
      ) {
        winsA += 1;
      }

      if (
        winner === teamB
      ) {
        winsB += 1;
      }
    }

    /*
      Serie Final al mejor de 7:
      campeón al llegar a 4 victorias.
    */
    if (
      winsA < 4 &&
      winsB < 4
    ) {
      return null;
    }

    const championIsA =
      winsA > winsB;

    return {
      champion:
        championIsA
          ? awayName
          : homeName,

      runnerUp:
        championIsA
          ? homeName
          : awayName,

      championWins:
        championIsA
          ? winsA
          : winsB,

      runnerUpWins:
        championIsA
          ? winsB
          : winsA,

      season,
    };
  } catch {
    return null;
  }
}
