import { cache } from "react";

// Algodoneros de Guasave (LMP), no confundir con Unión Laguna (LMB).
// Datos de plantilla/posiciones: StatsAPI, liga 132, deporte 17, temporada 2026.
// Noticias: WordPress REST del sitio oficial del equipo.
const API = "https://statsapi.mlb.com/api/v1";
const NEWS = "https://losalgodoneros.com/wp-json/wp/v2/posts?per_page=8&_fields=date,link,title,excerpt";
const TEAM_ID = 5482;
const SEASON = 2026;

export type LmpClubNews = { title: string; url: string; published: string; excerpt: string };
export type LmpClubPlayer = { id: number; name: string; number: string; position: string; group: string };
export type LmpClubRecord = { wins: number; losses: number; pct: string; standing: number };

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&(?:aacute|eacute|iacute|oacute|uacute|ntilde);/gi, entity => ({
      "&aacute;":"á","&eacute;":"é","&iacute;":"í",
      "&oacute;":"ó","&uacute;":"ú","&ntilde;":"ñ"
    }[entity.toLowerCase()] ?? entity))
    .replace(/\s+/g, " ").trim();
}
async function officialJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      next: { revalidate: 900 },
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(11000)
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

type WpPost = { title?: { rendered?: string }; excerpt?: { rendered?: string }; link?: string; date?: string };
export const getAlgodonerosNews = cache(async (): Promise<LmpClubNews[]> => {
  const posts = await officialJson<WpPost[]>(NEWS);
  if (!Array.isArray(posts)) return [];
  return posts.flatMap(post => {
    const title = plainText(post.title?.rendered ?? "");
    const url = post.link ?? "";
    if (title.length < 8 || !url.startsWith("https://losalgodoneros.com/")) return [];
    return [{title, url, published:post.date ?? "", excerpt:plainText(post.excerpt?.rendered ?? "").slice(0,220)}];
  });
});

type RosterItem = {
  person?: { id?: number; fullName?: string };
  jerseyNumber?: string;
  position?: { type?: string; name?: string };
};
export const getAlgodonerosRoster = cache(async (): Promise<LmpClubPlayer[]> => {
  const body = await officialJson<{roster?: RosterItem[]}>(`${API}/teams/${TEAM_ID}/roster?rosterType=active&season=${SEASON}`);
  if (!Array.isArray(body?.roster)) return [];
  const groups: Record<string,string> = {
    Pitcher: "Lanzadores", Catcher: "Receptores",
    Infielder: "Jugadores del cuadro", Outfielder: "Jardineros"
  };
  return body.roster.flatMap(item => {
    const id = item.person?.id;
    const name = item.person?.fullName?.trim();
    if (!id || !name) return [];
    const type = item.position?.type ?? "";
    return [{
      id, name, number:item.jerseyNumber ?? "—",
      position:item.position?.name ?? "Posición por confirmar",
      group:groups[type] ?? "Otros jugadores"
    }];
  });
});

type TeamRecord = {team?: {id?:number}; wins?:number;losses?:number;leagueRank?:string};
export const getAlgodonerosStanding = cache(async ():Promise<LmpClubRecord | null> => {
  const body = await officialJson<{records?: Array<{teamRecords?:TeamRecord[]}>}>(
    `${API}/standings?leagueId=132&season=${SEASON}&standingsTypes=regularSeason&hydrate=team`
  );
  const teams = body?.records?.flatMap(record=>record.teamRecords ?? []) ?? [];
  const club = teams.find(team=>team.team?.id===TEAM_ID);
  if (!club || typeof club.wins!=="number" || typeof club.losses!=="number") return null;
  const sorted = [...teams].sort((a,b) => {
    const ag = (a.wins??0)+(a.losses??0), bg=(b.wins??0)+(b.losses??0);
    return (bg? (b.wins??0)/bg : 0) - (ag? (a.wins??0)/ag : 0);
  });
  return {
    wins:club.wins, losses:club.losses,
    pct:(club.wins/(club.wins+club.losses)||0).toFixed(3).replace(/^0/, ""),
    standing:sorted.findIndex(t=>t.team?.id===TEAM_ID)+1
  };
});
