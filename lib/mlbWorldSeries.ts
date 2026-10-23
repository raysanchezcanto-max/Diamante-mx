const MLB_API =
  "https://statsapi.mlb.com/api/v1";

export type MlbWorldSeriesGame = {
  id: number;
  gameDate: string;

  status: string;
  detailedState: string;

  gameNumber: number;
  gamesInSeries: number;

  awayId: number;
  away: string;
  awayRuns?: number;

  homeId: number;
  home: string;
  homeRuns?: number;
winningPitcher?: {
  id: number;
  name: string;
};

losingPitcher?: {
  id: number;
  name: string;
};

savePitcher?: {
  id: number;
  name: string;
};
  final: boolean;
  live: boolean;
};

export type MlbWorldSeriesTeam = {
  id: number;
  name: string;
  wins: number;
};

export type MlbWorldSeries = {
  year: number;

  title: string;

  gamesInSeries: number;

  teamA: MlbWorldSeriesTeam;
  teamB: MlbWorldSeriesTeam;

  games: MlbWorldSeriesGame[];

  currentGameNumber: number | null;

  champion:
    | MlbWorldSeriesTeam
    | null;
};

function isFinalGame(game: any) {
  const abstract =
    String(
      game?.status?.abstractGameState ??
        ""
    ).toLowerCase();

  const detailed =
    String(
      game?.status?.detailedState ??
        ""
    ).toLowerCase();

  return (
    abstract === "final" ||
    detailed.includes("final") ||
    detailed.includes("game over") ||
    detailed.includes("completed")
  );
}

function isLiveGame(game: any) {
  const abstract =
    String(
      game?.status?.abstractGameState ??
        ""
    ).toLowerCase();

  return (
    abstract === "live" ||
    abstract === "in progress"
  );
}

export async function getMlbWorldSeries(
  season: number
): Promise<MlbWorldSeries | null> {
  try {
    const response = await fetch(
    `${MLB_API}/schedule?sportId=1&season=${season}&gameType=W&hydrate=team,decisions`,
      {
        next: {
          revalidate: 60,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const rawGames =
      (data?.dates ?? [])
        .flatMap(
          (date: any) =>
            date?.games ?? []
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

    if (rawGames.length === 0) {
      return null;
    }

    const teams =
      new Map<
        number,
        MlbWorldSeriesTeam
      >();

    const games: MlbWorldSeriesGame[] =
      rawGames.map(
        (game: any, index: number) => {
          const awayId =
            Number(
              game?.teams?.away?.team
                ?.id ?? 0
            );

          const homeId =
            Number(
              game?.teams?.home?.team
                ?.id ?? 0
            );

          const away =
            String(
              game?.teams?.away?.team
                ?.name ?? "Visitante"
            );

          const home =
            String(
              game?.teams?.home?.team
                ?.name ?? "Local"
            );

          if (
            awayId &&
            !teams.has(awayId)
          ) {
            teams.set(awayId, {
              id: awayId,
              name: away,
              wins: 0,
            });
          }

          if (
            homeId &&
            !teams.has(homeId)
          ) {
            teams.set(homeId, {
              id: homeId,
              name: home,
              wins: 0,
            });
          }

          const awayRuns =
            game?.teams?.away?.score;

          const homeRuns =
            game?.teams?.home?.score;

          const final =
            isFinalGame(game);

          const live =
            isLiveGame(game);
          const winningPitcher =
  game?.decisions?.winner
    ? {
        id: Number(
          game.decisions.winner.id ?? 0
        ),
        name: String(
          game.decisions.winner.fullName ??
            ""
        ),
      }
    : undefined;

const losingPitcher =
  game?.decisions?.loser
    ? {
        id: Number(
          game.decisions.loser.id ?? 0
        ),
        name: String(
          game.decisions.loser.fullName ??
            ""
        ),
      }
    : undefined;

const savePitcher =
  game?.decisions?.save
    ? {
        id: Number(
          game.decisions.save.id ?? 0
        ),
        name: String(
          game.decisions.save.fullName ??
            ""
        ),
      }
    : undefined;

          if (
            final &&
            Number.isFinite(
              Number(awayRuns)
            ) &&
            Number.isFinite(
              Number(homeRuns)
            ) &&
            Number(awayRuns) !==
              Number(homeRuns)
          ) {
            const winnerId =
              Number(awayRuns) >
              Number(homeRuns)
                ? awayId
                : homeId;

            const winner =
              teams.get(winnerId);

            if (winner) {
              winner.wins += 1;
            }
          }

          return {
            id:
              Number(
                game?.gamePk ?? 0
              ),

            gameDate:
              String(
                game?.gameDate ?? ""
              ),

            status:
              String(
                game?.status
                  ?.abstractGameState ??
                  ""
              ),

            detailedState:
              String(
                game?.status
                  ?.detailedState ?? ""
              ),

            gameNumber:
              Number(
                game?.seriesGameNumber ??
                  index + 1
              ),

            gamesInSeries:
              Number(
                game?.gamesInSeries ??
                  7
              ),

            awayId,
            away,

            awayRuns:
              awayRuns !== undefined
                ? Number(awayRuns)
                : undefined,

            homeId,
            home,

            homeRuns:
              homeRuns !== undefined
                ? Number(homeRuns)
                : undefined,
winningPitcher,
losingPitcher,
savePitcher,

final,
live,
            final,
            live,
          };
        }
      );

    const participants =
      Array.from(
        teams.values()
      );

    if (participants.length < 2) {
      return null;
    }

    const teamA =
      participants[0];

    const teamB =
      participants[1];

    const champion =
      teamA.wins >= 4
        ? teamA
        : teamB.wins >= 4
        ? teamB
        : null;

    const liveGame =
      games.find(
        (game) => game.live
      );

    const nextGame =
      games.find(
        (game) => !game.final
      );

    const currentGameNumber =
      champion
        ? null
        : liveGame?.gameNumber ??
          nextGame?.gameNumber ??
          null;

    return {
      year: season,

      title: "Serie Mundial",

      gamesInSeries:
        games[0]
          ?.gamesInSeries ?? 7,

      teamA,
      teamB,

      games,

      currentGameNumber,

      champion,
    };
  } catch {
    return null;
  }
}
