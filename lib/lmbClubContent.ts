import {
  ALGODONEROS_ROSTER,
  ALGODONEROS_STORIES,
} from "./algodonerosProfile";

export type OfficialStory = {
  title: string;
  url: string;
  label: string;
  imageUrl: string | null;
};
export type OfficialPlayer = {
  name: string;
  number: number;
  playerId: number;
};
export type OfficialRosterGroup = {
  name: string;
  players: OfficialPlayer[];
};
export type LmbSourceStatus = "connected" | "fallback";
export type NewsResult = {
  stories: OfficialStory[];
  sourceStatus: LmbSourceStatus;
};
export type OfficialVideo = {
  title: string;
  url: string;
  imageUrl: string | null;
};
export type VideosResult = {
  videos: OfficialVideo[];
  sourceStatus: LmbSourceStatus;
};
export type RosterResult = {
  roster: OfficialRosterGroup[];
  sourceStatus: LmbSourceStatus;
};

const BASE = "https://lmb.com.mx";
const REVALIDATE_SECONDS = 1800;
const ROSTER_GROUPS = [
  "Lanzadores", "Receptores", "Jugadores del cuadro", "Jardineros",
] as const;

function stripFlight(html: string): string {
  const boundary = html.indexOf("(self.__next_f");
  return boundary >= 0 ? html.slice(0, boundary) : html;
}

function decodeEntities(text: string): string {
  return text.replace(/&(?:amp|quot|apos|nbsp|lt|gt|#39|#x27|#(\d+)|#x([0-9a-f]+));/gi, (ent, decimal, hexadecimal) => {
    const named: Record<string, string> = {
      "&amp;": "&", "&quot;": '"', "&apos;": "'", "&nbsp;": " ",
      "&lt;": "<", "&gt;": ">", "&#39;": "'", "&#x27;": "'",
    };
    if (named[ent.toLowerCase()]) return named[ent.toLowerCase()];
    const code = decimal ? Number(decimal) : parseInt(hexadecimal, 16);
    return Number.isFinite(code) && code >= 32 && code <= 0x10ffff
      ? String.fromCodePoint(code) : ent;
  });
}

function plainText(markup: string): string {
  return decodeEntities(markup.replace(/<[^>]*>/g, " ")).replace(/\s+/g," ").trim();
}

function validClubSlug(slug: string): boolean {
  return /^[a-z0-9-]{2,48}$/.test(slug);
}

async function readOfficialHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "text/html" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) return null;
    const html = await response.text();
    return html.length > 3000 ? stripFlight(html) : null;
  } catch {
    return null;
  }
}

function externalPhoto(raw: string | undefined): string | null {
  if (!raw) return null;
  try {
    const decoded = decodeEntities(raw);
    const src = new URL(decoded, BASE);
    const original = src.pathname === "/_next/image"
      ? new URL(src.searchParams.get("url") ?? "", BASE)
      : src;
    if (original.protocol !== "https:") return null;
    // Solo assets de publicaciones oficiales conocidas, no hosts inesperados.
    if (original.hostname !== "d11rb39sj794dg.cloudfront.net" &&
        original.hostname !== "lmb.com.mx" &&
        original.hostname !== "img.mlbstatic.com" &&
        original.hostname !== "portland-data-prod-thumb.s3.amazonaws.com") return null;
    return original.href;
  } catch {
    return null;
  }
}

function readNewsFromOfficialHtml(html: string): OfficialStory[] {
  const start = html.indexOf(">Noticias principales<");
  if (start < 0) return [];
  const endIndex = html.indexOf(">Movimientos<", start);
  const section = html.slice(start, endIndex > start ? endIndex : Math.min(html.length, start + 85000));
  const list: OfficialStory[] = [];
  const seen = new Set<string>();
  const matchAnchor = /<a\b[^>]*href="(\/noticias\/[a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of section.matchAll(matchAnchor)) {
    const path = match[1];
    if (/\/(?:lmb|lms)-movimientos-en-/i.test(path) || seen.has(path)) continue;
    const fragment = match[2];
    const alt = fragment.match(/<img\b[^>]*\balt="([^"]+)"/i)?.[1];
    const heading = fragment.match(/<h[2-4]\b[^>]*>([\s\S]*?)<\/h[2-4]>/i)?.[1];
    const title = alt ? decodeEntities(alt).trim() : heading ? plainText(heading) : "";
    if (title.length < 12 || title.length > 220) continue;
    const src = fragment.match(/<img\b[^>]*\bsrc="([^"]+)"/i)?.[1];
    list.push({
      title,
      url: BASE + path,
      label: "Publicación oficial LMB",
      imageUrl: externalPhoto(src),
    });
    seen.add(path);
    if (list.length >= 20) break;
  }
  return list;
}

// Videos identificados POR la ficha oficial de este club. No usar clips de otra
// franquicia ni atribuirle videos de una colección genérica de la LMB.
function readVideosFromOfficialHtml(html: string): OfficialVideo[] {
  const start = html.indexOf(">Top Videos<");
  if (start < 0) return [];
  const end = html.indexOf(">Más Noticias<", start);
  const section = html.slice(start, end > start ? end : Math.min(html.length, start + 45000));
  const videos: OfficialVideo[] = [];
  const seen = new Set<string>();
  const anchor = /<a\b[^>]*href="(\/videos\/[0-9a-f-]{36})"[^>]*>([\s\S]*?)<\/a>/gi;
  for (const match of section.matchAll(anchor)) {
    if (seen.has(match[1])) continue;
    const fragment = match[2];
    const title = decodeEntities(fragment.match(/<img\b[^>]*\balt="([^"]+)"/i)?.[1] ?? "").trim();
    if (title.length < 12 || title.length > 180) continue;
    const src = fragment.match(/<img\b[^>]*\bsrc="([^"]+)"/i)?.[1];
    const imageUrl = externalPhoto(src);
    videos.push({ title, url: BASE + match[1], imageUrl });
    seen.add(match[1]);
    if (videos.length >= 4) break;
  }
  return videos;
}

export async function getLmbClubVideos(slug: string): Promise<VideosResult> {
  if (!validClubSlug(slug)) return { videos: [], sourceStatus: "fallback" };
  const html = await readOfficialHtml(BASE + "/equipos/" + slug);
  const videos = html ? readVideosFromOfficialHtml(html) : [];
  return { videos, sourceStatus: videos.length ? "connected" : "fallback" };
}

function readRosterFromOfficialHtml(html: string): OfficialRosterGroup[] {
  const first = html.indexOf("RosterList_headerTitle");
  if (first < 0) return [];
  const last = html.indexOf(">Titulares<", first);
  const rosterHtml = html.slice(Math.max(0, first - 500), last > first ? last : Math.min(html.length, first + 140000));
  const groups: OfficialRosterGroup[] = [];
  const seen = new Set<number>();
  let current: OfficialRosterGroup | null = null;
  const item = /<h3\b[^>]*class="[^"]*RosterList_headerTitle[^"]*"[^>]*>([\s\S]*?)<\/h3>|<a\b[^>]*href="\/jugador\/(\d+)"[^>]*>/gi;
  for (const match of rosterHtml.matchAll(item)) {
    if (match[1] != null) {
      const groupName = plainText(match[1]);
      if (ROSTER_GROUPS.some(g => g === groupName)) {
        current = { name: groupName, players: [] };
        groups.push(current);
      } else {
        current = null;
      }
      continue;
    }
    if (!current || !match[2]) continue;
    const playerId = Number(match[2]);
    if (!Number.isInteger(playerId) || playerId < 1 || seen.has(playerId)) continue;
    const at = (match.index ?? 0) + match[0].length;
    const closing = rosterHtml.indexOf("</a>", at);
    if (closing < 0 || closing - at > 7500) continue;
    const card = rosterHtml.slice(at, closing);
    const alt = card.match(/<img\b[^>]*\balt="([^"]+)"/i)?.[1];
    if (!alt) continue;
    const parsed = decodeEntities(alt).match(/^\s*(.+?)\s*#\s*(\d{1,3})\s*$/);
    if (!parsed) continue;
    const number = Number(parsed[2]);
    const name = parsed[1].trim();
    if (!name || name.length > 100 || !Number.isInteger(number) || number > 999) continue;
    current.players.push({ playerId, number, name });
    seen.add(playerId);
  }
  const found = groups.flatMap(g => g.players);
  if (found.length < 8 || found.length > 80) return [];
  return groups.filter(g => g.players.length > 0);
}

const fallbackStories: OfficialStory[] = ALGODONEROS_STORIES.map(s => ({
  title: s.title, url: s.url, label: "Archivo LMB 2026", imageUrl: null,
}));
const fallbackRoster: OfficialRosterGroup[] = ALGODONEROS_ROSTER.map(group => ({
  name: group.name,
  players: group.players.map(player => ({ ...player })),
}));

export async function getLmbClubNews(slug: string, fallback: OfficialStory[] = []): Promise<NewsResult> {
  if (!validClubSlug(slug)) return { stories: fallback, sourceStatus: "fallback" };
  const html = await readOfficialHtml(BASE + "/equipos/" + slug);
  const news = html ? readNewsFromOfficialHtml(html) : [];
  if (news.length < 3) return { stories: fallback, sourceStatus: "fallback" };
  return { stories: news, sourceStatus: "connected" };
}

export async function getLmbClubRoster(slug: string, fallback: OfficialRosterGroup[] = []): Promise<RosterResult> {
  if (!validClubSlug(slug)) return { roster: fallback, sourceStatus: "fallback" };
  const url = BASE + "/equipos/" + slug + "/roster";
  const html = await readOfficialHtml(url);
  let parsed = html ? readRosterFromOfficialHtml(html) : [];

  // Los rosters LMB pueden regresar una respuesta HTML obsoleta/incompleta
  // desde la caché de Next, aunque la página oficial sí incluya los jugadores.
  // Solo ante un roster inválido hacemos recuperación directa no-store.
  if (!parsed.length) {
    try {
      const retry = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "text/html" },
        signal: AbortSignal.timeout(12000),
      });
      if (retry.ok && (retry.headers.get("content-type") ?? "").includes("text/html")) {
        const fresh = await retry.text();
        parsed = readRosterFromOfficialHtml(stripFlight(fresh));
      }
    } catch {
      // Mantener respaldo correspondiente al club; nunca usar otro equipo.
    }
  }
  if (!parsed.length) return { roster: fallback, sourceStatus: "fallback" };
  // Conservamos acentos en los nombres ya verificados, pero nuevos jugadores
  // siempre provienen del roster actual LMB y jamás del archivo.
  const officialNames = new Map<number, string>(
    fallback.flatMap(group => group.players.map(p => [p.playerId, p.name] as const))
  );
  return {
    roster: parsed.map(group => ({
      name: group.name,
      players: group.players.map(player => ({
        ...player,
        name: officialNames.get(player.playerId) ?? player.name,
      })),
    })),
    sourceStatus: "connected",
  };
}

export async function getAlgodonerosNews(): Promise<NewsResult> {
  return getLmbClubNews("algodoneros", fallbackStories);
}

export async function getAlgodonerosRoster(): Promise<RosterResult> {
  return getLmbClubRoster("algodoneros", fallbackRoster);
}



export type LmbClubOverview = {
  stadium: string | null;
  capacity: number | null;
  website: string | null;
  tickets: string | null;
  sourceStatus: LmbSourceStatus;
};

// Solo metadatos observados en el encabezado del club de la página LMB;
// nunca rellenar con información del otro club.
export async function getLmbClubOverview(slug: string): Promise<LmbClubOverview> {
  const empty: LmbClubOverview = {
    stadium: null, capacity: null, website: null, tickets: null, sourceStatus: "fallback",
  };
  if (!validClubSlug(slug)) return empty;
  const html = await readOfficialHtml(BASE + "/equipos/" + slug);
  if (!html) return empty;
  const from = html.indexOf("Estadio:");
  if (from < 0) return empty;
  const chunk = html.slice(from, from + 3000);
  const visible = plainText(chunk);
  const stadium = visible.match(/Estadio:\s*(.{4,130}?)\s*(?:Capacidad:|Sitio Oficial|Boletos)/i)?.[1].trim() ?? null;
  const capacityMatch = visible.match(/Capacidad:\s*([\d.,]{3,9})/i)?.[1];
  const cap = capacityMatch ? Number(capacityMatch.replace(/[,\.]/g, "")) : NaN;
  const hrefs = [...chunk.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const findLink = (label: RegExp): string | null => {
    const match = hrefs.find(v => label.test(plainText(v[2])));
    if (!match) return null;
    try {
      const url = new URL(decodeEntities(match[1]), BASE);
      return url.protocol === "https:" ? url.href : null;
    } catch { return null; }
  };
  return {
    stadium,
    capacity: Number.isInteger(cap) && cap > 1000 && cap < 100000 ? cap : null,
    website: findLink(/sitio oficial/i),
    tickets: findLink(/boletos/i),
    sourceStatus: "connected",
  };
}
