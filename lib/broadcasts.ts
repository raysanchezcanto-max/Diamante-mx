import { getLmpScoreboard } from "@/lib/lmpScoreboard";
import { getLmbOfficialBroadcasts } from "./lmbLive";
import { findLmbTvGamePage } from "./lmbTvCatalog";
import { verifyLmbTvGamePage } from "./lmbReplayAvailability";
import { getVerifiedLmpGameVideo, lmpOfficialVideosSearchUrl } from "./lmpVideoLinks";
import { getMlbGameVideoCollection, mlbTvArchiveDayUrl } from "./mlbPostgame";
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
  verifiedGamePage?: boolean;
  gameVideoSearch?: boolean;
  /** Full replay link, date-specific archive lookup, or clips/search. */
  postgameKind?: "fullReplay" | "archiveLookup" | "gameVideos";
};

export type BroadcastGameContext = {
  startTime?: string;
  awayId?: number;
  homeId?: number;
  away?: string;
  home?: string;
  isFinal?: boolean;
};

const MLB_API = "https://statsapi.mlb.com/api/v1";
const LMP_OFFICIAL_SITE = "https://www.lmp.mx/";
// Enlace estable por ID de canal, publicado por la propia LMP y en la
// descripción de vídeos de la temporada 2026-27. NO es un vídeo individual.
const LMP_YOUTUBE_MEMBERSHIP = "https://www.youtube.com/channel/UCdW_4rN3OarOoawQ4Er-ZXw/join";
const LMB_TV = "https://www.lmb.tv/";

// Serie del Rey 2026: correspondencia contrastada con el calendario
// histórico oficial de cada gamePk (fecha/equipos/J1-J6) y las páginas
// individuales publicadas por LMB.TV. Archivo histórico, NO regla para
// inventar IDs de video de temporadas futuras.
const LMB_2026_VERIFIED_FULL_GAMES: Readonly<Record<number, string>> = {
  867486: "https://www.lmb.tv/watch/8990fc5b-6a79-4519-a38f-9a00e2988109", // 08-sep J1
  867487: "https://www.lmb.tv/watch/06a64ece-5dac-4b40-85b0-8338924b3db9", // 09-sep J2
  867488: "https://www.lmb.tv/watch/993a4858-0c97-4d5f-953b-24cd1b801199", // 11-sep J3
  867489: "https://www.lmb.tv/watch/7aba42eb-c6d0-482c-92e8-1bc7032c5698", // 12-sep J4
  867490: "https://www.lmb.tv/watch/d21cfa26-2270-4b67-beb9-85d920b5910f", // 13-sep J5
  867481: "https://www.lmb.tv/watch/1f867e78-4968-4764-9c88-1bb0d2170978", // 15-sep J6
};

function canonicalProviderUrl(name: string, league: LeagueCode): string | undefined {
  const n = name.toLowerCase();
  if (league === "LMP") {
    // El feed no identifica el vídeo del partido; la membresía oficial
    // se presenta por separado, nunca como enlace directo al juego.
    if (n.includes("youtube")) return undefined;
    if (n.includes("mlb.tv")) return "https://www.mlb.com/live-stream-games/lmp/2026-schedule";
    // TV channels can change their schedule: don't link to a random broadcaster.
    return undefined;
  }
  if (league === "LMB") {
    if (n.includes("lmb.tv") || n.includes("jonron")) return LMB_TV;
    return undefined;
  }
  if (n.includes("mlb network")) return "https://www.mlb.com/network";
  if (n.includes("mlb.tv")) return "https://www.mlb.com/live-stream-games";
  if (n.includes("apple tv")) return "https://tv.apple.com/";
  if (n.includes("espn")) return "https://www.espn.com/watch/";
  // National FOX/FOX One is not equivalent to every regional FOX affiliate.
  // In particular, do not route FOX19/FOX5 local feeds to FOX One.
  if (/\bfox one\b/.test(n) || /^(fox|fox deportes|fs1|fs2|fox sports 1|fox sports 2)$/.test(n.trim())) {
    return "https://www.fox.com/mlb";
  }
  if (n.includes("vix")) return "https://vix.com/";
  if (n.includes("netflix")) return "https://www.netflix.com/";
  // Peacock carries national NBC MLB coverage, but NBCSP, NBCSCA,
  // NBCS BA and other regional NBC channels are different providers.
  if (n.includes("peacock") || /^(nbc|nbcsn|nbc sports network)$/.test(n.trim())) {
    return "https://www.peacocktv.com/sports/mlb";
  }
  if (n.includes("roku")) return "https://therokuchannel.roku.com/";
  if (n.includes("tbs") || n.includes("tnt sports")) return "https://www.hbomax.com/";
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

// MLB StatsAPI can return the SAME gamePk on its originally scheduled date
// AND on a later rescheduled date. Select by the official game start instant,
// not dates[0].games[0], or we can show the wrong broadcast for postponements.
async function getMlbBroadcasts(gameId: number, context: BroadcastGameContext): Promise<Broadcast[]> {
  const calendar: Broadcast = {
    name: "Consultar disponibilidad · MLB.TV",
    type: "Streaming",
    url: "https://www.mlb.com/live-stream-games",
    fallback: true,
    note: "Calendario oficial MLB.TV. No es un video individual: hay exclusividades, restricciones regionales y requisitos de suscripción.",
  };

  if (!Number.isSafeInteger(gameId) || gameId <= 0) return [calendar];

  try {
    const response = await fetch(
      `${MLB_API}/schedule?gamePk=${gameId}&sportId=1&hydrate=broadcasts`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) }
    );
    if (!response.ok) return [calendar];
    const json = await response.json();
    const games: Array<{
      gamePk?: number;
      gameDate?: string;
      status?: { detailedState?: string; abstractGameState?: string };
      broadcasts?: unknown[];
    }> = Array.isArray(json?.dates)
      ? json.dates.flatMap((date: { games?: unknown }) =>
          Array.isArray(date.games) ? date.games : []
        )
      : [];

    const exactGamePk = games.filter(item => Number(item?.gamePk) === gameId);
    if (!exactGamePk.length) return [calendar];

    const requestedTime = Date.parse(context.startTime ?? "");
    const exactDates = Number.isFinite(requestedTime)
      ? exactGamePk.filter(game =>
          typeof game.gameDate === "string" &&
          Number.isFinite(Date.parse(game.gameDate)) &&
          Math.abs(Date.parse(game.gameDate) - requestedTime) <= 60_000
        )
      : [];

    // No guess across different date entries for a reprogrammed game.
    const selected = exactDates.length === 1
      ? exactDates[0]
      : !Number.isFinite(requestedTime) && exactGamePk.length === 1
        ? exactGamePk[0]
        : null;
    if (!selected) return [calendar];

    // A postponed or canceled date can retain obsolete TV listings.
    // Do not send fans to a channel for a game that is not taking place.
    if (/postponed|cancelled|canceled|suspended/i.test(selected.status?.detailedState ?? "")) {
      return [calendar];
    }

    const raw = Array.isArray(selected.broadcasts) ? selected.broadcasts : [];

    // MLB.TV uses a date-specific Media Center to browse game archives.
    // MEDIA_ARCHIVE means a broadcast is catalogued as archived;
    // it does NOT prove that this visitor can watch it in their region.
    if (context.isFinal) {
      const archived = raw.some(item => {
        if (!item || typeof item !== "object") return false;
        const b = item as Record<string, unknown>;
        const state = b.mediaState as Record<string, unknown> | undefined;
        return String(b.type ?? "").toUpperCase() === "TV" &&
          b.availableForStreaming === true &&
          state?.mediaStateCode === "MEDIA_ARCHIVE";
      });
      const archiveUrl = archived ? mlbTvArchiveDayUrl(selected.gameDate) : null;
      const clipsUrl = await getMlbGameVideoCollection(gameId);
      const archiveLinks: Broadcast[] = archiveUrl ? [{
        name: "Archivo por fecha · MLB.TV",
        type: "Streaming",
        url: archiveUrl,
        postgameKind: "archiveLookup",
        note: "El calendario oficial identifica una emisión archivada. Abre el día exacto en MLB.TV para localizar el partido, no un reproductor directo. Requiere suscripción y puede tener restricciones geográficas.",
      }] : [];
      const videoLinks: Broadcast[] = clipsUrl ? [{
        name: "Resumen y jugadas · MLB Film Room",
        type: "Streaming",
        url: clipsUrl,
        postgameKind: "gameVideos",
        note: "Colección oficial de videos del juego identificada por gamePk. Puede incluir resúmenes y jugadas; no es una repetición íntegra.",
      }] : [];
      return [...archiveLinks, ...videoLinks];
    }
    const byName = new Map<string, {
      name: string;
      isNational: boolean;
      availableForStreaming: boolean;
      homeAway?: string;
      language?: string;
    }>();

    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const obj = item as Record<string, unknown>;
      // StatsAPI's "AM" / "FM" radio signals are NOT TV, even if
      // their call sign contains a known network's name (e.g., ESPN).
      if (String(obj.type ?? "").toUpperCase() !== "TV") continue;

      const name = typeof obj.name === "string" ? obj.name.trim() : "";
      if (!name) continue;

      const key = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const current = byName.get(key);
      const candidate = {
        name,
        isNational: obj.isNational === true,
        availableForStreaming: obj.availableForStreaming === true,
        homeAway: typeof obj.homeAway === "string" ? obj.homeAway : undefined,
        language: typeof obj.language === "string" ? obj.language : undefined,
      };
      // Different home/away feeds frequently report the same provider.
      // Prefer the feed explicitly streamable in the source metadata.
      if (!current || (!current.availableForStreaming && candidate.availableForStreaming)) {
        byName.set(key, candidate);
      }
    }

    const signals: Broadcast[] = [...byName.values()].map(signal => {
      const url = canonicalProviderUrl(signal.name, "MLB");
      const coverage = signal.isNational ? "nacional" : "regional";
      return {
        name: signal.name,
        type: "TV",
        url,
        note: url
          ? `Señal ${coverage} anunciada para este partido. Abre la plataforma oficial del proveedor, no su video individual. Verificar ubicación, derechos y suscripción.`
          : `Señal ${coverage} anunciada para este partido. No se ha verificado un portal de video de ese proveedor; consulta el calendario MLB.TV como opción informativa.`,
      };
    });

    // When every TV channel is unknown, give a truthful way to check
    // MLB.TV availability instead of leaving only disabled pills.
    return signals.length > 0
      ? signals.some(signal => !!signal.url) ? signals : [...signals, calendar]
      : [calendar];
  } catch {
    return [calendar];
  }
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

async function lmpGameChannels(gameId: number, context: BroadcastGameContext): Promise<Broadcast[]> {
  const date = context.startTime ? mexicanDate(context.startTime) : undefined;
  if (!date || !Number.isSafeInteger(gameId) || gameId <= 0) return [];

  // Coincidir por el gamePk exacto (boxScore) y, cuando hay IDs,
  // comprobar también ambos equipos. Comparar solo nombres puede
  // confundir los canales de una doble cartelera del mismo día.
  const games = await getLmpScoreboard(date);
  const matching = games.find(game => {
    if (Number(game.boxScore) !== gameId) return false;

    const awayId = Number(game.awayTeamId ?? game.awayTeamID);
    const homeId = Number(game.homeTeamId ?? game.homeTeamID);
    if (context.awayId && Number.isFinite(awayId) && awayId > 0 &&
        awayId !== context.awayId) return false;
    if (context.homeId && Number.isFinite(homeId) && homeId > 0 &&
        homeId !== context.homeId) return false;

    return true;
  });
  if (!matching) return [];

  const raw: unknown[] = [];
  if (Array.isArray(matching.tvChannels)) raw.push(...matching.tvChannels);
  if (Array.isArray(matching.channels)) raw.push(...matching.channels);

  const result = raw.flatMap((entry): Broadcast[] => {
    const name = (typeof entry === "string"
      ? entry
      : entry && typeof entry === "object"
        ? String((entry as Record<string, unknown>).title ??
          (entry as Record<string, unknown>).name ??
          (entry as Record<string, unknown>).channelName ?? "")
        : "").trim();
    if (!name) return [];

    // Solo permitir URL si conocemos la plataforma: el feed identifica
    // la señal, pero no certifica que cualquier enlace sea el video.
    const url = canonicalProviderUrl(name, "LMP");
    // Numeración publicada por LMP para los canales MEGA. Al no existir un
    // reproductor público verificable, mostrar la señal/canal en lugar
    // de inventar un botón que no lleva al juego.
    const megaChannelNumber: Record<string, number> = {
      "tvc deportes": 315,
      "tvc deportes 2": 316,
      "mega sports": 317,
      "megasports": 317,
      "mega sports 2": 318,
      "megasports 2": 318,
      "mega sports 3": 319,
      "megasports 3": 319,
    };
    const channel = megaChannelNumber[normalize(name)];
    return [{
      name: channel ? `${name} · MEGA ${channel}` : name,
      type: url ? "Streaming" : "TV",
      url,
      note: url
        ? "Abre el calendario/portal del proveedor, no el video individual."
        : channel
          ? `Señal de TV de paga, canal MEGA ${channel} según la guía oficial LMP. Puede variar por localidad o paquete; no hay video web verificado.`
          : "Canal anunciado para este juego; sin enlace público individual verificado.",
    }];
  });
  return unique(result);
}

async function getLmpBroadcasts(gameId: number, context: BroadcastGameContext): Promise<Broadcast[]> {
  // Los botones LMP conocidos abren información oficial, no streams inventados.
  const start = context.startTime ? new Date(context.startTime) : new Date();
  const season = Number.isFinite(start.getTime()) ? start.getFullYear() : 2026;
  const year = start.getMonth() <= 2 ? season - 1 : season;
  const gameSearchUrl = lmpOfficialVideosSearchUrl(gameId);
  const gameVideos: Broadcast[] = gameSearchUrl ? [{
    name: "Videos de este juego · MLB.com",
    type: "Streaming",
    url: gameSearchUrl,
    gameVideoSearch: true,
    postgameKind: "gameVideos",
    note: "Búsqueda oficial filtrada por el ID exacto del partido. Puede contener clips o no tener resultados; no es una repetición completa ni un reproductor garantizado.",
  }] : [];

  // Los juegos FINAL pueden consultar clips, pero no debemos anunciar
  // una repetición íntegra ni consultar canales que ya no transmiten.
  if (context.isFinal) return gameVideos;

  // El botón directo se muestra solo si MLB.com sigue respondiendo HTTP 200
  // y la página contiene la etiqueta gamepk exacta de este encuentro.
  const gameVideoPromise = getVerifiedLmpGameVideo(gameId, context.startTime
    ? mexicanDate(context.startTime)
    : undefined);
  const known: Broadcast[] = [
    { name: "YouTube LMP · Membresía oficial", type: "Streaming",
      url: LMP_YOUTUBE_MEMBERSHIP,
      note: "Acceso al canal de membresía identificado por la LMP para 2026-27. Requiere cuenta y membresía; no es enlace directo a un partido ni garantiza reproducción." },
    { name: "LMP · Consultar canales oficiales", type: "Streaming", url: LMP_OFFICIAL_SITE,
      note: "Abre la web oficial LMP para consultar opciones; no reproduce directamente un partido." },
    { name: "Calendario LMP en MLB.TV", type: "Streaming",
      url: `https://www.mlb.com/live-stream-games/lmp/${year}-schedule`,
      note: "Calendario oficial de LMP en MLB.TV; requiere suscripción y no abre directamente el reproductor." },
  ];
  const [selected, gameVideo] = await Promise.all([
    lmpGameChannels(gameId, context),
    gameVideoPromise,
  ]);
  const verified: Broadcast[] = gameVideo ? [{
    name: "Video oficial del partido · MLB.com",
    type: "Streaming",
    url: gameVideo,
    verifiedGamePage: true,
    note: "Página de video de MLB.com confirmada para este gamePk. La reproducción puede exigir suscripción o estar restringida por región; no se garantiza video EN VIVO.",
  }] : [];
  const extra = selected.filter(item =>
    !item.name.toLowerCase().includes("youtube") &&
    !item.name.toLowerCase().includes("mlb.tv")
  );
  return [...verified, ...gameVideos, ...known, ...extra];
}

async function getLmbBroadcasts(gameId: number, context: BroadcastGameContext): Promise<Broadcast[]> {
  const archiveUrl = LMB_2026_VERIFIED_FULL_GAMES[gameId];
  const archive: Broadcast | null = archiveUrl ? {
    name: "Partido completo · LMB.TV",
    type: "Streaming",
    url: archiveUrl,
    postgameKind: "fullReplay",
    note: "Página individual verificada del juego de la Serie del Rey 2026 en LMB.TV. La reproducción puede requerir suscripción y depende de derechos regionales.",
  } : null;
  const main: Broadcast = {
    name: "LMB.TV · Plataforma oficial", type: "Streaming", url: LMB_TV,
    note: "Portal oficial de partidos LMB. Selecciona el juego en el catálogo; puede requerir suscripción.",
  };

  // Para juegos sin enlace histórico, buscar la página del encuentro en
  // el catálogo público LMB.TV. Se requiere coincidencia ÚNICA de equipos,
  // fecha y hora; si el feed cambió, los dobles juegos son ambiguos o la
  // plataforma no publicó el partido, mantener el portal oficial.
  const [channels, catalogUrl] = await Promise.all([
    getLmbOfficialBroadcasts(gameId),
    archiveUrl ? Promise.resolve(null) : findLmbTvGamePage(context),
  ]);

  const direct = channels.flatMap((channel): Broadcast[] => {
    const url = safeLmbMediaUrl(channel.url);
    if (!url || !/^https:\/\/(?:www\.)?lmb\.tv\/watch\/[0-9a-f-]{36}(?:[?#].*)?$/i.test(url)) return [];
    return [{
      name: `Partido en LMB.TV · ${channel.name}`,
      type: "Streaming",
      url,
      postgameKind: "fullReplay",
      note: "Enlace individual publicado por LMB para este encuentro. La reproducción depende de disponibilidad y suscripción.",
    }];
  });

  const catalog: Broadcast | null = catalogUrl ? {
    name: "Partido identificado · LMB.TV",
    type: "Streaming",
    url: catalogUrl,
    postgameKind: "fullReplay",
    note: "Página del encuentro encontrada en el catálogo público de LMB.TV por equipos, fecha y hora. La disponibilidad del video depende de la plataforma y suscripción.",
  } : null;

  const other = channels.filter(channel => !/lmb.tv|jonr[oó]n/i.test(channel.name))
    .map((channel): Broadcast => ({
      name: channel.name,
      type: "TV",
      url: safeLmbMediaUrl(channel.url) ?? canonicalProviderUrl(channel.name, "LMB"),
      note: "Canal informado por LMB; puede no haber enlace directo para este encuentro.",
    }));

  const candidatePages = archive ? [archive] : direct.length ? direct : catalog ? [catalog] : [];
  if (context.isFinal) {
    // A page can disappear after being published. Suppress stale replay
    // buttons rather than linking to a deleted video or an error page.
    const checks = await Promise.all(candidatePages.map(async item =>
      item.url && await verifyLmbTvGamePage(item.url) ? item : null
    ));
    return unique([...checks.filter((item): item is Broadcast => item !== null), ...other]);
  }
  return unique([...(candidatePages.length ? candidatePages : [main]), ...other]);
}

export async function getGameBroadcasts(
  league: LeagueCode, gameId: number, context: BroadcastGameContext = {}
): Promise<Broadcast[]> {
  if (league === "MLB") return getMlbBroadcasts(gameId, context);
  if (league === "LMP") return getLmpBroadcasts(gameId, context);
  if (league === "LMB") return getLmbBroadcasts(gameId, context);
  return [];
}
