// Temporary read-only audit of public LMP archive metadata. Remove after QA.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Game = {
  gamePk?: number; gameDate?: string; broadcasts?: Array<Record<string,unknown>>;
  teams?: { away?: {team?:{name?:string}}; home?:{team?:{name?:string}} };
};

async function probe(id:number) {
 try {
  const u=`https://statsapi.mlb.com/api/v1/schedule?gamePk=${id}&hydrate=broadcasts`;
  const r=await fetch(u,{cache:"no-store",signal:AbortSignal.timeout(7000),headers:{Accept:"application/json"}});
  const j=await r.json();
  const games:Game[]=(j?.dates??[]).flatMap((d:{games?:Game[]})=>d.games??[]).filter((x:Game)=>x.gamePk===id);
  return {id,http:r.status,games:games.map(g=>({id:g.gamePk,date:g.gameDate,teams:[g.teams?.away?.team?.name,g.teams?.home?.team?.name],broadcasts:(g.broadcasts??[]).slice(0,20).map(v=>({
   name:v.name,type:v.type,mediaState:(v.mediaState as Record<string,unknown>|undefined)?.mediaStateCode,
   mediaId:v.mediaId,availableForStreaming:v.availableForStreaming,broadcastDate:v.broadcastDate,homeAway:v.homeAway
  }))}))};
 }catch(e){return{id,error:String(e)}}
}
async function youtubeFeed() {
 try {
  const r=await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=UCdW_4rN3OarOoawQ4Er-ZXw",{cache:"no-store",signal:AbortSignal.timeout(6500),headers:{Accept:"application/atom+xml"}});
  const body=await r.text();
  return {http:r.status,bytes:body.length,first:body.slice(0,350),videoIds:[...body.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g)].slice(0,5).map(m=>m[1])};
 }catch(e){return {error:String(e)}}
}
export async function GET(){
 const [games,youtube]=await Promise.all([Promise.all([850466,850474,850456,850465].map(probe)),youtubeFeed()]);
 return Response.json({games,youtube},{headers:{"Cache-Control":"no-store"}});
}
