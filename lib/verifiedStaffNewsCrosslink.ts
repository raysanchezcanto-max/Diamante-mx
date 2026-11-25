import { verifiedPersonnelEventsForClub, type VerifiedPersonnelEvent } from "./verifiedPersonnelEvents.ts";

/**
 * Noticias ↔ Movimientos de cuerpo técnico: solamente la misma URL primaria
 * registrada para ESE club y liga. Nunca inferir por titular, apellido o fecha.
 */
function canonicalVerifiedArticle(raw: string, league: "LMB" | "LMP"): string | null {
  try {
    const url = new URL(raw);
    const allowedHost = league === "LMB" ? "lmb.com.mx" : "editor.lmp.mx";
    if (url.protocol !== "https:" || url.hostname !== allowedHost ||
        url.username || url.password || url.port || url.search || url.hash) return null;
    const pattern = league === "LMB"
      ? /^\/noticias\/[a-z0-9-]+\/?$/
      : /^\/[a-z0-9-]+\/?$/;
    if (!pattern.test(url.pathname)) return null;
    return url.origin + url.pathname.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

export function verifiedStaffNewsForClub(
  league: "LMB" | "LMP",
  clubSlug: string,
  articleUrl: string,
): VerifiedPersonnelEvent[] {
  const canonical = canonicalVerifiedArticle(articleUrl, league);
  if (!canonical) return [];
  return verifiedPersonnelEventsForClub(league, clubSlug).filter(event =>
    canonicalVerifiedArticle(event.url, league) === canonical
  );
}
