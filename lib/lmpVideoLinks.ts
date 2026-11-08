import { cache } from "react";

// Only links whose MLB.com video pages explicitly tag the exact LMP gamePk.
// Never construct a video slug from teams or assume a live stream exists.
const VERIFIED_PAGES: Readonly<Record<number, { date: string; url: string }>> = {
  850466: {
    date: "2026/11/07",
    url: "https://www.mlb.com/es/video/lmp-live-1-venados-vs-navojoa-251314",
  },
  850456: {
    date: "2026/11/07",
    url: "https://www.mlb.com/es/video/lmp-live-1-naranjeros-vs-algodoneros-251315",
  },
  850465: {
    date: "2026/11/07",
    url: "https://www.mlb.com/es/video/lmp-live-jaguares-vs-tomateros-251316",
  },
};

/**
 * MLB.com itself uses this gamePk filter in "Más De Este Juego".
 * This URL is a SEARCH, not a verified video or player.
 */
export function lmpOfficialVideosSearchUrl(gameId: number): string | null {
  if (!Number.isSafeInteger(gameId) || gameId <= 0) return null;
  const query = `ContentTags = ["gamepk-${gameId}"] Order by Timestamp DESC`;
  return `https://www.mlb.com/es/video/?q=${encodeURIComponent(query)}`;
}

/**
 * A previously published MLB video can disappear or return 404. Check that
 * the official page STILL exists and identifies the exact game; otherwise
 * never expose a broken or misassigned direct-video button.
 */
export const getVerifiedLmpGameVideo = cache(async (
  gameId: number,
  mexicoGameDate: string | undefined,
): Promise<string | null> => {
  const candidate = VERIFIED_PAGES[gameId];
  if (!candidate || candidate.date !== mexicoGameDate) return null;

  try {
    const response = await fetch(candidate.url, {
      next: { revalidate: 180 },
      signal: AbortSignal.timeout(5000),
      headers: { Accept: "text/html" },
    });
    if (!response.ok ||
        !response.headers.get("content-type")?.toLowerCase().includes("text/html") ||
        !response.url.startsWith("https://www.mlb.com/")) return null;

    const html = await response.text();
    if (html.length > 2_000_000) return null;

    // Exact gamePk tag is documented in MLB.com video's "Más De Este Juego".
    const exactGame = new RegExp(`gamepk-${gameId}(?!\\d)`, "i");
    const videoPage = /<title>[^<]*(?:EN VIVO|LMP LIVE)[^<]*<\/title>/i.test(html);
    return exactGame.test(html) && videoPage ? candidate.url : null;
  } catch {
    return null;
  }
});
