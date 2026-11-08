// Temporary public StatsAPI diagnostic for verified MLB broadcast mapping.
// Read-only. Remove after the validation run.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ScheduleGame = {
  gamePk?: number;
  gameDate?: string;
  gameType?: string;
  teams?: { away?: {team?: {name?: string}}; home?: {team?: {name?: string}} };
  broadcasts?: Array<Record<string, unknown>>;
};

async function probe(date: string) {
  try {
    const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${date}&hydrate=broadcasts`;
    const res = await fetch(url,{cache:"no-store",signal:AbortSignal.timeout(8000),headers:{"Accept":"application/json"}});
    const json = await res.json();
    const games: ScheduleGame[] = (json?.dates??[]).flatMap((d:{games?:ScheduleGame[]})=>d.games??[]);
    return {
      date,status:res.status,totalGames:games.length,
      samples:games.slice(0,15).map(g=>({
        gamePk:g.gamePk,
        home:g.teams?.home?.team?.name,
        away:g.teams?.away?.team?.name,
        broadcasts:(g.broadcasts??[]).slice(0,14),
        count:g.broadcasts?.length??0,
      })),
      withBroadcasts:games.filter(g=>g.broadcasts?.length).length,
    };
  } catch(err) {return {date,error:String(err)};}
}

async function byGamePk(gamePk:number) {
  try{
    const res=await fetch(`https://statsapi.mlb.com/api/v1/schedule?gamePk=${gamePk}&sportId=1&hydrate=broadcasts`,{cache:"no-store",signal:AbortSignal.timeout(7500)});
    const j=await res.json();
    const dates=j?.dates??[];
    return {gamePk,status:res.status,dates:dates.length,games:dates.flatMap((d:{games?:ScheduleGame[]})=>d.games??[]).map((g:ScheduleGame)=>({id:g.gamePk,count:g.broadcasts?.length??0,broadcasts:g.broadcasts}))};
  }catch(err){return {gamePk,error:String(err)};}
}

export async function GET(){
 const dates=["2026-04-03","2026-07-16","2026-07-17","2026-10-23"];
 const results=await Promise.all(dates.map(probe));
 const gamePks=results.flatMap(r=>"samples" in r?(r.samples??[]).filter(x=>x.count>0).slice(0,1).map(x=>x.gamePk):[]).filter((x):x is number=>typeof x==="number");
 return Response.json({results,byGamePk:await Promise.all(gamePks.map(byGamePk))},{headers:{"Cache-Control":"no-store"}});
}
