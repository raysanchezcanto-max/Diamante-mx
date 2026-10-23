const MLB_API =
  "https://statsapi.mlb.com/api/v1";

export type MlbPostseasonGameType =
  | "F"
  | "D"
  | "L";

export type MlbPostseasonGame = {
  id: number;
  gameDate: string;
  gameType: MlbPostseasonGameType;
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

  final: boolean;
  live: boolean;
};

export type MlbPostseasonTeam = {
  id: number;
  name: string;
  wins: number;
};

export type MlbPostseasonSeries = {
  key: string;
  gameType: MlbPostseasonGameType;
  title: string;
  gamesInSeries: number;
  winsNeeded: number;

  teamA: MlbPostseasonTeam;
  teamB: MlbPostseasonTeam;

  games: MlbPostseasonGame[];

  winner: MlbPostseasonTeam | null;
};

export type MlbPostseason = {
  year: number;

  currentPhase:
    | MlbPostseasonGameType
    | null;

  currentPhaseTitle: string | null;

  series: MlbPostseasonSeries[];
};

function isFinalGame(game: any) {
  const abstract = String(
    game?.status?.abstractGameState ?? ""
  ).toLowerCase();

  const detailed = String(
    game?.status?.detailedState ?? ""
  ).toLowerCase();

  return (
    abstract === "final" ||
    detailed.includes("final") ||
    detailed.includes("game over") ||
    detailed.includes("completed")
  );
}

function isLiveGame(game: any) {
  const abstract = String(
    game?.status?.abstractGameState ?? ""
  ).toLowerCase();

  return (
    abstract === "live" ||
    abstract === "in progress"
  );
}

function defaultGamesInSeries(
  gameType: MlbPostseasonGameType
) {
  if (gameType === "F") return 3;
  if (gameType === "D") return 5;

  return 7;
}

function phaseTitle(
  gameType: MlbPostseasonGameType
) {
  if (gameType === "F") {
    return "Series de Wild Card";
  }

  if (gameType === "D") {
    return "Series Divisionales";
  }

  return "Series de Campeonato";
}

function translateSeriesTitle(
  description: string,
  gameType: MlbPostseasonGameType
) {
  const value =
    description.toLowerCase();

  const american =
    value.includes("american") ||
    value.includes("al ");

  const national =
    value.includes("national") ||
    value.includes("nl ");

  if (gameType === "F") {
    if (american) {
      return "Wild Card · Liga Americana";
    }

    if (national) {
      return "Wild Card · Liga Nacional";
    }

    return "Serie de Wild Card";
  }

  if (gameType === "D") {
    if (american) {
      return "ALDS · Liga Americana";
    }

    if (national) {
      return "NLDS · Liga Nacional";
    }

    return "Serie Divisional";
  }

  if (american) {
    return "ALCS · Liga Americana";
  }

  if (national) {
    return "NLCS · Liga Nacional";
  }

  return "Serie de Campeonato";
}

export async function getMlbPostseason(
  season: number
): Promise<MlbPostseason | null> {
  try {
    const response = await fetch(
      `${MLB_API}/schedule?sportId=1&season=${season}&gameTypes=F,D,L&hydrate=team`,
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
        .filter(
          (game: any) =>
            ["F", "D", "L"].includes(
              String(
                game?.gameType ?? ""
              )
            )
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

    const groups =
      new Map<
        string,
        {
          description: string;
          gameType:
            MlbPostseasonGameType;
          games: any[];
        }
      >();

    for (const game of rawGames) {
      const gameType =
        String(
          game?.gameType ?? ""
        ) as MlbPostseasonGameType;

      const awayId =
        Number(
          game?.teams?.away?.team?.id ??
            0
        );

      const homeId =
        Number(
          game?.teams?.home?.team?.id ??
            0
        );

      if (!awayId || !homeId) {
        continue;
      }

      const ids = [
        awayId,
        homeId,
      ].sort(
        (a, b) => a - b
      );

      const key =
        `${gameType}:${ids[0]}-${ids[1]}`;

      const existing =
        groups.get(key);

      if (existing) {
        existing.games.push(game);
      } else {
        groups.set(key, {
          description: String(
            game?.seriesDescription ??
              ""
          ),
          gameType,
          games: [game],
        });
      }
    }

    const series:
      MlbPostseasonSeries[] =
      Array.from(
        groups.entries()
      ).map(
        ([key, group]) => {
          const firstGame =
            group.games[0];

          const teamMap =
            new Map<
              number,
              MlbPostseasonTeam
            >();

          const parsedGames:
            MlbPostseasonGame[] =
            group.games.map(
              (
                game: any,
                index: number
              ) => {
                const awayId =
                  Number(
                    game?.teams?.away
                      ?.team?.id ?? 0
                  );

                const homeId =
                  Number(
                    game?.teams?.home
                      ?.team?.id ?? 0
                  );

                const away =
                  String(
                    game?.teams?.away
                      ?.team?.name ??
                      "Visitante"
                  );

                const home =
                  String(
                    game?.teams?.home
                      ?.team?.name ??
                      "Local"
                  );

                if (
                  !teamMap.has(awayId)
                ) {
                  teamMap.set(
                    awayId,
                    {
                      id: awayId,
                      name: away,
                      wins: 0,
                    }
                  );
                }

                if (
                  !teamMap.has(homeId)
                ) {
                  teamMap.set(
                    homeId,
                    {
                      id: homeId,
                      name: home,
                      wins: 0,
                    }
                  );
                }

                const awayRuns =
                  game?.teams?.away
                    ?.score;

                const homeRuns =
                  game?.teams?.home
                    ?.score;

                const final =
                  isFinalGame(game);

                const live =
                  isLiveGame(game);

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
                    teamMap.get(
                      winnerId
                    );

                  if (winner) {
                    winner.wins += 1;
                  }
                }

                return {
                  id: Number(
                    game?.gamePk ?? 0
                  ),
                  gameDate: String(
                    game?.gameDate ?? ""
                  ),
                  gameType:
                    group.gameType,
                  status: String(
                    game?.status
                      ?.abstractGameState ??
                      ""
                  ),
                  detailedState:
                    String(
                      game?.status
                        ?.detailedState ??
                        ""
                    ),
                  gameNumber: Number(
                    game?.seriesGameNumber ??
                      index + 1
                  ),
                  gamesInSeries:
                    Number(
                      game?.gamesInSeries ??
                        defaultGamesInSeries(
                          group.gameType
                        )
                    ),
                  awayId,
                  away,
                  awayRuns:
                    awayRuns !== undefined
                      ? Number(
                          awayRuns
                        )
                      : undefined,
                  homeId,
                  home,
                  homeRuns:
                    homeRuns !== undefined
                      ? Number(
                          homeRuns
                        )
                      : undefined,
                  final,
                  live,
                };
              }
            );

          const teams =
            Array.from(
              teamMap.values()
            );

          const teamA =
            teams[0];

          const teamB =
            teams[1];

          const gamesInSeries =
            Number(
              firstGame
                ?.gamesInSeries ??
                defaultGamesInSeries(
                  group.gameType
                )
            );

          const winsNeeded =
            Math.floor(
              gamesInSeries / 2
            ) + 1;

          const winner =
            teamA?.wins >=
            winsNeeded
              ? teamA
              : teamB?.wins >=
                winsNeeded
              ? teamB
              : null;

          return {
            key,
            gameType:
              group.gameType,
            title:
              translateSeriesTitle(
                group.description,
                group.gameType
              ),
            gamesInSeries,
            winsNeeded,
            teamA,
            teamB,
            games:
              parsedGames,
            winner,
          };
        }
      )
      .filter(
        (
          item
        ): item is MlbPostseasonSeries =>
          Boolean(
            item.teamA &&
            item.teamB
          )
      );

    const currentPhase =
      (
        [
          "L",
          "D",
          "F",
        ] as MlbPostseasonGameType[]
      ).find((phase) =>
        series.some(
          (item) =>
            item.gameType ===
            phase
        )
      ) ?? null;

    return {
      year: season,
      currentPhase,
      currentPhaseTitle:
        currentPhase
          ? phaseTitle(
              currentPhase
            )
          : null,
      series,
    };
  } catch {
    return null;
  }
}
