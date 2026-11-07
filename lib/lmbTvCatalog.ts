import { cache } from "react";

/**
 * Public LMB.TV match catalog. This is NOT a playback API.
 *
 * The /results/YYYY/all page publishes two team logos (alt attributes),
 * a localizable Unix start timestamp, and a /watch/<uuid> link per item.
 * A video is linked only after an unambiguous team/date/time match.
 * If the markup changes or a game is rescheduled, return null instead
 * of inventing an ID or sending a fan to a different game.
 */

type CatalogMatch = {
  away: string;
  home: string;
  startsAt: number;
  url: string;
};

const LMBTV_HOST = "https://www.lmb.tv";
const MATCH_TOLERANCE_MS = 45 * 60 * 1000;

const mexicoDateParts = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function mexicoDateKey(date: Date): string {
  const parts = mexicoDateParts.formatToParts(date);
  const read = (type: string) => parts.find(p => p.type === type)?.value ?? "";
  return `${read("year")}-${read("month")}-${read("day")}`;
}

function htmlDecode(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, value: string) =>
      String.fromCodePoint(parseInt(value, 16)))
    .replace(/&#(\d+);/g, (_, value: string) =>
      String.fromCodePoint(parseInt(value, 10)))
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function normalizeTeam(value: string): string {
  return htmlDecode(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bdel\b/g, "de")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// The page is server-rendered; read only the public results items.
// This does not attempt to enter a paid player or scrape a stream.
export function parseLmbTvResultCatalog(html: string): CatalogMatch[] {
  if (!html || html.length > 5_000_000) return [];

  const items = html.split(/<div\s+class=(?:"|')?item(?:"|')?\s*>/i).slice(1);
  const matches: CatalogMatch[] = [];
  const seen = new Set<string>();

  for (const block of items) {
    const heads = [...block.matchAll(/<div\s+class=(?:"|')?team(?:"|')?\s*>\s*<img\b[^>]*\balt=(?:"([^"]+)"|'([^']+)')/gi)];
    if (heads.length !== 2) continue;

    const time = block.match(/\bdata-time-to-local=(?:"|')?(\d{10,13})(?:"|')?/i);
    const watch = block.match(/\bhref=(?:"|')?\/watch\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:"|')?/i);
    if (!time || !watch) continue;

    const unix = Number(time[1]);
    const timestamp = unix < 1e11 ? unix * 1000 : unix;
    if (!Number.isFinite(timestamp) || seen.has(watch[1])) continue;

    const away = htmlDecode(heads[0][1] ?? heads[0][2] ?? "");
    const home = htmlDecode(heads[1][1] ?? heads[1][2] ?? "");
    if (!away || !home || /to be determined|por definir|\btbd\b/i.test(away + " " + home)) continue;

    seen.add(watch[1]);
    matches.push({
      away,
      home,
      startsAt: timestamp,
      url: `${LMBTV_HOST}/watch/${watch[1]}`,
    });
  }
  return matches;
}

const getYearCatalog = cache(async (year: number): Promise<CatalogMatch[]> => {
  if (!Number.isInteger(year) || year < 2020 || year > 2100) return [];

  try {
    const response = await fetch(`${LMBTV_HOST}/results/${year}/all`, {
      next: { revalidate: year >= new Date().getUTCFullYear() ? 300 : 21600 },
      signal: AbortSignal.timeout(6500),
      headers: { Accept: "text/html" },
    });
    if (!response.ok) return [];

    return parseLmbTvResultCatalog(await response.text());
  } catch {
    return [];
  }
});

export async function findLmbTvGamePage(context: {
  startTime?: string;
  away?: string;
  home?: string;
}): Promise<string | null> {
  if (!context.startTime || !context.away || !context.home) return null;

  const gameTime = new Date(context.startTime);
  if (!Number.isFinite(gameTime.getTime())) return null;
  const season = Number(mexicoDateKey(gameTime).slice(0, 4));
  const items = await getYearCatalog(season);

  const targetDay = mexicoDateKey(gameTime);
  const away = normalizeTeam(context.away);
  const home = normalizeTeam(context.home);

  // Never swap away/home, nor infer a recording from team names alone.
  const candidates = items.filter(item =>
    normalizeTeam(item.away) === away &&
    normalizeTeam(item.home) === home &&
    mexicoDateKey(new Date(item.startsAt)) === targetDay &&
    Math.abs(item.startsAt - gameTime.getTime()) <= MATCH_TOLERANCE_MS
  );

  // Multiple videos may represent a suspension, resumed game,
  // pre-game or a doubleheader. Keep fallback rather than guessing.
  return candidates.length === 1 ? candidates[0].url : null;
}
