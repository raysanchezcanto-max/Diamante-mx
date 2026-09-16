export type MlbChampion = {
  year: number;
  champion: string;
  championId: number;
  runnerUp: string;
  runnerUpId: number;
  championWins: number;
  runnerUpWins: number;
};

type MlbScheduleGame = {
  status?: {
    abstractGameState?: string;
    detailedState?: string;
  };

  teams?: {
    away?: {
      score?: number;
      team?: {
        id?: number;
        name?: string;
      };
    };

    home?: {
      score?: number;
      team?: {
        id?: number;
        name?: string;
      };
    };
  };
};

export async function getMlbChampion(
  season = new Date().getFullYear()
): Promise<MlbChampion | null> {
  try {
    const response = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=${season}&gameType=W&hydrate=team`,
      {
        next: {
          revalidate: 3600,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const games: MlbScheduleGame[] =
      (data?.dates ?? []).flatMap(
        (date: any) => date?.games ?? []
      );

    const finalGames =
      games.filter((game) => {
        const abstract =
          game?.status?.abstractGameState;

        const detailed =
          String(
            game?.status?.detailedState ?? ""
          ).toLowerCase();

        return (
          abstract === "Final" ||
          detailed.includes("final")
        );
      });

    if (finalGames.length === 0) {
      return null;
    }

    const wins = new Map<
      number,
      {
        id: number;
        name: string;
        wins: number;
      }
    >();

    for (const game of finalGames) {
      const away =
        game?.teams?.away;

      const home =
        game?.teams?.home;

      const awayId =
        Number(away?.team?.id ?? 0);

      const homeId =
        Number(home?.team?.id ?? 0);

      const awayName =
        away?.team?.name ?? "";

      const homeName =
        home?.team?.name ?? "";

      const awayScore =
        Number(away?.score ?? 0);

      const homeScore =
        Number(home?.score ?? 0);

      if (
        !awayId ||
        !homeId ||
        awayScore === homeScore
      ) {
        continue;
      }

      if (!wins.has(awayId)) {
        wins.set(awayId, {
          id: awayId,
          name: awayName,
          wins: 0,
        });
      }

      if (!wins.has(homeId)) {
        wins.set(homeId, {
          id: homeId,
          name: homeName,
          wins: 0,
        });
      }

      const winnerId =
        awayScore > homeScore
          ? awayId
          : homeId;

      const winner =
        wins.get(winnerId);

      if (winner) {
        winner.wins += 1;
      }
    }

    const teams =
      Array.from(wins.values()).sort(
        (a, b) => b.wins - a.wins
      );

    if (teams.length < 2) {
      return null;
    }

    const champion = teams[0];
    const runnerUp = teams[1];

    /*
      La Serie Mundial se gana al llegar
      a cuatro victorias.

      Mientras nadie tenga cuatro,
      la serie todavía no ha terminado.
    */
    if (champion.wins < 4) {
      return null;
    }

    return {
      year: season,

      champion:
        champion.name,

      championId:
        champion.id,

      runnerUp:
        runnerUp.name,

      runnerUpId:
        runnerUp.id,

      championWins:
        champion.wins,

      runnerUpWins:
        runnerUp.wins,
    };
  } catch {
    return null;
  }
}
