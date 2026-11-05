import type { LmbClubRecord } from "@/lib/lmbClubs";

// Identificadores de los 20 clubes en la API oficial de LMB, temporada 2026.
// Verificados mediante /api/v1/teams?sportId=11&leagueIds=125&season=2026.
// Este archivo ofrece datos históricos de 2026, NO afirma ser el roster actual.
export const LMB_TEAM_IDS_2026: Record<LmbClubRecord["slug"], number> = {
  algodoneros: 447, tecos: 536, acereros: 560, caliente: 4444,
  charros: 6304, rieleros: 528, saraperos: 502, sultanes: 562,
  toros: 5010, "diablos-rojos": 532, "el-aguila": 5567,
  guerreros: 579, leones: 496, pericos: 520, piratas: 523,
  tigres: 569, bravos: 434, olmecas: 442, dorados: 575,
  conspiradores: 6303,
};

export type LmbStatHighlight = {
  metric: string;
  name: string;
  value: string;
  unit: string;
  playerId: number;
  source: string;
};

export type LmbClubStatLeaders = {
  season: number;
  batting: LmbStatHighlight[];
  pitching: LmbStatHighlight[];
  sourceStatus: "connected" | "unavailable";
};

type StatValue = string | number | null | undefined;
type PlayerStat = {
  player?: { id?: number; fullName?: string };
  team?: { id?: number };
  stat?: Record<string, StatValue>;
};

const SEASON = 2026;
const API = "https://statsapi.mlb.com/api/v1";
const REVALIDATE_SECONDS = 1800;
const HITTING_MIN_AB = 100;
const PITCHING_MIN_IP = 30;

const numberValue = (value: StatValue): number => {
  if (value === null || value === undefined || value === "") return NaN;
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : NaN;
};

// En béisbol 45.2 IP significa 45 entradas y dos outs, no 45.2 decimales.
function innings(value: StatValue): number {
  if (value === undefined || value === null) return NaN;
  const raw = String(value);
  const matched = raw.match(/^(\d+)(?:\.([012]))?$/);
  if (!matched) return NaN;
  return Number(matched[1]) + Number(matched[2] ?? 0) / 3;
}

async function getTeamStats(teamId: number, group: "hitting" | "pitching"): Promise<PlayerStat[]> {
  const params = new URLSearchParams({
    stats: "season",
    group,
    sportIds: "11",
    leagueId: "125",
    season: String(SEASON),
    teamId: String(teamId),
    playerPool: "ALL",
    limit: "500",
  });
  try {
    const response = await fetch(`${API}/stats?${params.toString()}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return [];
    const data = await response.json();
    const splits: unknown = data?.stats?.[0]?.splits;
    if (!Array.isArray(splits)) return [];
    return (splits as PlayerStat[]).filter(row =>
      row.team?.id === teamId &&
      Number.isSafeInteger(row.player?.id) &&
      Boolean(row.player?.fullName?.trim()) &&
      Boolean(row.stat)
    );
  } catch {
    return [];
  }
}

function topHighlight(
  stats: PlayerStat[],
  metric: string,
  key: string,
  unit: string,
  options: { minAB?: number; minIP?: number; smallest?: boolean } = {}
): LmbStatHighlight | null {
  const candidates = stats.filter(player => {
    const stat = player.stat;
    if (!stat) return false;
    if (options.minAB && numberValue(stat.atBats) < options.minAB) return false;
    if (options.minIP && innings(stat.inningsPitched) < options.minIP) return false;
    const value = numberValue(stat[key]);
    return Number.isFinite(value) && (options.smallest || value > 0);
  });
  if (candidates.length === 0) return null;

  const sorted = [...candidates].sort((a, b) => {
    const difference = numberValue(a.stat?.[key]) - numberValue(b.stat?.[key]);
    if (difference !== 0) return options.smallest ? difference : -difference;
    const inningsDifference = innings(b.stat?.inningsPitched) - innings(a.stat?.inningsPitched);
    if (Number.isFinite(inningsDifference) && inningsDifference !== 0) return inningsDifference;
    return numberValue(b.stat?.atBats) - numberValue(a.stat?.atBats) || 0;
  });
  const best = sorted[0];
  const id = best.player?.id;
  const name = best.player?.fullName?.trim();
  if (!id || !name) return null;

  const value = String(best.stat?.[key]);
  return {
    metric,
    name,
    value,
    unit,
    playerId: id,
    source: `https://lmb.com.mx/jugador/${id}`,
  };
}

function available(items: Array<LmbStatHighlight | null>): LmbStatHighlight[] {
  return items.filter((item): item is LmbStatHighlight => item !== null);
}

export async function getLmbClubStatLeaders(slug: string): Promise<LmbClubStatLeaders> {
  const teamId = LMB_TEAM_IDS_2026[slug];
  const empty: LmbClubStatLeaders = {
    season: SEASON, batting: [], pitching: [], sourceStatus: "unavailable",
  };
  if (!teamId) return empty;

  const [hitting, pitching] = await Promise.all([
    getTeamStats(teamId, "hitting"),
    getTeamStats(teamId, "pitching"),
  ]);

  const batting = available([
    topHighlight(hitting, "Promedio de bateo · mín. 100 AB", "avg", "AVG", { minAB: HITTING_MIN_AB }),
    topHighlight(hitting, "Jonrones", "homeRuns", "HR"),
    topHighlight(hitting, "Carreras producidas", "rbi", "RBI"),
    topHighlight(hitting, "Carreras anotadas", "runs", "R"),
    topHighlight(hitting, "Bases robadas", "stolenBases", "SB"),
  ]);
  const pitchers = available([
    topHighlight(pitching, "Efectividad · mín. 30 IP", "era", "ERA", { minIP: PITCHING_MIN_IP, smallest: true }),
    topHighlight(pitching, "Juegos ganados", "wins", "W"),
    topHighlight(pitching, "Ponches", "strikeOuts", "SO"),
    topHighlight(pitching, "Salvamentos", "saves", "SV"),
  ]);
  return {
    season: SEASON,
    batting,
    pitching: pitchers,
    sourceStatus: hitting.length > 0 || pitching.length > 0 ? "connected" : "unavailable",
  };
}
