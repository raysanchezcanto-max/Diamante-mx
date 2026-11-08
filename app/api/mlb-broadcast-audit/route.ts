// Temporary diagnostic of publicly available MLB StatsAPI schedule dates.
// Remove after validating gamePk/date matching.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Game = {
  gamePk?: number; gameDate?: string; officialDate?:string;
  status?: {abstractGameState?:string;detailedState?:string};
  broadcasts?: Array<{name?:string;type?:string;broadcastDate?:string;availableForStreaming?:boolean;mediaState?:{mediaStateCode?:string}}>;
};
async function probe(gamePk: number) {
  try {
    const res = await fetch(`https://statsapi.mlb.com/api/v1/schedule?gamePk=${gamePk}&sportId=1&hydrate=broadcasts`,{
      cache:"no-store",signal:AbortSignal.timeout(8000)
    });
    const data=await res.json();
    return {
      gamePk,status:res.status,dates:(data.dates??[]).map((d:{date?:string;games?:Game[]})=>({
        date:d.date,
        games:(d.games??[]).map(g=>({
          gamePk:g.gamePk,gameDate:g.gameDate,officialDate:g.officialDate,
          status:g.status,
          tv:g.broadcasts?.filter(x=>x.type==="TV").map(x=>({
            name:x.name,date:x.broadcastDate,available:x.availableForStreaming,state:x.mediaState?.mediaStateCode
          }))
        }))
      }))
    };
  }catch(err){return{gamePk,error:String(err)}}
}
export async function GET(){
  return Response.json({results:await Promise.all([824766,823440,822789,849805].map(probe))},{headers:{"Cache-Control":"no-store"}});
}
