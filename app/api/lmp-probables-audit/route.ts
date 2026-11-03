import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Temporary read-only diagnostic for matching LMP probable pitchers to the official games.
export async function GET() {
  const urls = {
    stats: "https://statsapi.mlb.com/api/v1/schedule?sportId=17&leagueId=132&startDate=2026-11-03&endDate=2026-11-03&hydrate=probablePitcher",
    lmp: "https://api.lmp.mx/3.0.0/scoreboard/2026/11/03",
    site: "https://www.lmp.mx/",
  };
  const results = await Promise.all(Object.entries(urls).map(async ([key, url]) => {
    try {
      const r = await fetch(url, { cache: "no-store", headers: { Accept: "application/json, text/html;q=0.9" }, signal: AbortSignal.timeout(10000) });
      const body = await r.text();
      const base: Record<string, unknown> = { key, status: r.status, bytes: body.length, contentType: r.headers.get("content-type") };
      if (key === "site") {
        base.players = ["Carver","Medrano","Cessa","Ríos","Rodríguez","Bonta","Romero"].map(s => {
          const at=body.toLowerCase().indexOf(s.toLowerCase());
          return { name:s,at,excerpt:at>=0?body.slice(Math.max(0,at-180),at+280):"" };
        });
        base.scripts = [...body.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(m=>m[1]).slice(0,25);
      } else {
        let data: unknown;
        try { data=JSON.parse(body); } catch { base.excerpt=body.slice(0,450);return base; }
        const root=data as Record<string, unknown>;
        base.topKeys = Array.isArray(data) ? "array" : Object.keys(root).slice(0,30);
        if (key === "lmp" && Array.isArray(root.response)) {
          base.games = (root.response as Array<Record<string,unknown>>).map(g=>({
            pk:g.boxScore, teamIds:[g.awayTeamId,g.homeTeamId],
            away:g.awayProbablePitcher, awayId:g.awayProbablePitcherMlbid,
            awayImage:g.awayProbablePitcherImg,
            home:g.homeProbablePitcher, homeId:g.homeProbablePitcherMlbid,
            homeImage:g.homeProbablePitcherImg,
            extraKeys:Object.keys(g).filter(k=>/probable/i.test(k)),
          }));
        }
        if (key === "stats") {
          const dates=(root?.dates as Array<{games?: Array<Record<string, unknown>>}>)??[];
          base.games=dates.flatMap(day=>day.games??[]).map(g=>{
            const teams=g.teams as Record<string, {team?:{id?:number,name?:string}; probablePitcher?:{id?:number,fullName?:string}}>;
            return {pk:g.gamePk,status:g.status,away:teams?.away?.team,home:teams?.home?.team,ap:teams?.away?.probablePitcher,hp:teams?.home?.probablePitcher};
          });
          return base;
        }
        const matches: Array<{path:string, keys:string[], sample:string}> = [];
        const names: Array<{path:string, sample:string}> = [];
        const seen=new WeakSet<object>();
        const walk=(value:unknown,path:string,level:number):void=>{
          if(!value || typeof value!=="object" || level>11 || seen.has(value)||matches.length>80)return;
          seen.add(value);
          if(Array.isArray(value)){value.slice(0,12).forEach((v,i)=>walk(v,path+"["+i+"]",level+1));return;}
          const obj=value as Record<string,unknown>;
          const ks=Object.keys(obj);
          if(ks.some(k=>/pitcher|probable|starter|abridor/i.test(k)))matches.push({path,keys:ks.filter(k=>/pitcher|probable|starter|abridor/i.test(k)),sample:JSON.stringify(obj).slice(0,850)});
          for(const k of ks){
            const v=obj[k];
            if(typeof v==="string" && /carver|medrano|cessa|rodr[ií]guez|bonta|romero/i.test(v))names.push({path:path+"."+k,sample:v.slice(0,180)});
            else if(typeof v==="object")walk(v,path+"."+k,level+1);
          }
        };
        walk(data,"root",0);
        base.pitcherMatches=matches.slice(0,30);
        base.names=names.slice(0,50);
        base.rootPreview=JSON.stringify(root).slice(0,2400);
      }
      return base;
    } catch(e) { return { key, error: String(e).slice(0,240) }; }
  }));
  return NextResponse.json({checked:"2026-11-03",sources:results});
}
