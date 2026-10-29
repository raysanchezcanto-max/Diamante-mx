
type League = "MLB" | "LMB" | "LMP";

export async function getSourceActivity(
  league: League
): Promise<boolean> {
  try {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    let url: string;

    if (league === "LMB") {
      const [year, month, day] = today.split("-");

      const startDate = new Date(
        `${today}T00:00:00-06:00`
      ).getTime();

      const endDate = new Date(
        `${today}T23:59:59.999-06:00`
      ).getTime();

      url =
        `https://lmb.com.mx/juegos/api/calendar` +
        `?date=${month}/${day}/${year}` +
        `&daysFromNow=0` +
        `&startDate=${startDate}` +
        `&endDate=${endDate}`;
    } else {
      const params =
        league === "LMP"
          ? "sportId=17&leagueId=132"
          : "sportId=1";

      url =
        `https://statsapi.mlb.com/api/v1/schedule` +
        `?${params}&date=${today}`;
    }

    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return false;

    const data = await response.json();

    if (league === "LMB") {
      return (
        Array.isArray(data?.games_info) &&
        data.games_info.length > 0
      );
    }

    return (
      Array.isArray(data?.dates) &&
      data.dates.some(
        (day: {
          date?: string;
          games?: unknown[];
        }) =>
          day.date === today &&
          Array.isArray(day.games) &&
          day.games.length > 0
      )
    );
  } catch {
    return false;
  }
}
