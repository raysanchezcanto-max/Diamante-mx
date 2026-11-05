// TEMPORARY diagnostic. Must remove before final deployment.
import { readRosterFromOfficialHtml, getLmbClubRoster } from "@/lib/lmbClubContent";
export const dynamic="force-dynamic";
export async function GET(){
 const slugs=["acereros","saraperos","diablos-rojos","olmecas","guerreros"];
 return Response.json(await Promise.all(slugs.map(async slug=>{
  const r=await fetch("https://lmb.com.mx/equipos/"+slug+"/roster",{cache:"no-store",signal:AbortSignal.timeout(10000)});
  const html=await r.text();
  const clean=html.slice(0,html.indexOf("(self.__next_f")>=0?html.indexOf("(self.__next_f"):undefined);
  const groups=readRosterFromOfficialHtml(clean);
  const original=await getLmbClubRoster(slug);
  return {slug,parsed:groups.reduce((n,g)=>n+g.players.length,0),parsedGroups:groups.map(g=>({name:g.name,count:g.players.length})),
    directHttp:r.status,originalStatus:original.sourceStatus,
    originalCount:original.roster.reduce((n,g)=>n+g.players.length,0)};
 })));
}