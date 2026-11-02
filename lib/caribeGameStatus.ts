import type { CaribeMatch } from "./caribeTournament";

export type CaribeDisplayStatus =
  | "PRÓXIMO"
  | "HOY"
  | "POR COMENZAR"
  | "EN VIVO"
  | "FINAL"
  | "POSPUESTO";

const TIME_ZONE = "America/Mexico_City";

function localDay(date: Date): string {
  if (!Number.isFinite(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return year && month && day ? `${year}-${month}-${day}` : "";
}

export function caribeDisplayStatus(
  game: CaribeMatch,
  now: Date = new Date(),
): CaribeDisplayStatus {
  if (game.state === "Final") return "FINAL";
  if (game.state === "Postponed") return "POSPUESTO";
  if (game.state === "Warmup") return "POR COMENZAR";
  if (game.state === "Live") return "EN VIVO";

  if (game.startTime && localDay(new Date(game.startTime)) === localDay(now)) {
    return "HOY";
  }

  return "PRÓXIMO";
}

export function caribeDisplayStatusClass(status: CaribeDisplayStatus): string {
  switch (status) {
    case "HOY": return "caribeStatusToday";
    case "POR COMENZAR": return "caribeStatusWarmup";
    case "EN VIVO": return "caribeStatusLive";
    case "FINAL": return "caribeStatusFinal";
    case "POSPUESTO": return "caribeStatusPostponed";
    default: return "caribeStatusUpcoming";
  }
}
