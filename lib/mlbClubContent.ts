import { mlbOfficialTeamUrl, type MlbClub } from "./mlbClubDirectory";
import { translateMlbTransaction } from "./mlbTransactionSpanish";
import { translateBaseballText } from "./translateBaseball";
import { isReportedMlbHeadline } from "./mlbNewsAttribution";
import { officialMlbTradeSide, type MlbTradeDirection } from "./mlbNewsMovements";

const API = "https://statsapi.mlb.com/api/v1";
const mxDate = (date = new Date()) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
const season = () => Number(mxDate().slice(0, 4));

async function getJson(path: string, seconds = 1800): Promise<any | null> {
  try {
    const response = await fetch(API + path, {
      next: { revalidate: seconds },
      headers: { Accept: "application/json" },
    });
    return response.ok ? await response.json() : null;
  } catch { return null; }
}

export type MlbClubOverview = {
  name: string; division: string; league: string;
  stadium: string | null; capacity: number | null; firstYear: string | null;
  venueId: number | null;
};
export async function getMlbClubOverview(club: MlbClub): Promise<MlbClubOverview> {
  const data = await getJson("/teams/" + club.id + "?hydrate=division,league,venue", 86400);
  const t = data?.teams?.[0];
  const firstYear = typeof t?.firstYearOfPlay === "string" && /^\d{4}$/.test(t.firstYearOfPlay)
    ? t.firstYearOfPlay : null;
  const venueId = Number(t?.venue?.id);
  const stadiumData = Number.isInteger(venueId) && venueId > 0
    ? await getJson("/venues/" + venueId + "?hydrate=fieldInfo", 86400) : null;
  const venue = stadiumData?.venues?.[0] ?? t?.venue;
  const rawCapacity = venue?.fieldInfo?.capacity ?? t?.venue?.fieldInfo?.capacity;
  const capacity = Number(rawCapacity);
  const divisions: Record<number, string> = {
    200: "Liga Americana Oeste", 201: "Liga Americana Este", 202: "Liga Americana Central",
    203: "Liga Nacional Oeste", 204: "Liga Nacional Este", 205: "Liga Nacional Central",
  };
  const leagues: Record<number, string> = { 103: "Liga Americana", 104: "Liga Nacional" };
  return {
    name: club.name,
    division: divisions[Number(t?.division?.id)] ??
      (typeof t?.division?.name === "string" ? t.division.name : "División por verificar"),
    league: leagues[Number(t?.league?.id)] ??
      "Grandes Ligas",
    stadium: typeof t?.venue?.name === "string" ? t.venue.name : null,
    capacity: Number.isInteger(capacity) && capacity > 0 ? capacity : null,
    firstYear,
    venueId: Number.isInteger(venueId) ? venueId : null,
  };
}

export type MlbClubPlayer = { id: number; name: string; number: string; position: string };
export type MlbClubRosterGroup = { name: string; players: MlbClubPlayer[] };
export type MlbClubRoster = { sourceStatus: "connected" | "unavailable"; groups: MlbClubRosterGroup[] };
export async function getMlbClubRoster(club: MlbClub): Promise<MlbClubRoster> {
  const data = await getJson("/teams/" + club.id + "/roster?rosterType=40Man&season=" + season());
  if (!Array.isArray(data?.roster)) return { sourceStatus: "unavailable", groups: [] };
  const categories = ["Lanzadores", "Receptores", "Jugadores de cuadro", "Jardineros", "Otros"];
  const groups = new Map<string, MlbClubPlayer[]>(categories.map(name => [name, []]));
  for (const row of data.roster) {
    const id = Number(row?.person?.id);
    const name = row?.person?.fullName;
    if (!Number.isInteger(id) || typeof name !== "string") continue;
    const pos = String(row?.position?.type ?? "").toLowerCase();
    const category = pos.includes("pitch") ? "Lanzadores" :
      pos.includes("catch") ? "Receptores" : pos.includes("infield") ? "Jugadores de cuadro" :
      pos.includes("outfield") ? "Jardineros" : "Otros";
    const positions: Record<string, string> = {
      P: "Lanzador", C: "Receptor", "1B": "Primera base", "2B": "Segunda base",
      "3B": "Tercera base", SS: "Campocorto", LF: "Jardinero izquierdo",
      CF: "Jardinero central", RF: "Jardinero derecho", OF: "Jardinero",
      IF: "Jugador de cuadro", DH: "Bateador designado", TWP: "Jugador de dos vías",
    };
    const abbreviation = String(row?.position?.abbreviation ?? "");
    groups.get(category)?.push({
      id, name,
      number: typeof row?.jerseyNumber === "string" && row.jerseyNumber.trim() ? row.jerseyNumber : "—",
      position: positions[abbreviation] ?? category,
    });
  }
  return {
    sourceStatus: "connected",
    groups: categories.map(name => ({ name, players: groups.get(name) ?? [] }))
      .filter(group => group.players.length > 0),
  };
}

export type MlbClubTransaction = {
  key: string; date: string; label: string; description: string; player: string | null;
  /** Alta de firma explícita, reconocida desde la descripción de StatsAPI. */
  isConfirmedSigning: boolean;
  /** Reclamo de waivers que identifica explícitamente al equipo receptor. */
  isConfirmedWaiverClaim: boolean;
  tradeDirection: MlbTradeDirection | null;
  tradeCounterpart: string | null;
};
export type MlbClubTransactions = {
  sourceStatus: "connected" | "unavailable"; items: MlbClubTransaction[];
};
export async function getMlbClubTransactions(club: MlbClub): Promise<MlbClubTransactions> {
  const end = new Date(), start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 90);
  const data = await getJson("/transactions?teamId=" + club.id +
    "&startDate=" + mxDate(start) + "&endDate=" + mxDate(end), 1800);
  if (!Array.isArray(data?.transactions)) return { sourceStatus: "unavailable", items: [] };
  const items = data.transactions.flatMap((row: any, index: number) => {
    const date = String(row?.effectiveDate ?? row?.date ?? "");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
    const desc = typeof row?.description === "string" ? row.description.trim() : "";
    const player = typeof row?.person?.fullName === "string" ? row.person.fullName : null;
    // No inferir equipo receptor/origen por el lenguaje natural del texto.
    const trade = player?.trim() ? officialMlbTradeSide(row, club.id) : null;
    const translated = translateMlbTransaction(
      desc,
      String(row?.typeDesc ?? row?.type?.description ?? ""),
      player,
      club.name,
    );
    return [{
      key: String(row?.id ?? index) + "-" + date, date,
      label: translated.label,
      description: translated.description,
      player,
      isConfirmedSigning: Boolean(player?.trim()) &&
        desc.toLowerCase().startsWith(club.name.toLowerCase() + " signed "),
      isConfirmedWaiverClaim: Boolean(player?.trim()) &&
        desc.toLowerCase().startsWith(club.name.toLowerCase() + " claimed ") &&
        /\boff waivers\b/i.test(desc),
      tradeDirection: trade?.direction ?? null,
      tradeCounterpart: trade?.counterpart ?? null,
    } satisfies MlbClubTransaction];
  });
  // StatsAPI puede incluir la misma operación como registro general y como
  // registro individual del jugador. Preferimos la ficha con jugador identificado.
  // No unificamos movimientos genéricos sin jugador: podrían ser hechos distintos.
  const unique = new Map<string, MlbClubTransaction>();
  for (const item of items) {
    const identity = item.date + "|" + item.label + "|" + item.description;
    const prior = unique.get(identity);
    if (prior && (prior.player || item.player)) {
      if (!prior.player && item.player) unique.set(identity, item);
      continue;
    }
    unique.set(prior ? identity + "|" + item.key : identity, item);
  }
  const distinct = [...unique.values()];
  distinct.sort((a: MlbClubTransaction, b: MlbClubTransaction) => b.date.localeCompare(a.date));
  return { sourceStatus: "connected", items: distinct.slice(0, 25) };
}

export type MlbClubFixture = {
  id: number; date: string; away: string; home: string; awayId: number; homeId: number;
};
export async function getMlbClubNextGame(club: MlbClub): Promise<MlbClubFixture | null> {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() + 240);
  const data = await getJson("/schedule?sportId=1&teamId=" + club.id +
    "&startDate=" + mxDate() + "&endDate=" + mxDate(end), 1800);
  const games = (Array.isArray(data?.dates) ? data.dates : [])
    .flatMap((date: any) => Array.isArray(date?.games) ? date.games : [])
    .filter((g: any) =>
      Number.isFinite(Date.parse(g?.gameDate)) &&
      Date.parse(g.gameDate) >= Date.now() &&
      g?.status?.abstractGameState !== "Final"
    ).sort((a: any, b: any) => Date.parse(a.gameDate) - Date.parse(b.gameDate));
  const g = games[0];
  if (!g) return null;
  return {
    id: Number(g.gamePk ?? 0), date: g.gameDate,
    away: String(g.teams?.away?.team?.name ?? "Visitante"),
    home: String(g.teams?.home?.team?.name ?? "Local"),
    awayId: Number(g.teams?.away?.team?.id ?? 0),
    homeId: Number(g.teams?.home?.team?.id ?? 0),
  };
}

/** Estadísticas agregadas de temporada regular: cada dato pertenece exclusivamente al club. */
export type MlbClubSeasonStats = {
  season: number;
  batting: {
    runs: string; homeRuns: string; avg: string;
    obp: string; hits: string; stolenBases: string;
  } | null;
  pitching: {
    era: string; whip: string; strikeOuts: string;
    saves: string; wins: string; losses: string;
  } | null;
};
function officialTeamStats(json: any): Record<string, unknown> | null {
  if (!Array.isArray(json?.stats)) return null;
  for (const group of json.stats) {
    if (!Array.isArray(group?.splits)) continue;
    const row = group.splits.find((entry: any) => entry?.stat && typeof entry.stat === "object");
    if (row?.stat) return row.stat as Record<string, unknown>;
  }
  return null;
}
function statText(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value)
    : typeof value === "string" && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)
      ? value : "—";
}
async function officialSeasonStats(teamId: number, year: number): Promise<MlbClubSeasonStats | null> {
  const path = "/teams/" + teamId + "/stats?stats=season&season=" + year + "&group=";
  const [battingData, pitchingData] = await Promise.all([
    getJson(path + "hitting", 86400),
    getJson(path + "pitching", 86400),
  ]);
  const b = officialTeamStats(battingData), p = officialTeamStats(pitchingData);
  if (!b && !p) return null;
  return {
    season: year,
    batting: b ? {
      runs: statText(b.runs), homeRuns: statText(b.homeRuns),
      avg: statText(b.avg), obp: statText(b.obp),
      hits: statText(b.hits), stolenBases: statText(b.stolenBases),
    } : null,
    pitching: p ? {
      era: statText(p.era), whip: statText(p.whip),
      strikeOuts: statText(p.strikeOuts), saves: statText(p.saves),
      wins: statText(p.wins), losses: statText(p.losses),
    } : null,
  };
}
export async function getMlbClubSeasonStats(club: MlbClub): Promise<MlbClubSeasonStats | null> {
  const current = season();
  return await officialSeasonStats(club.id, current)
    ?? await officialSeasonStats(club.id, current - 1);
}

/** Titulares publicados en el canal del club en MLB.com (incluye reportes). */
export type MlbClubNewsStory = {
  title: string; url: string; date: string | null; isSourcedReport: boolean;
  /** Titular sin traducir: permite relacionar con el nombre del registro MLB. */
  originalTitle: string;
};
export type MlbClubNews = {
  sourceStatus: "connected" | "unavailable";
  items: MlbClubNewsStory[];
};
const englishHeadlineWords = /\b(the|with|after|before|from|about|for|into|will|could|would|should|against|wins|win|loses|loss|deal|signs|signed|named|latest|best|highlights|update|ahead|behind|rookie|pitcher|season|spring|game|series|trade|injury|report)\b/i;
async function spanishHeadline(title: string, clubName: string, order: number): Promise<string> {
  // DeepL es opcional. Sin traducción verificable se evita publicar inglés sin traducir.
  const translated = await translateBaseballText(title, 1800);
  if (translated.trim() !== title.trim() && !englishHeadlineWords.test(translated)) {
    return translated;
  }
  // Si el traductor no devuelve una traducción fiable, conservar el titular
  // oficial original: un rótulo genérico ocultaría la noticia real.
  return title;
}
function rssText(value: string): string {
  const plain = value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, "").trim();
  return plain.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, entity => {
    const known: Record<string, string> = {
      "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<",
      "&gt;": ">", "&nbsp;": " ",
    };
    if (known[entity.toLowerCase()]) return known[entity.toLowerCase()];
    const hex = entity.toLowerCase().startsWith("&#x");
    const value = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
    return Number.isInteger(value) && value > 0 && value <= 0x10ffff
      ? String.fromCodePoint(value) : entity;
  });
}
function rssItemField(item: string, tag: string): string {
  const match = item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">", "i"));
  return match ? rssText(match[1]) : "";
}
export async function getMlbClubNews(club: MlbClub): Promise<MlbClubNews> {
  try {
    const response = await fetch(mlbOfficialTeamUrl(club) + "/feeds/news/rss.xml", {
      next: { revalidate: 1800 },
      headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    });
    if (!response.ok) return { sourceStatus: "unavailable", items: [] };
    const xml = await response.text();
    if (!xml.includes("<rss") || !xml.includes("<item")) {
      return { sourceStatus: "unavailable", items: [] };
    }
    const items: MlbClubNewsStory[] = [];
    const seen = new Set<string>();
    for (const match of xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)) {
      const fragment = match[1];
      const title = rssItemField(fragment, "title");
      const url = rssItemField(fragment, "link");
      const published = rssItemField(fragment, "pubDate");
      if (!title || !url.startsWith("https://www.mlb.com/") || seen.has(url)) continue;
      seen.add(url);
      items.push({ title, originalTitle: title, url, isSourcedReport: isReportedMlbHeadline(title),
        date: Number.isFinite(Date.parse(published))
          ? new Date(published).toISOString() : null });
      // Revisar todas las entradas recibidas antes de elegir las seis más recientes.
    }
    // La fuente no siempre emite el RSS en orden cronológico; no aparentar actualidad.
    items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
    const localized = await Promise.all(items.slice(0, 6).map(async (item, index) => ({
      ...item, title: await spanishHeadline(item.title, club.name, index + 1),
    })));
    return { sourceStatus: "connected", items: localized };
  } catch {
    return { sourceStatus: "unavailable", items: [] };
  }
}
