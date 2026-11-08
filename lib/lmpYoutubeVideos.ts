import { cache } from "react";

const OFFICIAL_CHANNEL_ID = "UCdW_4rN3OarOoawQ4Er-ZXw";
const CHANNEL = `https://www.youtube.com/channel/${OFFICIAL_CHANNEL_ID}`;
const MONTHS: Record<string, number> = {
  enero: 1, ene: 1, january: 1, jan: 1,
  febrero: 2, feb: 2, february: 2,
  marzo: 3, mar: 3, march: 3,
  abril: 4, abr: 4, april: 4, apr: 4,
  mayo: 5, may: 5,
  junio: 6, jun: 6, june: 6,
  julio: 7, jul: 7, july: 7,
  agosto: 8, ago: 8, august: 8, aug: 8,
  septiembre: 9, setiembre: 9, sep: 9, sept: 9, september: 9,
  octubre: 10, oct: 10, october: 10,
  noviembre: 11, nov: 11, november: 11,
  diciembre: 12, dic: 12, december: 12, dec: 12,
};
const TEAM_KEYS = [
  "aguilas", "algodoneros", "caneros", "charros", "jaguares",
  "mayos", "naranjeros", "tomateros", "venados", "yaquis",
];

export type LmpYoutubeGameContext = {
  startTime?: string;
  away?: string;
  home?: string;
  gameNumber?: number;
  doubleHeader?: string;
};

export type LmpYoutubeVideo = {
  url: string;
  title: string;
  durationSeconds: number;
  membersOnly?: boolean;
  /** Source is the verified official channel, but YouTube blocked metadata via bot challenge. */
  accessUnverified?: boolean;
};

type ChannelVideo = {
  id: string;
  title: string;
  durationSeconds: number;
  officialUploader?: boolean;
};

const KNOWN_HIGHLIGHT_IDS: Readonly<Record<number, { id: string; day: string; number: number; away: string; home: string; seconds: number; title: string }>> = {
  // Individually confirmed on the LMP's official YouTube /videos page.
  // These remain findable when newer uploads push them off the first page.
  850456: { id: "54B29JD_lGo", day: "2026-11-07", number: 1, away: "naranjeros", home: "algodoneros", seconds: 580, title: "HIGHLIGHTS | Naranjeros de Hermosillo vs Algodoneros de Guasave | November 07, 2026 | Game 1" },
  850479: { id: "3HX6hEqbdto", day: "2026-11-07", number: 2, away: "naranjeros", home: "algodoneros", seconds: 423, title: "RESUMEN | Naranjeros de Hermosillo vs Algodoneros de Guasave | 07 de Noviembre 2026 | Juego 2" },
  850466: { id: "QbObuwwo8Z4", day: "2026-11-07", number: 1, away: "venados", home: "mayos", seconds: 449, title: "HIGHLIGHTS | Venados de Mazatlán vs. Mayos de Navojoa | November 07, 2026 | Game 1" },
  850474: { id: "7BKLu_JEVRs", day: "2026-11-07", number: 2, away: "venados", home: "mayos", seconds: 567, title: "HIGHLIGHTS | Venados de Mazatlán vs. Mayos de Navojoa | November 7, 2026 | Game 2" },
};

const KNOWN_ARCHIVE_IDS: Readonly<Record<number, { id: string; day: string; number: number; away: string; home: string }>> = {
  // Each URL was validated against YouTube's own player metadata:
  // exact team pairing, 2026-11-07, 2h+ length, completed stream,
  // official channel and explicit members-only gating.
  850456: { id: "oPAPcWxbVNM", day: "2026-11-07", number: 1, away: "naranjeros", home: "algodoneros" },
  850479: { id: "UnPc8ktTsq8", day: "2026-11-07", number: 2, away: "naranjeros", home: "algodoneros" },
};

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function teamKey(value: string): string | null {
  const name = normalized(value);
  return TEAM_KEYS.find(team => new RegExp(`\\b${team}\\b`).test(name)) ?? null;
}

function mexicoDay(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  const read = (key: string) => parts.find(p => p.type === key)?.value;
  const y = read("year"), m = read("month"), d = read("day");
  return y && m && d ? `${y}-${m}-${d}` : null;
}

function titleDay(title: string): string | null {
  const text = normalized(title);
  // An explicit year-first date cannot be confused with US month/day dates.
  // Abbreviated month names are common in new YouTube listings.
  const iso = title.match(/\b(20\d{2})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  const dayFirst = text.match(/\b(\d{1,2})\s+(?:de\s+)?([a-z]+)\s+(?:de\s+)?(20\d{2})\b/);
  const monthFirst = text.match(/\b([a-z]+)\s+(\d{1,2})\s+(20\d{2})\b/);
  const candidates = [
    { year: iso?.[1], month: Number(iso?.[2]), day: Number(iso?.[3]) },
    { year: dayFirst?.[3], month: MONTHS[dayFirst?.[2] ?? ""], day: Number(dayFirst?.[1]) },
    { year: monthFirst?.[3], month: MONTHS[monthFirst?.[1] ?? ""], day: Number(monthFirst?.[2]) },
  ];
  for (const { year, month, day } of candidates) {
    if (!year || !Number.isInteger(month) || month < 1 || month > 12 ||
        !Number.isInteger(day) || day < 1) continue;
    // Reject February 30, etc. Never match a fabricated date to a game.
    const lastDay = new Date(Date.UTC(Number(year), month, 0)).getUTCDate();
    if (day > lastDay) continue;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  // Ambiguous 08/11/2026 could be Aug 11 or Nov 8: fail closed.
  return null;
}

function gameNumberInTitle(title: string): number | null {
  const match = normalized(title).match(/\b(?:juego|game|j|g)\s*(\d+)\b/);
  return match ? Number(match[1]) : null;
}

function matchesGame(title: string, context: LmpYoutubeGameContext): boolean {
  const date = mexicoDay(context.startTime);
  const away = context.away ? teamKey(context.away) : null;
  const home = context.home ? teamKey(context.home) : null;
  if (!date || !away || !home || away === home || titleDay(title) !== date) return false;
  const text = normalized(title);
  if (!new RegExp(`\\b${away}\\b`).test(text) ||
      !new RegExp(`\\b${home}\\b`).test(text)) return false;

  // A doubleheader must explicitly match J1/J2: never transfer replay
  // metadata from the first game to the second.
  const isDouble = context.doubleHeader === "Y" || context.doubleHeader === "S";
  if (isDouble) {
    if (context.gameNumber !== 1 && context.gameNumber !== 2) return false;
    return gameNumberInTitle(title) === context.gameNumber;
  }
  return true;
}

function durationSeconds(value: string): number {
  const parts = value.split(":").map(Number);
  if (parts.length < 2 || parts.length > 3 || parts.some(p => !Number.isInteger(p) || p < 0)) return 0;
  return parts.reduce((acc, current) => acc * 60 + current, 0);
}

function initialJson(html: string, marker: string): unknown {
  const index = html.indexOf(marker);
  if (index < 0) return null;
  const start = html.indexOf("{", index + marker.length);
  const end = html.indexOf(";</script>", start);
  if (start < 0 || end < 0 || end - start > 2_000_000) return null;
  try { return JSON.parse(html.slice(start, end)); } catch { return null; }
}

function collectChannelVideos(data: unknown): ChannelVideo[] {
  const found: ChannelVideo[] = [];
  const seen = new Set<string>();
  let visited = 0;

  const visit = (value: unknown, depth: number): void => {
    if (!value || typeof value !== "object" || depth > 50 || ++visited > 45000) return;
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry, depth + 1);
      return;
    }
    const obj = value as Record<string, unknown>;
    const lockup = obj.lockupViewModel as Record<string, unknown> | undefined;
    if (lockup && typeof lockup.contentId === "string" &&
        /^[A-Za-z0-9_-]{11}$/.test(lockup.contentId) &&
        !seen.has(lockup.contentId)) {
      const meta = (lockup.metadata as Record<string, unknown> | undefined)?.lockupMetadataViewModel as Record<string, unknown> | undefined;
      const title = (meta?.title as Record<string, unknown> | undefined)?.content;
      const overlays = ((
        (lockup.contentImage as Record<string, unknown> | undefined)?.thumbnailViewModel as Record<string, unknown> | undefined
      )?.overlays ?? []) as Array<Record<string, unknown>>;
      const duration = overlays.flatMap(item => {
        const bottom = item.thumbnailBottomOverlayViewModel as { badges?: Array<{ thumbnailBadgeViewModel?: { text?: string } }> } | undefined;
        return (bottom?.badges ?? []).map(badge => badge.thumbnailBadgeViewModel?.text ?? "");
      }).find(Boolean) ?? "";

      if (typeof title === "string") {
        seen.add(lockup.contentId);
        found.push({ id: lockup.contentId, title, durationSeconds: durationSeconds(duration), officialUploader: true });
      }
    }

    // Channel search uses classic videoRenderer rather than the newer
    // lockup cards. Accept it only if its uploader is the same league
    // channel; the search is fuzzy and may include unrelated material.
    const video = obj.videoRenderer as Record<string, unknown> | undefined;
    if (video && typeof video.videoId === "string" &&
        /^[A-Za-z0-9_-]{11}$/.test(video.videoId) &&
        !seen.has(video.videoId)) {
      const owner = video.ownerText as { runs?: Array<{ navigationEndpoint?: { browseEndpoint?: { browseId?: string } } }> } | undefined;
      const byline = video.longBylineText as { runs?: Array<{ navigationEndpoint?: { browseEndpoint?: { browseId?: string } } }> } | undefined;
      const ownerId = owner?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId ??
        byline?.runs?.[0]?.navigationEndpoint?.browseEndpoint?.browseId;
      if (ownerId === OFFICIAL_CHANNEL_ID) {
        const title = (video.title as { runs?: Array<{ text?: string }> } | undefined)?.runs?.map(r => r.text ?? "").join("");
        const duration = (video.lengthText as { simpleText?: string } | undefined)?.simpleText ?? "";
        if (title) {
          seen.add(video.videoId);
          found.push({ id: video.videoId, title, durationSeconds: durationSeconds(duration), officialUploader: true });
        }
      }
    }
    for (const nested of Object.values(obj)) visit(nested, depth + 1);
  };
  visit(data, 0);
  return found;
}

const channelVideos = cache(async (tab: "streams" | "videos", search?: string): Promise<ChannelVideo[]> => {
  const url = search
    ? `https://www.youtube.com/@lmpbanamex/search?query=${encodeURIComponent(search)}`
    : `${CHANNEL}/${tab}`;
  try {
    const response = await fetch(url, {
      next: { revalidate: search ? 3600 : 600 },
      signal: AbortSignal.timeout(7500),
      headers: { Accept: "text/html" },
    });
    if (!response.ok ||
        !response.url.startsWith("https://www.youtube.com/") ||
        !response.headers.get("content-type")?.includes("text/html")) return [];

    const html = await response.text();
    if (html.length > 2_500_000) return [];
    return collectChannelVideos(initialJson(html, "var ytInitialData = "));
  } catch {
    return [];
  }
});

function chooseUnique(
  entries: ChannelVideo[],
  context: LmpYoutubeGameContext,
  kind: "replay" | "highlight",
): ChannelVideo | null {
  const matches = entries.filter(entry => {
    if (!matchesGame(entry.title, context)) return false;
    if (kind === "replay") {
      return entry.durationSeconds >= 60 * 60 &&
        !/\b(resumen|highlights|summary|clip|entrevista)\b/i.test(normalized(entry.title));
    }
    return entry.durationSeconds >= 60 && entry.durationSeconds <= 45 * 60 &&
      /\b(resumen|highlights|summary)\b/i.test(normalized(entry.title));
  });
  return matches.length === 1 ? matches[0] : null;
}

function searchTerms(context: LmpYoutubeGameContext): string | null {
  const date = mexicoDay(context.startTime);
  const away = context.away ? teamKey(context.away) : null;
  const home = context.home ? teamKey(context.home) : null;
  if (!date || !away || !home) return null;
  const [y, m, d] = date.split("-");
  const months = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  // YouTube's channel search is not accent-insensitive: an older archive
  // appeared for "Cañeros Yaquis ..." but not for "caneros yaquis ...".
  const display: Record<string, string> = {
    aguilas: "Águilas", algodoneros: "Algodoneros", caneros: "Cañeros",
    charros: "Charros", jaguares: "Jaguares", mayos: "Mayos",
    naranjeros: "Naranjeros", tomateros: "Tomateros", venados: "Venados", yaquis: "Yaquis",
  };
  return `${display[away]} ${display[home]} ${Number(d)} ${months[Number(m) - 1]} ${y}`;
}

async function validatedReplay(video: ChannelVideo, context: LmpYoutubeGameContext): Promise<LmpYoutubeVideo | null> {
  const url = `https://www.youtube.com/watch?v=${video.id}`;
  try {
    const response = await fetch(url, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(7000),
      headers: { Accept: "text/html" },
    });
    if (!response.ok || !response.url.startsWith("https://www.youtube.com/")) return null;
    const html = await response.text();
    if (html.length > 2_500_000) return null;
    const p = (
      initialJson(html, "var ytInitialPlayerResponse = ") ??
      initialJson(html, "ytInitialPlayerResponse = ")
    ) as {
      videoDetails?: { videoId?: string; title?: string; channelId?: string; lengthSeconds?: string; isLiveContent?: boolean };
      playabilityStatus?: { status?: string; reason?: string };
      microformat?: { playerMicroformatRenderer?: { liveBroadcastDetails?: { isLiveNow?: boolean; endTimestamp?: string } } };
    } | null;

    const details = p?.videoDetails;
    const live = p?.microformat?.playerMicroformatRenderer?.liveBroadcastDetails;

    // Some legitimate members-only archived streams return a YouTube bot
    // challenge to server-side requests even though the league's official
    // channel search lists the exact dated 2h+ video. Retain a "consult"
    // link, but mark playback UNVERIFIED; do not claim it is watchable.
    if (!details && video.officialUploader && video.durationSeconds >= 60 * 60 &&
        matchesGame(video.title, context) &&
        p?.playabilityStatus?.status === "LOGIN_REQUIRED" &&
        /sign in to confirm you.re not a bot/i.test(p.playabilityStatus.reason ?? "") &&
        html.includes(video.id)) {
      return { url, title: video.title, durationSeconds: video.durationSeconds, accessUnverified: true };
    }
    if (!details || details.videoId !== video.id ||
        details.channelId !== OFFICIAL_CHANNEL_ID ||
        !details.title || !matchesGame(details.title, context) ||
        details.isLiveContent !== true ||
        !Number.isFinite(Number(details.lengthSeconds)) ||
        Number(details.lengthSeconds) < 60 * 60 ||
        !live?.endTimestamp || live.isLiveNow === true) return null;

    const status = p?.playabilityStatus?.status;
    const reason = p?.playabilityStatus?.reason ?? "";
    const membersOnly = status === "UNPLAYABLE" && /join this channel|members.only|hazte miembro/i.test(reason);
    if (status !== "OK" && !membersOnly) return null;

    return { url, title: details.title, durationSeconds: Number(details.lengthSeconds), membersOnly };
  } catch {
    return null;
  }
}

/**
 * Matches a recorded stream to a single LMP game by teams, Mexican date,
 * doubleheader number, 60+ minute duration, ended live broadcast and
 * official YouTube channel. Never identifies a short highlight as replay.
 */
export const findLmpYoutubeReplay = cache(async (
  gamePk: number,
  context: LmpYoutubeGameContext,
): Promise<LmpYoutubeVideo | null> => {
  if (!Number.isSafeInteger(gamePk) || gamePk <= 0) return null;

  const known = KNOWN_ARCHIVE_IDS[gamePk];
  const day = mexicoDay(context.startTime);
  const away = context.away ? teamKey(context.away) : null;
  const home = context.home ? teamKey(context.home) : null;
  if (known && known.day === day && known.away === away && known.home === home &&
      context.gameNumber === known.number && (context.doubleHeader === "Y" || context.doubleHeader === "S")) {
    return validatedReplay({ id: known.id, title: "", durationSeconds: 0 }, context);
  }

  const listed = chooseUnique(await channelVideos("streams"), context, "replay");
  if (listed) return validatedReplay(listed, context);

  const query = searchTerms(context);
  if (!query) return null;
  const searched = chooseUnique(await channelVideos("streams", query), context, "replay");
  return searched ? validatedReplay(searched, context) : null;
});

/** Resúmenes oficiales identificados en la pestaña Videos, NO juegos completos. */
export const findLmpYoutubeHighlight = cache(async (
  gamePk: number,
  context: LmpYoutubeGameContext,
): Promise<LmpYoutubeVideo | null> => {
  const known = KNOWN_HIGHLIGHT_IDS[gamePk];
  if (known && known.day === mexicoDay(context.startTime) &&
      known.away === teamKey(context.away ?? "") &&
      known.home === teamKey(context.home ?? "") &&
      (context.doubleHeader === "Y" || context.doubleHeader === "S") && context.gameNumber === known.number &&
      matchesGame(known.title, context)) {
    return {
      url: `https://www.youtube.com/watch?v=${known.id}`,
      title: known.title,
      durationSeconds: known.seconds,
    };
  }

  let selected = chooseUnique(await channelVideos("videos"), context, "highlight");
  if (!selected) {
    const query = searchTerms(context);
    if (query) selected = chooseUnique(await channelVideos("videos", query), context, "highlight");
  }
  return selected ? {
    url: `https://www.youtube.com/watch?v=${selected.id}`,
    title: selected.title,
    durationSeconds: selected.durationSeconds,
  } : null;
});
