const MLB_API =
  "https://statsapi.mlb.com/api/v1";

export type MlbWorldSeriesHitter = {
  id: number;
  name: string;
  teamId: number;
  team: string;
  atBats: number;
  hits: number;
  homeRuns: number;
  rbi: number;
  avg: string;
};

export type MlbWorldSeriesPitcher = {
  id: number;
  name: string;
  teamId: number;
  team: string;
  wins: number;
  losses: number;
  era: string;
  strikeOuts: number;
  inningsPitched: string;
  saves: number;
};

export type MlbWorldSeriesStats = {
  hitting: MlbWorldSeriesHitter[];
  pitching: MlbWorldSeriesPitcher[];
};

async function getStats(
  season: number,
  group: "hitting" | "pitching"
) {
  const response = await fetch(
    `${MLB_API}/stats?stats=season&group=${group}&season=${season}&gameType=W&sportIds=1&playerPool=ALL&limit=1000&hydrate=team`,
    {
      next: { revalidate: 60 },
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    return [];
  }

  const data = await response.json();

  return (data?.stats ?? []).flatMap(
    (statGroup: any) =>
      statGroup?.splits ?? []
  );
}

export async function getMlbWorldSeriesStats(
  season: number,
  teamIds: number[]
): Promise<MlbWorldSeriesStats> {
  try {
    const [hittingSplits, pitchingSplits] =
      await Promise.all([
        getStats(season, "hitting"),
        getStats(season, "pitching"),
      ]);

    const worldSeriesTeams =
      new Set(teamIds);

    const hitting =
      hittingSplits
        .filter((split: any) =>
          worldSeriesTeams.has(
            Number(split?.team?.id ?? 0)
          )
        )
        .map((split: any) => ({
          id: Number(
            split?.player?.id ?? 0
          ),
          name: String(
            split?.player?.fullName ??
              "Jugador"
          ),
          teamId: Number(
            split?.team?.id ?? 0
          ),
          team: String(
            split?.team?.name ?? ""
          ),
          atBats: Number(
            split?.stat?.atBats ?? 0
          ),
          hits: Number(
            split?.stat?.hits ?? 0
          ),
          homeRuns: Number(
            split?.stat?.homeRuns ?? 0
          ),
          rbi: Number(
            split?.stat?.rbi ?? 0
          ),
          avg: String(
            split?.stat?.avg ?? ".000"
          ),
        }))
        .filter(
          (player: MlbWorldSeriesHitter) =>
            player.id &&
            player.atBats > 0
        )
        .sort(
          (
            a: MlbWorldSeriesHitter,
            b: MlbWorldSeriesHitter
          ) =>
            Number(b.avg) -
              Number(a.avg) ||
            b.homeRuns - a.homeRuns ||
            b.hits - a.hits
        );

    const pitching =
      pitchingSplits
        .filter((split: any) =>
          worldSeriesTeams.has(
            Number(split?.team?.id ?? 0)
          )
        )
        .map((split: any) => ({
          id: Number(
            split?.player?.id ?? 0
          ),
          name: String(
            split?.player?.fullName ??
              "Pitcher"
          ),
          teamId: Number(
            split?.team?.id ?? 0
          ),
          team: String(
            split?.team?.name ?? ""
          ),
          wins: Number(
            split?.stat?.wins ?? 0
          ),
          losses: Number(
            split?.stat?.losses ?? 0
          ),
          era: String(
            split?.stat?.era ?? "0.00"
          ),
          strikeOuts: Number(
            split?.stat?.strikeOuts ?? 0
          ),
          inningsPitched: String(
            split?.stat?.inningsPitched ??
              "0.0"
          ),
          saves: Number(
            split?.stat?.saves ?? 0
          ),
        }))
        .filter(
          (player: MlbWorldSeriesPitcher) =>
            player.id &&
            Number(
              player.inningsPitched
            ) > 0
        )
        .sort(
          (
            a: MlbWorldSeriesPitcher,
            b: MlbWorldSeriesPitcher
          ) =>
            Number(a.era) -
              Number(b.era) ||
            b.strikeOuts -
              a.strikeOuts
        );

    return {
      hitting,
      pitching,
    };
  } catch {
    return {
      hitting: [],
      pitching: [],
    };
  }
}
