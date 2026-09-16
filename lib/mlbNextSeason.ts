export async function getMlbNextSeasonStart(
  seasonYear: number
): Promise<Date | null> {
  try {
    const startDate =
      `${seasonYear}-01-01`;

    const endDate =
      `${seasonYear}-05-31`;

    const response = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&gameType=R&startDate=${startDate}&endDate=${endDate}`,
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

    const data =
      await response.json();

    const dates =
      Array.isArray(data?.dates)
        ? data.dates
        : [];

    if (dates.length === 0) {
      return null;
    }

    const firstDate =
      dates
        .map(
          (item: any) =>
            item?.date
        )
        .filter(Boolean)
        .sort()[0];

    if (!firstDate) {
      return null;
    }

    const parsed =
      new Date(
        `${firstDate}T12:00:00-06:00`
      );

    return Number.isNaN(
      parsed.getTime()
    )
      ? null
      : parsed;
  } catch {
    return null;
  }
}
