import { cache } from "react";

// Only links whose MLB.com video pages explicitly tag the exact LMP gamePk.
// Never construct a video slug from teams or assume a live stream exists.
// Historical candidates for 2026-11-07 (850466, 850456, 850465) were
// withdrawn after all three official MLB.com pages returned HTTP 404 on
// 2026-11-08. Keep this map empty until a NEW direct page is confirmed.
// An archived slug must never be offered from a previously cached HTTP 200.
const VERIFIED_PAGES: Readonly<Record<number, { date: string; url: string }>> = {};

// The gamePk Film Room search is intentionally disabled for LMP:
// a valid query can render zero results (confirmed in a real browser).
// Only independently verified exact-game video pages are surfaced.

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
      cache: "no-store",
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
