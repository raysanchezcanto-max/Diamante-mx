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
 return "https://www.mlb.com/live-stream-games";
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
async function getMlbBroadcasts(
  gameId: number
): Promise<Broadcast[]> {
  try {
    const response = await fetch(
      `${MLB_API}/schedule?gamePk=${gameId}&sportId=1&hydrate=broadcasts`,
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
      (broadcast: any): Broadcast => ({
        name: broadcast.name,

        type:
          broadcast.type === "radio"
            ? "Radio"
            : broadcast.type === "TV"
              ? "TV"
              : "Streaming",

        url: getMlbBroadcastUrl(
          broadcast.name
        ),
      })
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

  if (
    league === "LMB" &&
    LMB_BROADCASTS[gameId]
  ) {
    return LMB_BROADCASTS[gameId];
  }

  /*
    LMP se conectará cuando se publiquen
    oficialmente las transmisiones de la
    temporada 2026-2027.
  */
  return [];
}
