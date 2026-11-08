import { cache } from "react";

/**
 * MLB.TV's Media Center supports date-scoped URLs (year/month/day).
 * This opens a calendar/day listing, never a game-specific paid player.
 * Use the MLB broadcast's archival metadata before showing this link.
 */
export function mlbTvArchiveDayUrl(startTime: string | undefined): string | null {
  if (!startTime) return null;
  const date = new Date(startTime);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (key: string) => parts.find(p => p.type === key)?.value;
  const year = part("year"), month = part("month"), day = part("day");
  return year && month && day
    ? `https://www.mlb.com/live-stream-games/${year}/${month}/${day}`
    : null;
}

/**
 * MLB Film Room has a gamePk-scoped page for videos and highlights.
 * It is NOT a full-game replay. Verify the actual destination before
 * displaying it, so unpublished games or unavailable pages stay hidden.
 */
export const getMlbGameVideoCollection = cache(async (
  gameId: number,
): Promise<string | null> => {
  if (!Number.isSafeInteger(gameId) || gameId <= 0) return null;
  const expected = `https://www.mlb.com/video/game/${gameId}`;
  try {
    const response = await fetch(expected, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5500),
      headers: { Accept: "text/html" },
    });
    if (!response.ok ||
        !response.headers.get("content-type")?.includes("text/html") ||
        !response.url.startsWith(expected)) return null;

    const body = await response.text();
    if (body.length > 2_000_000) return null;
    // This distinguishes the official game video page from error or
    // site-wide search pages. The full video is *not* asserted available.
    const exactPath = new RegExp(`(?:video\\/game\\/)${gameId}(?!\\d)`, "i");
    const isVideoPage = /Game Video Highlights|MLB Film Room/i.test(body);
    return exactPath.test(body) && isVideoPage ? expected : null;
  } catch {
    return null;
  }
});
