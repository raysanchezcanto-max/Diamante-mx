export const dynamic="force-dynamic";
export async function GET() {
 try {
 const r=await fetch("https://api.lmp.mx/3.0.0/scoreboard/2026/11/04",{cache:"no-store",signal:AbortSignal.timeout(9000)});
 const json=await r.json();const games=Array.isArray(json?.response)?json.response:[];
 return Response.json({http:r.status,count:games.length,probables:games.map((g:any)=>({id:g.boxScore,away:g.awayTeamName,home:g.homeTeamName,awayId:g.awayProbablePitcherMlbid,homeId:g.homeProbablePitcherMlbid,awayName:g.awayProbablePitcher,homeName:g.homeProbablePitcher,awayImg:g.awayProbablePitcherImg,homeImg:g.homeProbablePitcherImg})).slice(0,10)});
 } catch(error) {return Response.json({error:String(error)});}
}