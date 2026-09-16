import { getLmbCalendar } from "./lmbLive";

export type LmbChampion = {
  champion: string;
  runnerUp: string;
  championWins: number;
  runnerUpWins: number;
  year: number;
};

function normalizeTeam(name?: string) {
  return String(name ?? "")
    .trim()
    .toLowerCase();
}

export async function getLmbChampion(): Promise<
  LmbChampion | null
> {
  try {
    const days = await Promise.all(
      Array.from(
        { length: 45 },
        (_, index) =>
          getLmbCalendar(-(index + 1))
      )
    );

    const finalGames = days
      .flat()
      .filter((game: any) => {
        const status = String(
          game?.status ?? ""
        ).toUpperCase();

        const detailed = String(
          game?.detailedStatus ?? ""
        ).toLowerCase();

        return (
          status === "F" ||
          detailed.includes("final")
        );
      })
      .sort((a: any, b: any) => {
        return (
          Number(b?.date_time ?? 0) -
          Number(a?.date_time ?? 0)
        );
      });

    if (finalGames.length === 0) {
      return null;
    }

    const lastGame = finalGames[0];

    const awayName = String(
      lastGame?.awayTeam?.name ?? ""
    ).trim();

    const homeName = String(
      lastGame?.localTeam?.name ?? ""
    ).trim();

    if (!awayName || !homeName) {
      return null;
    }

    const teamA = normalizeTeam(awayName);
    const teamB = normalizeTeam(homeName);

    const seriesGames = finalGames.filter(
      (game: any) => {
        const away = normalizeTeam(
          game?.awayTeam?.name
        );

        const home = normalizeTeam(
          game?.localTeam?.name
        );

        return (
          (away === teamA &&
            home === teamB) ||
          (away === teamB &&
            home === teamA)
        );
      }
    );

    let winsA = 0;
    let winsB = 0;

    for (const game of seriesGames) {
      const away = normalizeTeam(
        game?.awayTeam?.name
      );

      const home = normalizeTeam(
        game?.localTeam?.name
      );

      const awayRuns = Number(
        game?.awayTeam?.runsScored ?? 0
      );

      const homeRuns = Number(
        game?.localTeam?.runsScored ?? 0
      );

      if (awayRuns === homeRuns) {
        continue;
      }

      const winner =
        awayRuns > homeRuns
          ? away
          : home;

      if (winner === teamA) {
        winsA += 1;
      }

      if (winner === teamB) {
        winsB += 1;
      }

      if (winsA >= 4 || winsB >= 4) {
        break;
      }
    }

    if (winsA < 4 && winsB < 4) {
      return null;
    }

    const championIsA = winsA > winsB;

    const champion = championIsA
      ? awayName
      : homeName;

    const runnerUp = championIsA
      ? homeName
      : awayName;

    const latestTimestamp = Number(
      lastGame?.date_time ?? 0
    );

    const year = latestTimestamp
      ? new Date(
          latestTimestamp * 1000
        ).getFullYear()
      : new Date().getFullYear();

    return {
      champion,
      runnerUp,
      championWins: championIsA
        ? winsA
        : winsB,
      runnerUpWins: championIsA
        ? winsB
        : winsA,
      year,
    };
  } catch {
    return null;
  }
}
