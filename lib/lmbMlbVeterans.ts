import type { OfficialRosterGroup, OfficialPlayer } from "./lmbClubContent";

// MLB Stats API registra mlbDebutDate solamente para quienes realmente jugaron
// en Grandes Ligas. No confundir con firmas de sucursales ni afirmar una
// transferencia hacia MLB desde el club.
export type LmbMlbVeteran = OfficialPlayer & {
  mlbDebutDate: string;
  position: string;
};
export type LmbMlbVeteransResult = {
  status: "connected"|"unavailable";
  players: LmbMlbVeteran[];
};
type MlbPerson = {
  id?: number;
  mlbDebutDate?: string | null;
  primaryPosition?: {abbreviation?:string};
};
export async function getLmbMlbVeterans(
  roster: OfficialRosterGroup[],
): Promise<LmbMlbVeteransResult> {
  const players=roster.flatMap(group=>group.players);
  const ids=[...new Set(players.map(p=>p.playerId))]
    .filter(n=>Number.isInteger(n)&&n>0).slice(0,80);
  if(ids.length===0)return {status:"unavailable",players:[]};
  const url="https://statsapi.mlb.com/api/v1/people?personIds="+ids.join(",");
  try {
    const r=await fetch(url,{
      next:{revalidate:86400},
      headers:{Accept:"application/json"},
      signal:AbortSignal.timeout(9000),
    });
    if(!r.ok)return{status:"unavailable",players:[]};
    const j=await r.json();
    if(!Array.isArray(j?.people))return{status:"unavailable",players:[]};
    const official=new Map<number,MlbPerson>(j.people.filter((p:MlbPerson)=>Number.isInteger(p.id)).map((p:MlbPerson)=>[p.id!,p]));
    const veterans=players.flatMap(player=>{
      const person=official.get(player.playerId);
      const date=person?.mlbDebutDate;
      if(typeof date!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(date))return[];
      return [{...player,mlbDebutDate:date,position:person?.primaryPosition?.abbreviation??"—"}];
    });
    return {status:"connected",players:veterans.sort((a,b)=>b.mlbDebutDate.localeCompare(a.mlbDebutDate))};
  } catch {return{status:"unavailable",players:[]}}
}
