export type LmbLiveScore = {
  status: "Preview" | "Live" | "Final";

  away: string;
  home: string;

  awayRuns?: number;
  homeRuns?: number;

  inning?: number;
  inningState?: string;

  detailedState?: string;
};

type LmbApiGame = {
  status?: string;
  detailedStatus?: string;

  inning?: {
    number?: number;
    part?: string;
  };

  awayTeam?: {
    name?: string;
    runsScored?: number;
  };

  localTeam?: {
    name?: string;
    runsScored?: number;
  };
};

type LmbApiResponse = {
  games_info?: LmbApiGame[];
};

export async function getLmbLiveScore(
  permalink: number
): Promise<LmbLiveScore | null> {
  try {
    const response = await fetch(
      `https://lmb.com.mx/juegos/api/detail?permalink=${permalink}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as LmbApiResponse;

    const game =
      data?.games_info?.[0];

    if (!game) {
      return null;
    }

    const rawStatus =
      String(game.status ?? "")
        .toUpperCase();

    const detailed =
      String(
        game.detailedStatus ?? ""
      ).toLowerCase();

    let status:
      "Preview" | "Live" | "Final" =
      "Preview";

    if (
      rawStatus === "L" ||
      detailed.includes("en vivo")
    ) {
      status = "Live";
    } else if (
      rawStatus === "F" ||
      detailed.includes("final")
    ) {
      status = "Final";
    }

    return {
      status,

      away:
        game.awayTeam?.name ??
        "Visitante",

      home:
        game.localTeam?.name ??
        "Local",

      awayRuns:
        game.awayTeam?.runsScored,

      homeRuns:
        game.localTeam?.runsScored,

      inning:
        game.inning?.number,

      inningState:
        game.inning?.part,

      detailedState:
        game.detailedStatus,
    };
  } catch {
    return null;
  }
}
