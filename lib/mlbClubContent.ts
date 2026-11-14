import type { MlbClub } from "./mlbClubDirectory";

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
  stadium: string | null; firstYear: string | null;
  venueId: number | null;
};
export async function getMlbClubOverview(club: MlbClub): Promise<MlbClubOverview> {
  const data = await getJson("/teams/" + club.id + "?hydrate=division,league,venue", 86400);
  const t = data?.teams?.[0];
  const firstYear = typeof t?.firstYearOfPlay === "string" && /^\d{4}$/.test(t.firstYearOfPlay)
    ? t.firstYearOfPlay : null;
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
      (typeof t?.league?.name === "string" ? t.league.name : "Major League Baseball"),
    stadium: typeof t?.venue?.name === "string" ? t.venue.name : null,
    firstYear,
    venueId: Number.isInteger(t?.venue?.id) ? t.venue.id : null,
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
    return [{
      key: String(row?.id ?? index) + "-" + date, date,
      label: String(row?.typeDesc ?? row?.type?.description ?? "Movimiento oficial"),
      description: desc,
      player,
    } satisfies MlbClubTransaction];
  });
  items.sort((a: MlbClubTransaction, b: MlbClubTransaction) => b.date.localeCompare(a.date));
  return { sourceStatus: "connected", items: items.slice(0, 25) };
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
