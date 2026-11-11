import { cache } from "react";

// Algodoneros de Guasave (LMP), no confundir con Unión Laguna (LMB).
// Datos de plantilla/posiciones: StatsAPI, liga 132, deporte 17, temporada 2026.
// Noticias: WordPress REST del sitio oficial del equipo.
const API = "https://statsapi.mlb.com/api/v1";
const NEWS = "https://losalgodoneros.com/wp-json/wp/v2/posts?per_page=8&_fields=date,link,title,excerpt";
const TEAM_ID = 5482;
const SEASON = 2026;

export type LmpClubNews = { title: string; url: string; published: string; excerpt: string };
export type LmpClubPlayer = { id: number; name: string; number: string; position: string; group: string; photo: string | null; bats: string; throws: string; birthDate: string };
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

type LmpRosterEntry = {
  name?: string;
  playerPosition?: string;
  thumb?: string;
  playerNum?: string | number;
  playerMLBamID?: number;
  playerHitting?: string;
  playerFielding?: string;
  playerBirthday?: string;
  playerStatus?: string;
};
const LMP_ROSTER_URL = "https://api.lmp.mx/3.0.0/teams/5482/roster";
export const getAlgodonerosRoster = cache(async (): Promise<LmpClubPlayer[]> => {
  const body = await officialJson<{ response?: LmpRosterEntry[] }>(LMP_ROSTER_URL);
  if (!Array.isArray(body?.response)) return [];
  const groups: Record<string, string> = {
    Pitcher: "Lanzadores", Catcher: "Receptores",
    Infield: "Jugadores del cuadro", Outfield: "Jardineros"
  };
  return body.response.flatMap(item => {
    const name = item.name?.trim();
    const id = item.playerMLBamID;
    const group = groups[item.playerPosition ?? ""];
    if (!name || !id || !group || item.playerStatus !== "active") return [];
    const photo = item.thumb && /^https:\/\/images\.cloudgfx\.com\/player\/mugshot2\/\d+\?/.test(item.thumb)
      ? item.thumb : null;
    return [{
      id, name, number:String(item.playerNum ?? "—"),
      position:item.playerPosition ?? "",
      group, photo,
      bats:item.playerHitting ?? "",
      throws:item.playerFielding ?? "",
      birthDate:item.playerBirthday ?? ""
    }];
  });
});

export type AlgodonerosFixture = {
  id: number;
  startTime: string;
  opponent: string;
  home: boolean;
  venue: string;
};
type LmpFixture = {
  gamePk?: number;
  gameDate?: string;
  status?: { abstractGameState?: string };
  teams?: {away?:{team?:{id?:number;name?:string}};home?:{team?:{id?:number;name?:string}}};
  venue?: {name?:string};
};
export const getAlgodonerosFixtures = cache(async (): Promise<AlgodonerosFixture[]> => {
  const now = new Date();
  const start = now.toISOString().slice(0,10);
  const finish = new Date(now.getTime()+35*86400000).toISOString().slice(0,10);
  const body = await officialJson<{dates?:Array<{games?:LmpFixture[]}>}>(
    `${API}/schedule?sportId=17&leagueId=132&teamId=${TEAM_ID}&startDate=${start}&endDate=${finish}`
  );
  return (body?.dates??[]).flatMap(d=>d.games??[]).flatMap(g=>{
    if (!g.gamePk || !g.gameDate || Date.parse(g.gameDate) <= now.getTime()-300000
        || g.status?.abstractGameState==="Final") return [];
    const home = g.teams?.home?.team?.id===TEAM_ID;
    const opponent = home ? g.teams?.away?.team?.name : g.teams?.home?.team?.name;
    return opponent ? [{
      id:g.gamePk, startTime:g.gameDate, home,
      opponent, venue:g.venue?.name ?? "Estadio por confirmar"
    }] : [];
  }).sort((a,b)=>Date.parse(a.startTime)-Date.parse(b.startTime)).slice(0,8);
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
