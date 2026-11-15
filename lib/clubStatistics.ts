import { cache } from "react";
import type { Standing } from "@/lib/mlb";

export type ClubStatsLeague = "MLB" | "LMB" | "LMP";
export type ClubStatHighlight = {
  metric: string;
  name: string;
  value: string;
  unit: string;
  source: string;
};
export type ClubSeasonStatistics = {
  season: number;
  batting: { runs: string; homeRuns: string; avg: string } | null;
  pitching: { era: string; strikeOuts: string; whip: string } | null;
  leaders: { batting: ClubStatHighlight[]; pitching: ClubStatHighlight[] };
  dataEndpoint: string;
};
export type ClubStanding = Standing & { rank?: number };

const API = "https://statsapi.mlb.com/api/v1";
const SPORT: Record<ClubStatsLeague, number> = { MLB: 1, LMB: 11, LMP: 17 };
const officialLeague: Record<ClubStatsLeague, number> = { MLB: 0, LMB: 125, LMP: 132 };
const mlbDivisions: Record<number, string> = {
  200: "Liga Americana Oeste", 201: "Liga Americana Este", 202: "Liga Americana Central",
  203: "Liga Nacional Oeste", 204: "Liga Nacional Este", 205: "Liga Nacional Central",
};

export function mexicoSeasonYear(): number {
  return Number(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Mexico_City", year: "numeric",
  }).format(new Date()));
}

export function clubSeasonLabel(league: ClubStatsLeague, season: number): string {
  return league === "LMP" ? `${season}–${String(season + 1).slice(-2)}` : String(season);
}

async function officialJson(url: string): Promise<any | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    return response.ok ? await response.json() : null;
  } catch { return null; }
}

// La tabla y las cifras individuales/colectivas deben corresponder al mismo
// año de temporada. No usar la tabla con fallback independiente del Resumen.
export const getClubSeasonStandings = cache(async (
  league: ClubStatsLeague, season: number,
): Promise<ClubStanding[]> => {
  if (!Number.isInteger(season) || season < 1900) return [];
  const leagueIds = league === "MLB" ? "103,104" : String(officialLeague[league]);
  const data = await officialJson(`${API}/standings?leagueId=${leagueIds}&season=${season}` +
    "&standingsTypes=regularSeason&hydrate=team");
  const rows: ClubStanding[] = [];
  for (const record of data?.records ?? []) {
    const divisionId = Number(record?.division?.id ?? 0);
    const division = league === "MLB" ? mlbDivisions[divisionId] ?? "División"
      : league === "LMB" ? divisionId === 222 ? "Zona Norte"
        : divisionId === 223 ? "Zona Sur" : "Zona por verificar"
      : "Liga Mexicana del Pacífico";
    for (const entry of record?.teamRecords ?? []) {
      const teamId = Number(entry?.team?.id);
      if (!Number.isSafeInteger(teamId) || !entry?.team?.name) continue;
      const officialRank = Number(league === "LMP" ? entry.leagueRank : entry.divisionRank);
      rows.push({
        division, teamId, team: String(entry.team.name),
        wins: Number(entry.wins ?? 0), losses: Number(entry.losses ?? 0),
        pct: String(entry.winningPercentage ?? ".000"),
        gamesBack: String(entry.gamesBack ?? "-"),
        ...(Number.isSafeInteger(officialRank) && officialRank > 0 ? { rank: officialRank } : {}),
      });
    }
  }
  return rows;
});

function numberText(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && /^(?:\d+(?:\.\d+)?|\.\d+)$/.test(value)) return value;
  return "—";
}

function firstStat(body: any): Record<string, unknown> | null {
  if (!Array.isArray(body?.stats)) return null;
  for (const group of body.stats) {
    const row = group?.splits?.find((part: any) => part?.stat && typeof part.stat === "object");
    if (row) return row.stat;
  }
  return null;
}

type PlayerSplit = {
  team?: { id?: number };
  player?: { id?: number; fullName?: string };
  stat?: Record<string, string | number | null>;
};

function number(value: unknown): number {
  if (value === "" || value === null || value === undefined) return NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

// Una entrada registrada como 9.2 equivale a 9 entradas y dos outs.
function innings(value: unknown): number {
  const matched = String(value ?? "").match(/^(\d+)(?:\.([012]))?$/);
  return matched ? Number(matched[1]) + Number(matched[2] ?? 0) / 3 : NaN;
}

function topPlayer(rows: PlayerSplit[], metric: string, key: string, unit: string,
  source: (id: number) => string,
  { minAB = 0, minIP = 0, smallest = false } = {}): ClubStatHighlight | null {
  const candidates = rows.filter(row => {
    if (!row.stat) return false;
    if (minAB && number(row.stat.atBats) < minAB) return false;
    if (minIP && innings(row.stat.inningsPitched) < minIP) return false;
    const value = number(row.stat[key]);
    return Number.isFinite(value) && (smallest || value > 0);
  });
  candidates.sort((a, b) => {
    const aValue = number(a.stat?.[key]);
    const bValue = number(b.stat?.[key]);
    const delta = smallest ? aValue - bValue : bValue - aValue;
    return delta || number(b.stat?.atBats ?? 0) - number(a.stat?.atBats ?? 0);
  });
  const best = candidates[0];
  if (!best?.player?.id || !best.player.fullName) return null;
  return { metric, name: best.player.fullName, value: numberText(best.stat?.[key]), unit,
    source: source(best.player.id) };
}

export const getClubSeasonStatistics = cache(async (
  league: ClubStatsLeague, teamId: number, requestedSeason: number,
): Promise<ClubSeasonStatistics | null> => {
  if (!Number.isSafeInteger(teamId) || teamId <= 0 ||
      !Number.isInteger(requestedSeason) || requestedSeason < 1900) return null;
  const [battingData, pitchingData] = await Promise.all([
    officialJson(`${API}/teams/${teamId}/stats?stats=season&season=${requestedSeason}&group=hitting`),
    officialJson(`${API}/teams/${teamId}/stats?stats=season&season=${requestedSeason}&group=pitching`),
  ]);
  const battingStat = firstStat(battingData), pitchingStat = firstStat(pitchingData);
  if (!battingStat && !pitchingStat) return null;

  const rosterStats = (group: "hitting" | "pitching") => {
    const query = new URLSearchParams({
      stats: "season", group, sportIds: String(SPORT[league]),
      season: String(requestedSeason), teamId: String(teamId),
      playerPool: "ALL", limit: "500",
    });
    if (officialLeague[league]) query.set("leagueId", String(officialLeague[league]));
    return `${API}/stats?${query}`;
  };
  const [hittingRows, pitchingRows] = await Promise.all([
    officialJson(rosterStats("hitting")), officialJson(rosterStats("pitching")),
  ]);
  const validated = (body: any): PlayerSplit[] => {
    const splits: unknown = body?.stats?.[0]?.splits;
    return Array.isArray(splits) ? (splits as PlayerSplit[]).filter(row =>
      row.team?.id === teamId && Number.isSafeInteger(row.player?.id) &&
      Boolean(row.player?.fullName?.trim()) && Boolean(row.stat)) : [];
  };
  const hitters = validated(hittingRows), pitchers = validated(pitchingRows);
  // Estos enlaces llevan a fichas públicas legibles; la API solo abastece los datos.
  const playerSource = (id: number) =>
    league === "MLB" ? `https://www.mlb.com/es/player/${id}` :
    league === "LMB" ? `https://lmb.com.mx/jugador/${id}` :
    `https://www.lmp.mx/jugadores/${id}/ficha-tecnica`;
  const select = (items: (ClubStatHighlight | null)[]) =>
    items.filter((item): item is ClubStatHighlight => item !== null);
  return {
    season: requestedSeason,
    batting: battingStat ? {
      runs: numberText(battingStat.runs), homeRuns: numberText(battingStat.homeRuns),
      avg: numberText(battingStat.avg),
    } : null,
    pitching: pitchingStat ? {
      era: numberText(pitchingStat.era), strikeOuts: numberText(pitchingStat.strikeOuts),
      whip: numberText(pitchingStat.whip),
    } : null,
    leaders: {
      batting: select([
        topPlayer(hitters, "Promedio de bateo · mín. 100 turnos", "avg", "PROM", playerSource, { minAB: 100 }),
        topPlayer(hitters, "Cuadrangulares", "homeRuns", "HR", playerSource),
        topPlayer(hitters, "Carreras producidas", "rbi", "CP", playerSource),
        topPlayer(hitters, "Carreras anotadas", "runs", "CA", playerSource),
        topPlayer(hitters, "Bases robadas", "stolenBases", "BR", playerSource),
      ]),
      pitching: select([
        topPlayer(pitchers, "Efectividad · mín. 30 entradas", "era", "EFE", playerSource, { minIP: 30, smallest: true }),
        topPlayer(pitchers, "Juegos ganados", "wins", "JG", playerSource),
        topPlayer(pitchers, "Ponches", "strikeOuts", "P", playerSource),
        topPlayer(pitchers, "Salvamentos", "saves", "SV", playerSource),
      ]),
    },
    dataEndpoint: `${API}/teams/${teamId}/stats?stats=season&season=${requestedSeason}&group=hitting`,
  };
});

export async function getLatestClubSeasonStatistics(league: ClubStatsLeague,
  teamId: number, season: number): Promise<ClubSeasonStatistics | null> {
  const current = await getClubSeasonStatistics(league, teamId, season);
  // Béisbol invernal: el año representa el arranque de la temporada; no
  // retroceder a otra campaña mientras la actual está en curso.
  if (league === "LMP") return current;
  return current ?? getClubSeasonStatistics(league, teamId, season - 1);
}
