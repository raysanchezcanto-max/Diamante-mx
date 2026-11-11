import {cache} from "react";
import type { LmpClubDefinition } from "./lmpClubDirectory";
import type { LmpClubNews, LmpClubPlayer, LmpClubRecord, AlgodonerosFixture } from "./lmpAlgodonerosContent";

const API="https://statsapi.mlb.com/api/v1";
async function officialJSON<T>(url:string):Promise<T|null>{
 try {
  const r=await fetch(url,{next:{revalidate:900},signal:AbortSignal.timeout(12000),headers:{Accept:"application/json"}});
  return r.ok?(await r.json()) as T:null;
 } catch { return null; }
}
type RosterEntry={name?:string;playerPosition?:string;thumb?:string;playerNum?:number|string;playerMLBamID?:number;playerHitting?:string;playerFielding?:string;playerBirthday?:string;playerStatus?:string};
const labels:Record<string,string>={Pitcher:"Lanzadores",Catcher:"Receptores",Infield:"Jugadores del cuadro",Outfield:"Jardineros"};
export const getLmpDirectoryRoster=cache(async(id:number):Promise<LmpClubPlayer[]>=>{
 const j=await officialJSON<{response?:RosterEntry[]}>(`https://api.lmp.mx/3.0.0/teams/${id}/roster`);
 if(!Array.isArray(j?.response))return [];
 return j.response.flatMap(item=>{
  const group=labels[item.playerPosition??""],name=item.name?.trim(),mlbid=Number(item.playerMLBamID);
  if(!group||!name||!Number.isFinite(mlbid)||mlbid<=0||item.playerStatus!=="active")return [];
  const thumb=item.thumb??"";
  const photo=/^https:\/\/images\.cloudgfx\.com\/player\/mugshot2\/\d+\?/.test(thumb)?thumb:null;
  return [{id:mlbid,name,group,photo,number:String(item.playerNum??"—"),position:item.playerPosition??"",bats:item.playerHitting??"",throws:item.playerFielding??"",birthDate:item.playerBirthday??""}];
 });
});
type ScheduleGame={gamePk?:number;gameDate?:string;status?:{abstractGameState?:string};teams?:{home?:{team?:{id?:number;name?:string}};away?:{team?:{id?:number;name?:string}}};venue?:{name?:string}};
export const getLmpDirectoryFixtures=cache(async(id:number):Promise<AlgodonerosFixture[]>=>{
 const now=new Date(),start=now.toISOString().slice(0,10),end=new Date(now.getTime()+35*86400000).toISOString().slice(0,10);
 const body=await officialJSON<{dates?:Array<{games?:ScheduleGame[]}>}>(`${API}/schedule?sportId=17&leagueId=132&teamId=${id}&startDate=${start}&endDate=${end}`);
 return (body?.dates??[]).flatMap(d=>d.games??[]).flatMap(g=>{
  if(!g.gamePk||!g.gameDate||Date.parse(g.gameDate)<=now.getTime()-300000||g.status?.abstractGameState==="Final")return [];
  const home=g.teams?.home?.team?.id===id;
  const opponent=home?g.teams?.away?.team?.name:g.teams?.home?.team?.name;
  return opponent?[{id:g.gamePk,startTime:g.gameDate,opponent,home,venue:g.venue?.name??"Estadio por confirmar"}]:[];
 }).sort((a,b)=>Date.parse(a.startTime)-Date.parse(b.startTime)).slice(0,8);
});
type StandRec={team?:{id?:number};wins?:number;losses?:number};
export const getLmpDirectoryStanding=cache(async(id:number):Promise<LmpClubRecord|null>=>{
 const body=await officialJSON<{records?:Array<{teamRecords?:StandRec[]}>}>(`${API}/standings?leagueId=132&season=2026&standingsTypes=regularSeason&hydrate=team`);
 const teams=body?.records?.flatMap(r=>r.teamRecords??[])??[];
 const club=teams.find(t=>t.team?.id===id);
 if(!club||typeof club.wins!=="number"||typeof club.losses!=="number")return null;
 const n=club.wins+club.losses;
 const sorted=[...teams].sort((a,b)=>(b.wins??0)/((b.wins??0)+(b.losses??0)||1)-(a.wins??0)/((a.wins??0)+(a.losses??0)||1));
 return {wins:club.wins,losses:club.losses,pct:(n?club.wins/n:0).toFixed(3).replace(/^0/,""),standing:sorted.findIndex(t=>t.team?.id===id)+1};
});
type Post={title?:string;description?:string;date?:string;slug?:string;"cover-medium"?:string;"cover-thumb"?:string};
function plain(v:string){return v.replace(/<[^>]*>/g," ").replace(/&[a-zA-Z#0-9]+;/g,entity=>({"&aacute;":"á","&eacute;":"é","&iacute;":"í","&oacute;":"ó","&uacute;":"ú","&ntilde;":"ñ","&amp;":"&","&quot;":'"'}[entity.toLowerCase()]??" ")).replace(/\s+/g," ").trim();}
const normalized=(v:string)=>v.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const titleKeys:Record<number,RegExp>={
 673:/^(?:las? )?aguilas(?: de mexicali)?\b|^mexicali\b/i,
 674:/^charros(?: de jalisco)?\b|^jalisco\b/i,
 675:/^caneros(?: de los mochis)?\b|^los mochis\b/i,
 676:/^mayos(?: de navojoa)?\b|^navojoa\b/i,
 677:/^naranjeros(?: de hermosillo)?\b|^hermosillo\b/i,
 678:/^tomateros(?: de culiacan)?\b|^culiacan\b/i,
 679:/^venados(?: de mazatlan)?\b|^mazatlan\b/i,
 680:/^yaquis(?: de obregon)?\b|^obregon\b/i,
 6483:/^jaguares(?: de nayarit)?\b|^nayarit\b/i,
};
// Filter strictly by title's subject. Merely mentioning a rival later in the
// article is not sufficient to attribute the news to the chosen club.
export const getLmpDirectoryNews=cache(async(id:number):Promise<LmpClubNews[]>=>{
 const body=await officialJSON<{response?:{posts?:Post[]}}>("https://api.lmp.mx/3.0.0/posts?limit=100");
 const regex=titleKeys[id];
 if(!regex)return [];
 return (body?.response?.posts??[]).flatMap(p=>{
  const title=plain(p.title??"");
  if(!regex.test(normalized(title))||!p.slug||!p.date)return [];
  const thumb=p["cover-medium"]??p["cover-thumb"]??"";
  const image=thumb.startsWith("https://images.lmp.mx/")?thumb:null;
  return [{title,url:"https://lmp.mx/posts/"+encodeURIComponent(p.slug),published:p.date,excerpt:plain(p.description??"").slice(0,220),image}];
 }).slice(0,8);
});
type MlbPerson={id:number;fullName?:string;mlbDebutDate?:string;primaryPosition?:{name?:string}};
export type LmpMlbAlumnus={id:number;name:string;debut:string;role:string};
export const getLmpDirectoryMlbAlumni=cache(async(id:number):Promise<LmpMlbAlumnus[]>=>{
 const roster=await getLmpDirectoryRoster(id);
 const ids=roster.map(p=>p.id).filter(n=>Number.isSafeInteger(n)).slice(0,45);
 if(!ids.length)return [];
 const j=await officialJSON<{people?:MlbPerson[]}>(`${API}/people?personIds=${ids.join(",")}`);
 return (j?.people??[]).filter(p=>Boolean(p.mlbDebutDate)&&roster.some(r=>r.id===p.id))
  .map(p=>({id:p.id,name:p.fullName??roster.find(r=>r.id===p.id)?.name??"Jugador",debut:p.mlbDebutDate!,role:p.primaryPosition?.name??"Jugador"}))
  .sort((a,b)=>a.name.localeCompare(b.name,"es"));
});
export type LmpDirectoryMovement={url:string;title:string;published:string;excerpt:string};
export const getLmpDirectoryMovements=cache(async(club:LmpClubDefinition):Promise<LmpDirectoryMovement[]>=>{
 const news=await getLmpDirectoryNews(club.id);
 return news.filter(p=>/refuerzo|alta|baja|contrat|incorpor|firma|movimiento|roster|llega|activ|adquiere/i.test(normalized(p.title)+" "+normalized(p.excerpt)))
   .map(({url,title,published,excerpt})=>({url,title,published,excerpt}));
});
