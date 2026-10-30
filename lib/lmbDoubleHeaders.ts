
import type { Game } from "./mlb";

export function inferLmbDoubleHeaders(
  games: Game[]
): Game[] {
  const groups = new Map<string, Game[]>();

  const dateFormat = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  );

  for (const game of games) {
    const time = Date.parse(game.startTime);

    if (!game.id || !Number.isFinite(time)) {
      continue;
    }

    const teams = [game.away, game.home]
      .map((name) => name.trim().toLowerCase())
      .sort()
      .join("|");

    const day = dateFormat.format(new Date(time));
    const key = `${day}|${teams}`;

    groups.set(key, [
      ...(groups.get(key) ?? []),
      game,
    ]);
  }

  const inferred = new Map<number, 1 | 2>();

  for (const group of groups.values()) {
    if (group.length !== 2) continue;

    const [first, second] = [...group].sort(
      (a, b) =>
        Date.parse(a.startTime) -
        Date.parse(b.startTime)
    );

    if (
      first.id === second.id ||
      first.startTime === second.startTime ||
      first.doubleHeader === "Y" ||
      first.doubleHeader === "S" ||
      second.doubleHeader === "Y" ||
      second.doubleHeader === "S"
    ) {
      continue;
    }

    inferred.set(first.id, 1);
    inferred.set(second.id, 2);
  }

  return games.map((game) => {
    const number = inferred.get(game.id);

    return number
      ? {
          ...game,
          gameNumber: number,
          doubleHeader: "INFERRED",
        }
      : game;
  });
}
