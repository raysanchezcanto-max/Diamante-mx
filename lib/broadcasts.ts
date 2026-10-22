import {
  getLmbOfficialBroadcasts,
} from "./lmbLive";
import type { LeagueCode } from "./teamLogos";

export type Broadcast = {
  name: string;
  type: "TV" | "Streaming" | "Radio";
  url?: string;
  fallback?: boolean;
};

const MLB_API =
  "https://statsapi.mlb.com/api/v1";
function getMlbBroadcastUrl(
  name: string
): string | undefined {
  const normalized =
    name.toLowerCase();

  if (normalized.includes("mlb.tv")) {
    return "https://www.mlb.com/live-stream-games";
  }

  if (normalized.includes("espn")) {
    return "https://www.espn.com/watch/";
  }

  if (normalized.includes("fox")) {
    return "https://www.foxsports.com/live";
  }

  if (normalized.includes("apple tv")) {
    return "https://tv.apple.com/";
  }

  if (normalized.includes("roku")) {
    return "https://therokuchannel.roku.com/";
  }

  if (normalized.includes("tbs")) {
    return "https://www.tbs.com/watchtbs";
  }

  if (normalized.includes("mlb network")) {
    return "https://www.mlb.com/network";
  }
if (normalized.includes("rockies.tv")) {
  return "https://www.mlb.com/rockies/schedule/watch";
}

if (
  normalized.includes("detroit sportsnet")
) {
  return "https://www.mlb.com/live-stream-games/subscribe/detroitsportsnet";
}

return undefined;
}
/*
  Transmisiones LMB que administramos
  manualmente cuando la API no proporciona
  esa información.

  Serie del Rey 2026:
  LMB.TV transmite oficialmente los juegos
  y Claro Sports anunció la serie completa.
*/
const LMB_BROADCASTS:
  Record<number, Broadcast[]> = {
  [-2026091101]: [
  {
    name: "LMB.TV",
    type: "Streaming",
    url: "https://www.lmb.tv/",
  },
  {
    name: "Claro Sports",
    type: "Streaming",
    url: "https://www.clarosports.com/",
  },
  {
    name: "YouTube · Azteca Deportes",
    type: "Streaming",
    url: "https://www.youtube.com/@AztecaDeportes",
  },
],

  [-2026091201]: [
    {
      name: "LMB.TV",
    type: "Streaming",
    url: "https://www.lmb.tv/",
  },
  {
    name: "Claro Sports",
    type: "Streaming",
    url: "https://www.clarosports.com/",
  },
  {
    name: "YouTube · Azteca Deportes",
    type: "Streaming",
    url: "https://www.youtube.com/@AztecaDeportes",
  },
],
};
async function getLmpOfficialBroadcasts(
  gameId: number
): Promise<Broadcast[]> {
  try {
    const gameResponse = await fetch(
      `${MLB_API}/schedule?gamePk=${gameId}&sportId=17`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!gameResponse.ok) {
      return [];
    }

    const gameData =
      await gameResponse.json();

    const game =
      gameData?.dates?.[0]?.games?.[0];

    if (!game) {
      return [];
    }

    const awayName =
      String(
        game?.teams?.away?.team?.name ?? ""
      );

    const homeName =
      String(
        game?.teams?.home?.team?.name ?? ""
      );
const awayTeamId =
  Number(
    game?.teams?.away?.team?.id ?? 0
  );

const homeTeamId =
  Number(
    game?.teams?.home?.team?.id ?? 0
  );
    const gameDate =
      new Date(game.gameDate);

    if (
      !awayName ||
      !homeName ||
      Number.isNaN(gameDate.getTime())
    ) {
      return [];
    }

    const dateParts =
      new Intl.DateTimeFormat(
        "en-US",
        {
          timeZone: "America/Mexico_City",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }
      ).formatToParts(gameDate);

    const year =
      dateParts.find(
        (part) => part.type === "year"
      )?.value;

    const month =
      dateParts.find(
        (part) => part.type === "month"
      )?.value;

    const day =
      dateParts.find(
        (part) => part.type === "day"
      )?.value;

    if (!year || !month || !day) {
      return [];
    }

    const date =
      `${year}-${month}-${day}`;

    const lmpResponse = await fetch(
  `https://api.lmp.mx/3.00/scoreboard?date=${date}&days_next=21&days_prev=0`,
  {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      Referer: "https://www.lmp.mx/",
      Origin: "https://www.lmp.mx",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/156 Safari/537.36",
    },
  }
);

    if (!lmpResponse.ok) {
      return [];
    }

    const lmpData =
      await lmpResponse.json();
    console.log("[LMP DEBUG RESPONSE]", {
  status: lmpResponse.status,
  date,
  keys: Object.keys(lmpData ?? {}),
});

    const games: any[] = [];

    const collectGames = (
      value: any
    ) => {
      if (!value) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(collectGames);
        return;
      }

      if (typeof value !== "object") {
        return;
      }

      if (
        (value.awayTeamShort ||
          value.awayTeam) &&
        (value.homeTeamShort ||
          value.homeTeam)
      ) {
        games.push(value);
      }

      Object.values(value).forEach(
        collectGames
      );
    };

    collectGames(lmpData);
    console.log(
  "[LMP DEBUG GAMES]",
  games.map((item: any) => ({
    awayTeamID:
      item?.awayTeamID ??
      item?.awayTeamId,
    awayTeam: item?.awayTeam,
    awayTeamShort:
      item?.awayTeamShort,
    homeTeamID:
      item?.homeTeamID ??
      item?.homeTeamId,
    homeTeam: item?.homeTeam,
    homeTeamShort:
      item?.homeTeamShort,
    channels: item?.channels,
  }))
);

    const normalize = (
      value: string
    ) =>
      value
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .toLowerCase()
        .trim();

    const normalizedAway =
      normalize(awayName);

    const normalizedHome =
      normalize(homeName);

  const lmpGame =
  games.find(
    (item: any) =>
      Number(
  item?.awayTeamID ??
    item?.awayTeamId
) === awayTeamId &&
Number(
  item?.homeTeamID ??
    item?.homeTeamId
) === homeTeamId
  ) ??
  games.find((item: any) => {
    const awayNames = [
      item.awayTeamShort,
      item.awayTeam,
    ]
      .map((name) =>
        normalize(
          String(name ?? "")
        )
      )
      .filter(Boolean);

    const homeNames = [
      item.homeTeamShort,
      item.homeTeam,
    ]
      .map((name) =>
        normalize(
          String(name ?? "")
        )
      )
      .filter(Boolean);

    const awayMatches =
      awayNames.some(
        (name) =>
          normalizedAway.includes(name) ||
          name.includes(normalizedAway)
      );

    const homeMatches =
      homeNames.some(
        (name) =>
          normalizedHome.includes(name) ||
          name.includes(normalizedHome)
      );

    return (
      awayMatches &&
      homeMatches
    );
  });
console.log("[LMP DEBUG MATCH]", {
  gameId,
  awayTeamId,
  homeTeamId,
  awayName,
  homeName,
  found: Boolean(lmpGame),
  lmpAwayTeamID:
    lmpGame?.awayTeamID ??
    lmpGame?.awayTeamId,
  lmpHomeTeamID:
    lmpGame?.homeTeamID ??
    lmpGame?.homeTeamId,
  channels: lmpGame?.channels,
});
       
    if (
      !lmpGame ||
      !Array.isArray(
        lmpGame.channels
      )
    ) {
      return [];
    }

    return lmpGame.channels
      .filter(
        (channel: any) =>
          channel?.title
      )
      .map(
        (channel: any): Broadcast => {
          const title =
            String(channel.title);

          const url =
            String(
              channel.url ?? ""
            ).trim();

          const isYoutube =
            title
              .toLowerCase()
              .includes("youtube");

          return {
            name: isYoutube
              ? "YouTube · LMP"
              : title,
            type: isYoutube
              ? "Streaming"
              : "TV",
            url:
              url || undefined,
            fallback: !url,
          };
        }
      );
  } catch {
    return [];
  }
}
async function getMlbBroadcasts(
  gameId: number,
  sportId = 1

): Promise<Broadcast[]> {
  try {
    const response = await fetch(
     `${MLB_API}/schedule?gamePk=${gameId}&sportId=${sportId}&hydrate=broadcasts`,
      {
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    const game =
      data?.dates?.[0]?.games?.[0];

    const broadcasts =
      game?.broadcasts ?? [];

  const mappedBroadcasts: Broadcast[] =
  broadcasts
   .filter((broadcast: any) => {
  if (!broadcast?.name) {
    return false;
  }

  const type = String(
    broadcast?.type ?? ""
  ).toLowerCase();

  const name = String(
    broadcast.name
  ).toLowerCase();

  const isRadio =
    type.includes("radio") ||
    type === "am" ||
    type === "fm" ||
    name.includes(" am") ||
    name.includes(" fm") ||
    name.includes("am/") ||
    name.includes("fm/") ||
    /\d+am/i.test(name) ||
    /\d+fm/i.test(name);

  return !isRadio;
})
    .map(
  (broadcast: any): Broadcast => {
    const directUrl =
      getMlbBroadcastUrl(
        broadcast.name
      );

    return {
      name: broadcast.name,

      type:
        broadcast.type === "radio"
          ? "Radio"
          : broadcast.type === "TV"
            ? "TV"
            : "Streaming",

      url:
        directUrl ??
        "https://www.mlb.com/live-stream-games",

      fallback: !directUrl,
    };
  }
);

return Array.from(
  new Map(
    mappedBroadcasts.map(
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

export async function getGameBroadcasts(
  league: LeagueCode,
  gameId: number
): Promise<Broadcast[]> {
  if (league === "MLB") {
    return getMlbBroadcasts(gameId);
  }

  if (league === "LMP") {
    const [official, statsApi] =
      await Promise.all([
        getLmpOfficialBroadcasts(gameId),
        getMlbBroadcasts(gameId, 17),
      ]);

    return Array.from(
      new Map(
        [...official, ...statsApi].map(
          (broadcast) => [
            broadcast.name.toLowerCase(),
            broadcast,
          ]
        )
      ).values()
    );
  }

  if (league === "LMB") {
    const official =
      await getLmbOfficialBroadcasts(
        gameId
      );

    if (official.length > 0) {
      return official.map(
        (broadcast): Broadcast => ({
          name: broadcast.name,
          type: "Streaming",
          url: broadcast.url,
          fallback: !broadcast.url,
        })
      );
    }

    if (LMB_BROADCASTS[gameId]) {
      return LMB_BROADCASTS[gameId];
    }
  }

  return [];
}
