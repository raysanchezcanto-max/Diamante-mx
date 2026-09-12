type SofaEvent = {
  id?: number;

  status?: {
    type?: string;
    description?: string;
  };

  homeTeam?: {
    name?: string;
  };

  awayTeam?: {
    name?: string;
  };

  homeScore?: {
    current?: number;
  };

  awayScore?: {
    current?: number;
  };
};

export type LmbLiveScore = {
  eventId: number | null;

  status: "Preview" | "Live" | "Final";

  home: string;
  away: string;

  homeRuns?: number;
  awayRuns?: number;

  detail?: string;
};

function mexicoDate(
  offsetDays = 0
) {
  const date =
    new Date(
      Date.now() +
        offsetDays *
          24 *
          60 *
          60 *
          1000
    );

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);
}

function normalizeName(
  value: string
) {
  return value
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase();
}

async function getEvents():
Promise<SofaEvent[]> {
  /*
    Olmecas de Tabasco en Sofascore:
    teamId = 66404

    Consultamos próximos y anteriores
    porque un juego en curso puede cambiar
    de colección según el estado.
  */
  const sources = [
    "https://www.sofascore.com/api/v1/team/66404/events/next/0",
    "https://www.sofascore.com/api/v1/team/66404/events/last/0",
  ];

  const events: SofaEvent[] = [];

  for (const url of sources) {
    try {
      const response =
        await fetch(url, {
          cache: "no-store",
          headers: {
            Accept:
              "application/json",
            "User-Agent":
              "Mozilla/5.0",
          },
        });

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      if (
        Array.isArray(data?.events)
      ) {
        events.push(
          ...data.events
        );
      }
    } catch {
      // Probamos la siguiente fuente.
    }
  }

  return events;
}
  for (const url of sources) {
    try {
      const response =
        await fetch(url, {
          cache: "no-store",
          headers: {
            Accept:
              "application/json",
            "User-Agent":
              "Mozilla/5.0",
          },
        });

      if (!response.ok) {
        continue;
      }

      const data =
        await response.json();

      if (
        Array.isArray(data?.events)
      ) {
        return data.events;
      }
    } catch {
      // Probamos la siguiente fuente.
    }
  }



export async function
getLmbLiveScore():
Promise<LmbLiveScore | null> {
  /*
    El partido comienza por la
    noche en México, pero puede
    pertenecer al día siguiente
    en UTC.

    Por eso consultamos ambas
    fechas.
  */
  const events =
  await getEvents();

const event =
  events.find((item) => {
    const home =
      normalizeName(
        item.homeTeam?.name ??
          ""
      );

    const away =
      normalizeName(
        item.awayTeam?.name ??
          ""
      );

    const hasOlmecas =
      home.includes("olmecas") ||
      away.includes("olmecas");

    const hasTijuana =
      home.includes("tijuana") ||
      away.includes("tijuana");

    return (
      hasOlmecas &&
      hasTijuana
    );
  });

if (!event) {
  return null;
}

    const event =
      events.find((item) => {
        const home =
          normalizeName(
            item.homeTeam?.name ??
              ""
          );

        const away =
          normalizeName(
            item.awayTeam?.name ??
              ""
          );

        const hasOlmecas =
          home.includes("olmecas") ||
          away.includes("olmecas");

        const hasTijuana =
          home.includes("tijuana") ||
          away.includes("tijuana");

        return (
          hasOlmecas &&
          hasTijuana
        );
      });

    if (!event) {
      continue;
    }

    const type =
      String(
        event.status?.type ?? ""
      ).toLowerCase();

    const status:
      "Preview" |
      "Live" |
      "Final" =
      type.includes("progress") ||
      type.includes("live")
        ? "Live"
        : type.includes(
              "finished"
            )
          ? "Final"
          : "Preview";

    return {
      eventId:
        event.id ?? null,

      status,

      home:
        event.homeTeam?.name ??
        "Local",

      away:
        event.awayTeam?.name ??
        "Visitante",

      homeRuns:
        event.homeScore?.current,

      awayRuns:
        event.awayScore?.current,

      detail:
        event.status
          ?.description,
    };
  }

  return null;
}
