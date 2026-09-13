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
function getMexicoDateRange() {
  const now = new Date();

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(now);

  const year =
    parts.find(
      (part) => part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) => part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) => part.type === "day"
    )?.value ?? "";

  const date =
    `${month}/${day}/${year}`;

  const startDate =
    new Date(
      `${year}-${month}-${day}T00:00:00-06:00`
    ).getTime();

  const endDate =
    new Date(
      `${year}-${month}-${day}T23:59:59.999-06:00`
    ).getTime();

  return {
    date,
    startDate,
    endDate,
  };
}
export async function getLmbCalendar(
  offsetDays = 0
) {
  const baseDate =
    new Date(
      Date.now() +
        offsetDays *
          24 *
          60 *
          60 *
          1000
    );

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).formatToParts(baseDate);

  const year =
    parts.find(
      (part) => part.type === "year"
    )?.value ?? "";

  const month =
    parts.find(
      (part) => part.type === "month"
    )?.value ?? "";

  const day =
    parts.find(
      (part) => part.type === "day"
    )?.value ?? "";

  const date =
    `${month}/${day}/${year}`;

  const startDate =
    new Date(
      `${year}-${month}-${day}T00:00:00-06:00`
    ).getTime();

  const endDate =
    new Date(
      `${year}-${month}-${day}T23:59:59.999-06:00`
    ).getTime();

  try {
    const response = await fetch(
      `https://lmb.com.mx/juegos/api/calendar?date=${date}&daysFromNow=0&startDate=${startDate}&endDate=${endDate}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    return data?.games_info ?? [];
  } catch {
    return [];
  }
}
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
export type LmbPlayState = {
  first: number;
  second: number;
  third: number;

  balls: number;
  strikes: number;
  outs: number;

  description?: string;
  batterName?: string;
  plays?: string[];
};

function collectInnings(
  value: any,
  results: any[] = []
) {
  if (Array.isArray(value)) {
    value.forEach((item) =>
      collectInnings(item, results)
    );

    return results;
  }

  if (
    value &&
    typeof value === "object"
  ) {
    if (
      typeof value.inningNumber === "number" &&
      (
        Array.isArray(value.inningTopPlays) ||
        Array.isArray(value.inningBottomPlays)
      )
    ) {
      results.push(value);
    }

    Object.values(value).forEach(
      (item) =>
        collectInnings(item, results)
    );
  }
function findCurrentBatterName(
  value: any
): string | undefined {
  const names: string[] = [];

  function search(item: any) {
    if (!item) return;

    if (Array.isArray(item)) {
      item.forEach(search);
      return;
    }

    if (typeof item !== "object") {
      return;
    }

    const name =
      item?.chupa?.batter?.name;

    if (
      typeof name === "string" &&
      name.trim()
    ) {
      names.push(name.trim());
    }

    Object.values(item).forEach(search);
  }

  search(value);

  return names.length > 0
    ? names[names.length - 1]
    : undefined;
}
  return results;
}

export async function getLmbPlayState(
  permalink: number
): Promise<LmbPlayState | null> {
  try {
    const response = await fetch(
      `https://lmb.com.mx/juegos/api/jugadas?permalink=${permalink}`,
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
      await response.json();

    const innings =
  collectInnings(data);

if (innings.length === 0) {
  return null;
}

const latestInning =
  innings.sort(
    (a, b) =>
      b.inningNumber -
      a.inningNumber
  )[0];

const bottomPlays =
  latestInning.inningBottomPlays ?? [];

const topPlays =
  latestInning.inningTopPlays ?? [];

const currentPlays =
  bottomPlays.length > 0
    ? bottomPlays
    : topPlays;

if (currentPlays.length === 0) {
  return null;
}

const play =
  [...currentPlays].sort(
    (a, b) =>
      Number(
        b.indexInningPlay ?? 0
      ) -
      Number(
        a.indexInningPlay ?? 0
      )
  )[0];
    const lastCompletedPlay =
  [...currentPlays]
    .filter(
      (item) =>
        item?.isComplete === true &&
        item?.playDescription &&
        item.playDescription
          .toLowerCase() !== "al bat"
    )
    .sort(
      (a, b) =>
        Number(b.indexInningPlay ?? 0) -
        Number(a.indexInningPlay ?? 0)
    )[0];
   const inningPlays =
  [...currentPlays]
    .filter(
      (item) =>
        item?.isComplete === true &&
        item?.playDescription &&
        item.playDescription
          .trim()
          .toLowerCase() !== "al bat"
    )
    .sort(
      (a, b) =>
        Number(a.indexInningPlay ?? 0) -
        Number(b.indexInningPlay ?? 0)
    )
    .map(
      (item) =>
        String(item.playDescription).trim()
    );
    const batterName =
  latestInning?.chupa?.batter?.name ??
  data?.chupa?.batter?.name ??
  play?.batter?.name ??
  undefined;

    return {
      first:
        Number(
          play.bases?.first ?? 0
        ),

      second:
        Number(
          play.bases?.second ?? 0
        ),

      third:
        Number(
          play.bases?.third ?? 0
        ),

      balls:
        Number(
          play.playBallsCount ?? 0
        ),

      strikes:
        Number(
          play.playStrikeCount ?? 0
        ),

      outs:
        Number(
          play.playOutsCount ?? 0
        ),

    description:
  lastCompletedPlay?.playDescription ??
  play?.playDescription ??
  "",
      
     batterName,
      plays: inningPlays,
      };
 
  } catch {
    return null;
  }
}
export type LmbOfficialBroadcast = {
  name: string;
  url?: string;
};

export async function getLmbOfficialBroadcasts(
  permalink: number
): Promise<LmbOfficialBroadcast[]> {
  try {
    const games =
      await getLmbCalendar();

    const game =
      games.find(
        (item: any) =>
          Number(item.gameId) ===
          Number(permalink)
      );

    if (!game) {
      return [];
    }

    const broadcasts:
      LmbOfficialBroadcast[] = [];

    if (Array.isArray(game.tvNetworks)) {
      game.tvNetworks.forEach(
        (network: any) => {
          const name =
            network?.name ??
            network?.network ??
            "";

          const url =
            network?.url ??
            network?.link ??
            undefined;

          if (name) {
            broadcasts.push({
              name,
              url,
            });
          }
        }
      );
    }

    if (game.tv_network?.name) {
      broadcasts.push({
        name: game.tv_network.name,
        url:
          game.tv_network.url ??
          game.tv_network.link ??
          undefined,
      });
    }

    if (game.jonron_tv) {
      broadcasts.push({
        name: "Jonrón TV",
        url: game.jonron_tv,
      });
    }

    return Array.from(
      new Map(
        broadcasts.map(
          (broadcast) => [
            broadcast.name,
            broadcast,
          ]
        )
      ).values()
    );
  } catch {
    return [];
  }
}
