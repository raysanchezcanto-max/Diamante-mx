import { getLmbOfficialBroadcasts } from "./lmbLive";
import type { LeagueCode } from "./teamLogos";

/**
 * Links are authorized provider/league destinations, NOT unverified direct
 * player URLs. A named TV network without a reliable link stays non-clickable.
 */
export type Broadcast = {
  name: string;
  type: "TV" | "Streaming" | "Radio";
  url?: string;
  fallback?: boolean;
  note?: string;
};

export type BroadcastGameContext = {
  startTime?: string;
  awayId?: number;
  homeId?: number;
  away?: string;
  home?: string;
};

const MLB_API = "https://statsapi.mlb.com/api/v1";
const LMP_OFFICIAL_SITE = "https://www.lmp.mx/";
const LMB_TV = "https://www.lmb.tv/";

function canonicalProviderUrl(name: string, league: LeagueCode): string | undefined {
  const n = name.toLowerCase();
  if (league === "LMP") {
    // El identificador exacto del canal oficial YouTube no está verificado.
    if (n.includes("youtube")) return undefined;
    if (n.includes("mlb.tv")) return "https://www.mlb.com/live-stream-games/lmp/2026-schedule";
    // TV channels can change their schedule: don't link to a random broadcaster.
    return undefined;
  }
  if (league === "LMB") {
    if (n.includes("lmb.tv") || n.includes("jonron")) return LMB_TV;
    return undefined;
  }
  if (n.includes("mlb.tv")) return "https://www.mlb.com/live-stream-games";
  if (n.includes("apple tv")) return "https://tv.apple.com/";
  if (n.includes("espn")) return "https://www.espn.com/watch/";
  if (n.includes("fox")) return "https://www.foxsports.com/live";
  if (n.includes("vix")) return "https://vix.com/";
  if (n.includes("netflix")) return "https://www.netflix.com/";
  if (n.includes("peacock")) return "https://www.peacocktv.com/";
  if (n.includes("roku")) return "https://therokuchannel.roku.com/";
  if (n.includes("tbs")) return "https://www.tbs.com/watchtbs";
  return undefined;
}

// If an LMB feed includes a real player URL, accept only known media domains.
function safeLmbMediaUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:") return undefined;
    const host = url.hostname.toLowerCase();
    if ([
      "lmb.tv", "clarosports.com", "youtube.com", "youtu.be",
      "tvcdeportes.com", "aztecadeportes.com", "disneyplus.com",
    ].some(domain => host === domain || host.endsWith("." + domain))) {
      return url.href;
    }
  } catch { /* Unsafe or malformed link: show only the broadcaster name. */ }
  return undefined;
}

function unique(items: Broadcast[]): Broadcast[] {
  return Array.from(new Map(items.map(item => [item.name.trim().toLowerCase(), item])).values());
}

async function getMlbBroadcasts(gameId: number): Promise<Broadcast[]> {
  try {
    const response = await fetch(
      `${MLB_API}/schedule?gamePk=${gameId}&sportId=1&hydrate=broadcasts`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) return [];
    const json = await response.json();
    const networks: unknown[] = json?.dates?.[0]?.games?.[0]?.broadcasts ?? [];
    if (!Array.isArray(networks)) return [];
    const listed = networks.flatMap((item): Broadcast[] => {
      if (!item || typeof item !== "object") return [];
      const obj = item as Record<string, unknown>;
      const name = typeof obj.name === "string" ? obj.name.trim() : "";
      if (!name) return [];
      const t = String(obj.type ?? "").toLowerCase();
      if (t.includes("radio") || t === "am" || t === "fm" || /\d+\s*(am|fm)\b/i.test(name)) return [];
      const url = canonicalProviderUrl(name, "MLB");
      return [{
        name, type: "TV", url,
        note: url ? "Abre la plataforma del proveedor; la disponibilidad del juego depende de sus derechos y tu región." : "Canal identificado; sin enlace individual confirmado.",
      }];
    });
    if (listed.length) return unique(listed);
  } catch { /* Keep the official general calendar fallback. */ }
  return [{
    name: "Calendario MLB.TV",
    type: "Streaming",
    url: "https://www.mlb.com/live-stream-games",
    fallback: true,
    note: "Consulta la disponibilidad del partido en el calendario oficial; no es un enlace directo al video.",
  }];
}

function normalize(value: unknown): string {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function isNameMatch(a: unknown, b: unknown): boolean {
  const left = normalize(a), right = normalize(b);
  return !!left && !!right && (left === right || (left.length > 4 && right.length > 4 && (left.includes(right) || right.includes(left))));
}

function mexicanDate(iso: string): string | undefined {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return undefined;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const value = (type: string) => parts.find(p => p.type === type)?.value;
  return `${value("year")}/${value("month")}/${value("day")}`;
}

async function lmpGameChannels(context: BroadcastGameContext): Promise<Broadcast[]> {
  const date = context.startTime ? mexicanDate(context.startTime) : undefined;
  if (!date || (!context.awayId && !context.away) || (!context.homeId && !context.home)) return [];
  try {
    const response = await fetch(`https://api.lmp.mx/3.0.0/scoreboard/${date}`, {
      next: { revalidate: 300 }, headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    const games: Record<string, unknown>[] = [];
    const visited = new WeakSet<object>();
    const walk = (item: unknown): void => {
      if (!item || typeof item !== "object" || visited.has(item)) return;
      visited.add(item);
      if (Array.isArray(item)) { item.forEach(walk); return; }
      const obj = item as Record<string, unknown>;
      if (obj.awayTeamID != null || obj.awayTeamId != null || obj.awayTeam != null) games.push(obj);
      Object.values(obj).forEach(walk);
    };
    walk(json);
    const matching = games.find(g => {
      const awayId = Number(g.awayTeamID ?? g.awayTeamId);
      const homeId = Number(g.homeTeamID ?? g.homeTeamId);
      const byId = !!context.awayId && !!context.homeId &&
        awayId === context.awayId && homeId === context.homeId;
      const byName = [g.awayTeam, g.awayTeamShort].some(n => isNameMatch(n, context.away)) &&
        [g.homeTeam, g.homeTeamShort].some(n => isNameMatch(n, context.home));
      return byId || byName;
    });
    if (!matching) return [];
    const raw: unknown[] = [];
    if (Array.isArray(matching.tvChannels)) raw.push(...matching.tvChannels);
    if (Array.isArray(matching.channels)) raw.push(...matching.channels);
    const result = raw.flatMap((entry): Broadcast[] => {
      if (!entry || typeof entry !== "object") return [];
      const item = entry as Record<string, unknown>;
      const name = String(item.title ?? item.name ?? "").trim();
      if (!name) return [];
      const url = canonicalProviderUrl(name, "LMP");
      return [{ name, type: url ? "Streaming" : "TV", url,
        note: url ? "Abre el portal oficial del proveedor, no un video individual." : "Señal informada para este partido; sin enlace público verificado.",
      }];
    });
    return unique(result);
  } catch { return []; }
}

async function getLmpBroadcasts(context: BroadcastGameContext): Promise<Broadcast[]> {
  // Los botones LMP conocidos abren información oficial, no streams inventados.
  const start = context.startTime ? new Date(context.startTime) : new Date();
  const season = Number.isFinite(start.getTime()) ? start.getFullYear() : 2026;
  const year = start.getMonth() <= 2 ? season - 1 : season;
  const known: Broadcast[] = [
    { name: "YouTube LMP · Membresía", type: "Streaming",
      note: "La liga anuncia transmisiones en YouTube, pero no tenemos un enlace del canal verificado; opción deshabilitada." },
    { name: "LMP · Consultar canales oficiales", type: "Streaming", url: LMP_OFFICIAL_SITE,
      note: "Abre la web oficial LMP para consultar opciones; no reproduce directamente un partido." },
    { name: "Calendario LMP en MLB.TV", type: "Streaming",
      url: `https://www.mlb.com/live-stream-games/lmp/${year}-schedule`,
      note: "Calendario oficial de LMP en MLB.TV; requiere suscripción y no abre directamente el reproductor." },
  ];
  const selected = await lmpGameChannels(context);
  const extra = selected.filter(item => !item.name.toLowerCase().includes("youtube") && !item.name.toLowerCase().includes("mlb.tv"));
  return [...known, ...extra];
}

async function getLmbBroadcasts(gameId: number): Promise<Broadcast[]> {
  const main: Broadcast = {
    name: "LMB.TV · Plataforma oficial", type: "Streaming", url: LMB_TV,
    note: "Portal oficial de partidos LMB. Selecciona el juego en el catálogo; puede requerir suscripción.",
  };
  try {
    const channels = await getLmbOfficialBroadcasts(gameId);
    const other = channels.filter(channel => !/lmb.tv|jonr[oó]n/i.test(channel.name))
      .map((channel): Broadcast => ({
        name: channel.name,
        type: "TV",
        url: safeLmbMediaUrl(channel.url) ?? canonicalProviderUrl(channel.name, "LMB"),
        note: "Canal informado por LMB; puede no haber enlace directo para este encuentro.",
      }));
    return unique([main, ...other]);
  } catch { return [main]; }
}

export async function getGameBroadcasts(
  league: LeagueCode, gameId: number, context: BroadcastGameContext = {}
): Promise<Broadcast[]> {
  if (league === "MLB") return getMlbBroadcasts(gameId);
  if (league === "LMP") return getLmpBroadcasts(context);
  if (league === "LMB") return getLmbBroadcasts(gameId);
  return [];
}
