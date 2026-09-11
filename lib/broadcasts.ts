import type { LeagueCode } from "./teamLogos";

export type Broadcast = {
  name: string;
  type: "TV" | "Streaming" | "Radio";
  url?: string;
};

const MLB_API =
  "https://statsapi.mlb.com/api/v1";

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

    return broadcasts
      .filter(
        (broadcast: any) =>
          broadcast?.name
      )
      .map(
        (broadcast: any): Broadcast => ({
          name: broadcast.name,

          type:
            broadcast.type === "radio"
              ? "Radio"
              : broadcast.type === "TV"
                ? "TV"
                : "Streaming",
        })
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
